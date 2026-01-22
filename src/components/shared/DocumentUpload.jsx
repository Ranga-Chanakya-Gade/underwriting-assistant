import { useState } from 'react';
import {
  DxcFlex,
  DxcTypography,
  DxcButton,
  DxcSelect,
  DxcAlert,
  DxcInset,
} from '@dxc-technology/halstack-react';
import { documentTypes } from '../../data/mockDocuments';

const DocumentUpload = ({ submissionId, onUploadComplete, onCancel }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentType, setDocumentType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const documentTypeOptions = Object.entries(documentTypes).map(([key, value]) => ({
    label: value,
    value: key
  }));

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0 || !documentType) {
      return;
    }

    setUploading(true);

    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete({
            files: selectedFiles,
            documentType: documentTypes[documentType],
            submissionId
          });
        }
        setUploadSuccess(false);
        setSelectedFiles([]);
        setDocumentType('');
      }, 2000);
    }, 2000);
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
                  Document(s) uploaded successfully! Processing will begin automatically.
                </DxcTypography>
              </DxcInset>
            }
          />
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
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <DxcFlex direction="column" gap="var(--spacing-gap-m)" alignItems="center">
            <span className="material-icons" style={{ fontSize: '48px', color: '#0095FF' }}>
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
              <DxcTypography fontSize="font-scale-03" color="#0095FF">
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
                    borderLeft: '3px solid #0095FF'
                  }}
                >
                  <DxcFlex justifyContent="space-between" alignItems="center">
                    <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                      <span className="material-icons" style={{ color: '#0095FF' }}>
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

        {/* Document Type Selection */}
        {selectedFiles.length > 0 && (
          <DxcSelect
            label="Document Type"
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
            label={uploading ? "Uploading..." : "Upload Documents"}
            icon={uploading ? "sync" : "cloud_upload"}
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || !documentType || uploading}
          />
        </DxcFlex>

        {/* Upload Info */}
        <div
          style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: 'var(--color-bg-info-lightest)',
            borderRadius: 'var(--border-radius-s)',
            borderLeft: '3px solid #0095FF'
          }}
        >
          <DxcFlex gap="var(--spacing-gap-s)">
            <span className="material-icons" style={{ fontSize: '20px', color: '#0095FF' }}>
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
