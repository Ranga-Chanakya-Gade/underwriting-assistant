import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();

const SN_INSTANCE  = process.env.VITE_SN_INSTANCE    || 'https://nextgenbpmnp1.service-now.com';
const IDP_AUTH_URL = process.env.VITE_IDP_AUTH_URL;
const IDP_API_BASE = process.env.VITE_IDP_API_BASE_URL;

// ── CORS ───────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://underwriting-assistant-chi.vercel.app',
  ],
  credentials: true,
}));

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
// ServiceNow Table API  →  /api/now/table/...
// Path is passed as ?path= to preserve the full SN endpoint URL.
// ================================================================
app.all(
  '/api/servicenow-api',
  express.json(),
  async (req, res) => {
    const path = req.query.path;
    if (!path) return res.status(400).json({ error: 'Missing ?path= query param' });

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    try {
      const snRes = await fetch(`${SN_INSTANCE}${path}`, {
        method:  req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
          ...pickHeaders(req.headers, 'authorization'),
        },
        ...(hasBody ? { body: JSON.stringify(req.body) } : {}),
      });
      const text = await snRes.text();
      res.status(snRes.status).type('application/json').send(text);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ================================================================
// ServiceNow Attachment  →  /api/now/attachment/...
// ================================================================
app.all(
  '/api/servicenow-attachment/*',
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
  '/api/idp/*',
  express.raw({ type: '*/*', limit: '100mb' }),
  async (req, res) => {
    if (!IDP_API_BASE) return res.status(500).json({ error: 'IDP_API_BASE_URL not configured' });

    const idpPath = req.path.replace('/api/idp', '');
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

export default app;
