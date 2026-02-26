import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // OAuth token exchange → ServiceNow directly
      '/api/servicenow-oauth': {
        target: 'https://nextgenbpmnp1.service-now.com',
        changeOrigin: true,
        rewrite: () => '/oauth_token.do',
      },
      // All table/API calls → ServiceNow directly
      '/api/servicenow-api': {
        target: 'https://nextgenbpmnp1.service-now.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL('http://x' + path);
          return url.searchParams.get('path') || '/';
        },
      },
      // ServiceNow Attachment API proxy
      '/api/servicenow-attachment': {
        target: 'https://nextgenbpmnp1.service-now.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/servicenow-attachment/, '/api/now/attachment'),
      },
      // IDP API proxy - avoids CORS in dev
      '/idp-api': {
        target: 'https://api.dev-1.hub-1.sai-dev.assure.dxc.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/idp-api/, ''),
      }
    }
  }
})
