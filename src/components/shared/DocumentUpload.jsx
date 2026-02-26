import { useState, useRef } from 'react';
import {
  DxcFlex,
  DxcTypography,
  DxcButton,
  DxcSelect,
  DxcAlert,
  DxcInset,
} from '@dxc-technology/halstack-react';
import { documentTypes } from '../../data/mockDocuments';
import idpService from '../../services/idpService';
import { uploadAttachment, isConnected } from '../../services/servicenow';

const DocumentUpload = ({ submissionId, tableName, onUploadComplete, onCancel }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentType, setDocumentType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [uploadPhase, setUploadPhase] = useState('');  // 'sn' | 'idp' | ''
  const fileInputRef = useRef(null);

  const documentTypeOptions = Object.entries(documentTypes).map(([key, value]) => ({
    label: value,
    value: key
  }));

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadError('');
    setUploadPhase('');
    setProgress({ current: 0, total: selectedFiles.length });

    const errors = [];

    try {
      // Step 1: ServiceNow Attachment API — save file to the submission record first
      let snResults = [];
      if (tableName && submissionId && isConnected()) {
        setUploadPhase('sn');
        snResults = await Promise.all(
          selectedFiles.map(file =>
            uploadAttachment(file, tableName, submissionId)
              .then(res => ({ success: true, fileName: file.name, result: res }))
              .catch(err => ({ success: false, fileName: file.name, error: err.message }))
          )
        );
        const snFailures = snResults.filter(r => !r.success);
        if (snFailures.length > 0) {
          errors.push(`ServiceNow upload failed for: ${snFailures.map(f => f.fileName).join(', ')}`);
        }
      } else if (tableName && !submissionId) {
        errors.push('Document saved to IDP only — ServiceNow submission record not ready yet.');
      }

      // Step 2: IDP — upload & trigger extraction
      setUploadPhase('idp');
      const idpResults = await idpService.uploadAndProcessBatch(
        selectedFiles,
        submissionId,
        (current, total) => setProgress({ current, total })
      );
      const idpFailures = idpResults.filter(r => !r.success);
      if (idpFailures.length > 0) {
        errors.push(`IDP processing failed for: ${idpFailures.map(f => f.fileName).join(', ')}`);
      }

      if (errors.length > 0) setUploadError(errors.join(' | '));
      setUploadSuccess(true);
      setUploadPhase('');

      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete({
            files: selectedFiles,
            documentType: documentType ? documentTypes[documentType] : '',
            submissionId,
            idpResults,
            snResults,
          });
        }
        setUploadSuccess(false);
        setSelectedFiles([]);
        setDocumentType('');
        setProgress({ current: 0, total: 0 });
      }, 2000);
    } catch (error) {
      setUploadError(error.message);
      setUploadPhase('');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div
      style={{
        padding: 'var(--spacing-padding-l)',
        backgroundColor: 'var(--color-bg-neutral-lightest)',
        borderRadius: 'var(--border-radius-m)',
        boxShadow: 'var(--shadow-mid-02)'
      }}
    >
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        {uploadSuccess && (
          <DxcAlert
            type="success"
            mode="inline"
            children={
              <DxcInset space="var(--spacing-padding-s)">
                <DxcTypography fontSize="font-scale-03">
                  Document(s) uploaded successfully! IDP processing has been triggered.
                </DxcTypography>
              </DxcInset>
            }
          />
        )}

        {uploadError && (
          <DxcAlert
            type="error"
            mode="inline"
            children={
              <DxcInset space="var(--spacing-padding-s)">
                <DxcTypography fontSize="font-scale-03">{uploadError}</DxcTypography>
              </DxcInset>
            }
          />
        )}

        {uploading && (
          <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
            <span className="material-icons" style={{ fontSize: '18px', color: '#1B75BB', animation: 'spin 1s linear infinite' }}>
              sync
            </span>
            <DxcTypography fontSize="font-scale-02" color="#1B75BB">
              {uploadPhase === 'sn'
                ? `Saving to ServiceNow (${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''})...`
                : uploadPhase === 'idp'
                  ? `Sending to IDP for extraction (${progress.current} of ${progress.total})...`
                  : 'Uploading...'}
            </DxcTypography>
          </DxcFlex>
        )}

        {/* Upload Area */}
        <div
          style={{
            border: '2px dashed var(--color-border-neutral-medium)',
            borderRadius: 'var(--border-radius-m)',
            padding: 'var(--spacing-padding-xl)',
            textAlign: 'center',
            backgroundColor: selectedFiles.length > 0
              ? 'var(--color-bg-info-lightest)'
              : 'var(--color-bg-neutral-lighter)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <DxcFlex direction="column" gap="var(--spacing-gap-m)" alignItems="center">
            <span className="material-icons" style={{ fontSize: '48px', color: '#1B75BB' }}>
              cloud_upload
            </span>
            <div>
              <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-semibold">
                Drop files here or click to browse
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </DxcTypography>
            </div>
            {selectedFiles.length > 0 && (
              <DxcTypography fontSize="font-scale-03" color="#1B75BB">
                {selectedFiles.length} file(s) selected
              </DxcTypography>
            )}
          </DxcFlex>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div>
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" style={{ marginBottom: 'var(--spacing-gap-s)' }}>
              Selected Files
            </DxcTypography>
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    padding: 'var(--spacing-padding-s)',
                    backgroundColor: 'var(--color-bg-neutral-lighter)',
                    borderRadius: 'var(--border-radius-s)',
                    borderLeft: '3px solid #1B75BB'
                  }}
                >
                  <DxcFlex justifyContent="space-between" alignItems="center">
                    <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                      <span className="material-icons" style={{ color: '#1B75BB' }}>
                        description
                      </span>
                      <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
                        <DxcTypography fontSize="font-scale-03">
                          {file.name}
                        </DxcTypography>
                        <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                          {formatFileSize(file.size)}
                        </DxcTypography>
                      </DxcFlex>
                    </DxcFlex>
                    <DxcButton
                      icon="close"
                      mode="tertiary"
                      title="Remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                      }}
                    />
                  </DxcFlex>
                </div>
              ))}
            </DxcFlex>
          </div>
        )}

        {/* Document Type Selection (optional) */}
        {selectedFiles.length > 0 && (
          <DxcSelect
            label="Document Type (optional)"
            placeholder="Select document type"
            options={documentTypeOptions}
            value={documentType}
            onChange={({ value }) => setDocumentType(value)}
          />
        )}

        {/* Action Buttons */}
        <DxcFlex justifyContent="flex-end" gap="var(--spacing-gap-m)">
          <DxcButton
            label="Cancel"
            mode="tertiary"
            onClick={onCancel}
            disabled={uploading}
          />
          <DxcButton
            label={
              uploading
                ? (uploadPhase === 'sn' ? 'Saving to ServiceNow...' : uploadPhase === 'idp' ? 'Sending to IDP...' : 'Uploading...')
                : selectedFiles.length === 0
                  ? 'Select Files'
                  : 'Upload Documents'
            }
            icon={uploading ? "sync" : selectedFiles.length === 0 ? "folder_open" : "cloud_upload"}
            onClick={() => {
              if (uploading) return;
              if (selectedFiles.length === 0) {
                fileInputRef.current?.click();
              } else {
                handleUpload();
              }
            }}
            disabled={uploading}
          />
        </DxcFlex>

        {/* Upload Info */}
        <div
          style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: 'var(--color-bg-info-lightest)',
            borderRadius: 'var(--border-radius-s)',
            borderLeft: '3px solid #1B75BB'
          }}
        >
          <DxcFlex gap="var(--spacing-gap-s)">
            <span className="material-icons" style={{ fontSize: '20px', color: '#1B75BB' }}>
              info
            </span>
            <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                What happens after upload?
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                1. Documents are automatically classified and routed
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                2. IDP (Intelligent Document Processing) extracts key data fields
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                3. Extracted data is validated and flagged for review if needed
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                4. Processing typically completes within 20-30 seconds
              </DxcTypography>
            </DxcFlex>
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
};

export default DocumentUpload;
