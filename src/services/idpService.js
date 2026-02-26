/**
 * IDP (Intelligent Document Processing) Service
 *
 * Handles document upload and processing through the IDP API:
 * 1. Authenticate with AWS Cognito (OAuth2 client credentials)
 * 2. Upload document to ingestion endpoint
 * 3. Trigger document extraction process
 */

class IDPService {
  constructor() {
    this.authURL = import.meta.env.VITE_IDP_AUTH_URL;
    this.clientId = import.meta.env.VITE_IDP_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_IDP_CLIENT_SECRET;
    this.apiKey = import.meta.env.VITE_IDP_API_KEY;
    this.submissionKey = import.meta.env.VITE_IDP_SUBMISSION_KEY;
    this.env = import.meta.env.VITE_IDP_ENV;

    this.apiBaseURL = import.meta.env.VITE_IDP_API_BASE_URL;

    // Token management
    this.accessToken = null;
    this.tokenExpiry = null;
    this.tokenPromise = null;

    this._restoreToken();

    console.log('[IDP Service] Initialized');
    console.log('[IDP Service] Environment:', import.meta.env.DEV ? 'Development' : 'Production');
    console.log('[IDP Service] API Base URL:', this.apiBaseURL);
    console.log('[IDP Service] Token cached:', !!this.accessToken);
  }

  _saveToken() {
    if (this.accessToken) {
      localStorage.setItem('idp_access_token', this.accessToken);
      localStorage.setItem('idp_token_expiry', String(this.tokenExpiry));
      console.log('[IDP Service] Token saved to localStorage');
    }
  }

  _restoreToken() {
    const token = localStorage.getItem('idp_access_token');
    const expiry = localStorage.getItem('idp_token_expiry');

    if (token && expiry && Date.now() < Number(expiry)) {
      this.accessToken = token;
      this.tokenExpiry = Number(expiry);
      console.log('[IDP Service] Token restored from session, expires in', Math.round((this.tokenExpiry - Date.now()) / 1000), 'seconds');
    } else if (token) {
      this.clearToken();
    }
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry - 60000) {
      console.log('[IDP Service] Using cached access token');
      return this.accessToken;
    }

    if (this.tokenPromise) {
      console.log('[IDP Service] Token request already in progress, waiting...');
      return this.tokenPromise;
    }

    console.log('[IDP Service] Fetching new access token from Cognito...');
    this.tokenPromise = this._fetchNewToken();

    try {
      return await this.tokenPromise;
    } finally {
      this.tokenPromise = null;
    }
  }

  async _fetchNewToken() {
    try {
      const response = await fetch(`/api/idp-auth?grant_type=client_credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[IDP Service] Auth error:', errorText);
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      this._saveToken();

      console.log('[IDP Service] Access token obtained, expires in', data.expires_in, 'seconds');
      return this.accessToken;
    } catch (error) {
      console.error('[IDP Service] Failed to get access token:', error);
      throw new Error(`Failed to authenticate with IDP: ${error.message}`);
    }
  }

  async uploadDocument(file) {
    console.log('[IDP Service] Uploading document:', file.name);

    try {
      const accessToken = await this.getAccessToken();

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/idp/core/v1/ingestion/data`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[IDP Service] Upload error:', errorText);
        throw new Error(`Document upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[IDP Service] Document uploaded successfully:', data);

      const submissionId = data.submission_request?.submissionId || data.submissionId || data.submission_id;

      if (!submissionId) {
        console.error('[IDP Service] Response structure:', JSON.stringify(data, null, 2));
        throw new Error('Upload response missing submissionId');
      }

      return {
        ...data,
        submission_id: submissionId,
      };
    } catch (error) {
      console.error('[IDP Service] Failed to upload document:', error);
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }

  async processDocument(submissionId, integrationSysId) {
    console.log('[IDP Service] Triggering document processing for submission:', submissionId);

    try {
      const accessToken = await this.getAccessToken();

      const payload = {
        payload: {
          submission_id: submissionId,
          submission_key: this.submissionKey,
          caller_metadata: [
            {
              name: 'integration_sys_id',
              value: integrationSysId,
            },
            {
              name: 'env',
              value: this.env,
            },
          ],
        },
      };

      const response = await fetch(`/api/idp/core/v1/ingestion/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'text/plain',
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[IDP Service] Process error:', errorText);
        throw new Error(`Document processing failed: ${response.status}`);
      }

      const data = await response.text();
      console.log('[IDP Service] Document processing triggered successfully:', data);

      return { success: true, message: data };
    } catch (error) {
      console.error('[IDP Service] Failed to process document:', error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }

  async uploadAndProcess(file, integrationSysId) {
    console.log('[IDP Service] Starting upload and process workflow for:', file.name);
    console.log('[IDP Service] Integration sys_id:', integrationSysId);

    try {
      const uploadResult = await this.uploadDocument(file);

      if (!uploadResult.submission_id) {
        throw new Error('Upload response missing submission_id');
      }

      console.log('[IDP Service] Received submission_id:', uploadResult.submission_id);

      const processResult = await this.processDocument(uploadResult.submission_id, integrationSysId);

      return {
        success: true,
        submissionId: uploadResult.submission_id,
        uploadResult,
        processResult,
      };
    } catch (error) {
      console.error('[IDP Service] Upload and process workflow failed:', error);
      throw error;
    }
  }

  async uploadAndProcessBatch(files, integrationSysId, onProgress) {
    console.log('[IDP Service] Starting batch upload for', files.length, 'files');
    console.log('[IDP Service] Integration sys_id:', integrationSysId);

    try {
      await this.getAccessToken();
      console.log('[IDP Service] Auth token ready for batch upload');
    } catch (error) {
      console.error('[IDP Service] Failed to get auth token for batch:', error);
      throw error;
    }

    const uploadPromises = files.map(async (file, index) => {
      try {
        console.log(`[IDP Service] [${index + 1}/${files.length}] Starting upload for:`, file.name);

        const result = await this.uploadAndProcess(file, integrationSysId);

        console.log(`[IDP Service] [${index + 1}/${files.length}] Upload successful:`, file.name);

        if (onProgress) {
          onProgress(index + 1, files.length, { success: true, fileName: file.name, ...result });
        }

        return {
          success: true,
          fileName: file.name,
          submissionId: result.submissionId,
          uploadResult: result.uploadResult,
          processResult: result.processResult,
        };
      } catch (error) {
        console.error(`[IDP Service] [${index + 1}/${files.length}] Upload failed for ${file.name}:`, error);

        if (onProgress) {
          onProgress(index + 1, files.length, { success: false, fileName: file.name, error: error.message });
        }

        return {
          success: false,
          fileName: file.name,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log('[IDP Service] Batch upload complete:', {
      total: files.length,
      successful: successCount,
      failed: failureCount,
    });

    return results;
  }

  clearToken() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.tokenPromise = null;
    localStorage.removeItem('idp_access_token');
    localStorage.removeItem('idp_token_expiry');
    console.log('[IDP Service] Token cleared from memory and localStorage');
  }
}

export default new IDPService();
