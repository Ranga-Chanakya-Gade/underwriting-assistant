import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Explicitly point to the repo root .env so dotenv finds it regardless of CWD
dotenv.config({ path: resolve(__dirname, '..', '.env') });

const app = express();

const SN_INSTANCE    = process.env.VITE_SN_INSTANCE    || 'https://nextgenbpmnp1.service-now.com';
const SN_CLIENT_ID   = process.env.VITE_SN_CLIENT_ID;
const SN_CLIENT_SEC  = process.env.VITE_SN_CLIENT_SECRET;
const SN_USERNAME    = process.env.VITE_SN_USERNAME;
const SN_PASSWORD    = process.env.VITE_SN_PASSWORD;
const IDP_AUTH_URL   = process.env.VITE_IDP_AUTH_URL;
const IDP_API_BASE   = process.env.VITE_IDP_API_BASE_URL;
// Derive production origin from VITE_SN_REDIRECT_URI (strip trailing slash)
const PROD_ORIGIN    = process.env.VITE_SN_REDIRECT_URI?.replace(/\/$/, '');

// ── CORS ───────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  PROD_ORIGIN,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Helper: forward only safe headers upstream ─────────────────────
function pickHeaders(reqHeaders, ...keys) {
  const out = {};
  for (const k of keys) {
    if (reqHeaders[k]) out[k] = reqHeaders[k];
  }
  return out;
}

// ================================================================
// ServiceNow OAuth  →  POST /oauth_token.do
// ================================================================
app.post(
  '/api/servicenow-oauth',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const snRes = await fetch(`${SN_INSTANCE}/oauth_token.do`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    new URLSearchParams(req.body).toString(),
      });
      const text = await snRes.text();
      res.status(snRes.status).type('application/json').send(text);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ================================================================
// ServiceNow Auto-Connect  →  POST /api/sn-auto-connect
// Uses Basic Auth (same as claims assistant pattern).
// Tests the connection then returns a pseudo-token so the frontend
// can mark itself as connected without needing OAuth.
// ================================================================
app.post('/api/sn-auto-connect', async (_req, res) => {
  if (!SN_USERNAME || !SN_PASSWORD) {
    return res.status(500).json({ error: 'SN_USERNAME / SN_PASSWORD not configured on server' });
  }

  const basicAuth = `Basic ${Buffer.from(`${SN_USERNAME}:${SN_PASSWORD}`).toString('base64')}`;

  try {
    // Lightweight test — fetch 1 record from the submission table
    const APP_PREFIX = process.env.VITE_SN_APP_PREFIX || 'x_dxcis_underwri_0';
    const testRes = await fetch(
      `${SN_INSTANCE}/api/now/table/${APP_PREFIX}_submission?sysparm_limit=1&sysparm_fields=sys_id`,
      { headers: { 'Authorization': basicAuth, 'Accept': 'application/json' } }
    );

    console.log('[sn-auto-connect] Basic Auth test status:', testRes.status);

    if (!testRes.ok) {
      const body = await testRes.text();
      console.error('[sn-auto-connect] Basic Auth failed:', body.substring(0, 200));
      return res.status(testRes.status).json({ error: 'ServiceNow rejected credentials', detail: body });
    }

    // Return a pseudo-token — the proxy will inject real Basic Auth on every request
    res.json({ access_token: 'sn_basic_auth', expires_in: 86400 });
  } catch (err) {
    console.error('[sn-auto-connect] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================================================================
// ServiceNow Table API  →  /api/now/table/...
// Path is passed as ?path= to preserve the full SN endpoint URL.
// Uses raw body to avoid express.json() issues in Express 5.
// ================================================================
app.all(
  '/api/servicenow-api',
  express.raw({ type: '*/*', limit: '10mb' }),
  async (req, res) => {
    const snPath = req.query.snpath;
    if (!snPath) return res.status(400).json({ error: 'Missing ?snpath= query param' });

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.body?.length > 0;

    try {
      const snRes = await fetch(`${SN_INSTANCE}${snPath}`, {
        method:  req.method,
        headers: {
          'Accept': 'application/json',
          ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
          ...pickHeaders(req.headers, 'authorization'),
        },
        ...(hasBody ? { body: req.body } : {}),
      });
      const text = await snRes.text();
      res.status(snRes.status).type('application/json').send(text);
    } catch (err) {
      console.error('[servicenow-api]', err.message, err.cause?.message);
      res.status(500).json({ error: err.message, cause: err.cause?.message });
    }
  },
);

// ================================================================
// ServiceNow Attachment  →  /api/now/attachment/...
// ================================================================
app.all(
  '/api/servicenow-attachment/*path',
  express.raw({ type: '*/*', limit: '100mb' }),
  async (req, res) => {
    const snPath = req.path.replace('/api/servicenow-attachment', '/api/now/attachment');
    const qs     = new URLSearchParams(req.query).toString();
    const url    = `${SN_INSTANCE}${snPath}${qs ? '?' + qs : ''}`;

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.body?.length > 0;
    try {
      const snRes = await fetch(url, {
        method:  req.method,
        headers: pickHeaders(req.headers, 'content-type', 'authorization', 'accept'),
        ...(hasBody ? { body: req.body } : {}),
      });
      const text = await snRes.text();
      res.status(snRes.status).send(text);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ================================================================
// IDP / Cognito Auth  →  AWS Cognito /oauth2/token
// ================================================================
app.post(
  '/api/idp-auth',
  express.urlencoded({ extended: true }),
  async (req, res) => {
    if (!IDP_AUTH_URL) return res.status(500).json({ error: 'IDP_AUTH_URL not configured' });

    const qs  = new URLSearchParams(req.query).toString();
    const url = `${IDP_AUTH_URL}${qs ? '?' + qs : ''}`;
    try {
      const idpRes = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    new URLSearchParams(req.body).toString(),
      });
      const text = await idpRes.text();
      res.status(idpRes.status).type('application/json').send(text);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ================================================================
// IDP API  →  https://api.dev-1.hub-1.sai-dev.assure.dxc.com/...
// Handles JSON, text/plain, and multipart/form-data (file uploads)
// ================================================================
app.all(
  '/api/idp/*path',
  express.raw({ type: '*/*', limit: '100mb' }),
  async (req, res) => {
    if (!IDP_API_BASE) return res.status(500).json({ error: 'IDP_API_BASE_URL not configured' });

    const idpPath = req.path.replace('/api/idp', '/idp');
    const qs      = new URLSearchParams(req.query).toString();
    const url     = `${IDP_API_BASE}${idpPath}${qs ? '?' + qs : ''}`;

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.body?.length > 0;
    try {
      const idpRes = await fetch(url, {
        method:  req.method,
        headers: pickHeaders(req.headers, 'content-type', 'accept', 'authorization', 'x-api-key'),
        ...(hasBody ? { body: req.body } : {}),
      });
      const text = await idpRes.text();
      res.status(idpRes.status).send(text);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ── Global error handler ───────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[proxy error]', err);
  res.status(500).json({ error: err.message });
});

export default app;
