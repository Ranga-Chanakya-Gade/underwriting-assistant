import {
  DxcFlex,
  DxcTypography,
  DxcBadge,
  DxcButton,
  DxcProgressBar,
} from '@dxc-technology/halstack-react';
import { getDocumentStatusColor, idpConfidenceColor } from '../../data/mockDocuments';

const DocumentCard = ({ document, onView, onDownload, compact = false }) => {
  const hasExtraction = document.extractionResults !== null;
  const isProcessing = document.status === 'Processing';

  return (
    <div
      style={{
        padding: compact ? 'var(--spacing-padding-s)' : 'var(--spacing-padding-m)',
        backgroundColor: 'var(--color-bg-neutral-lighter)',
        borderRadius: 'var(--border-radius-s)',
        borderLeft: hasExtraction
          ? `4px solid ${idpConfidenceColor(document.confidence)}`
          : '4px solid var(--color-bg-neutral-light)'
      }}
    >
      <DxcFlex direction="column" gap="var(--spacing-gap-s)">
        {/* Header */}
        <DxcFlex justifyContent="space-between" alignItems="flex-start">
          <DxcFlex direction="column" gap="var(--spacing-gap-xs)" grow={1}>
            <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
              <span className="material-icons" style={{ color: '#0095FF', fontSize: '20px' }}>
                description
              </span>
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                {document.fileName}
              </DxcTypography>
            </DxcFlex>
            <DxcFlex gap="var(--spacing-gap-m)" alignItems="center" wrap="wrap">
              <DxcBadge
                label={document.documentType}
                mode="contextual"
                color="info"
                size="small"
              />
              <DxcBadge
                label={document.status}
                mode="contextual"
                color={getDocumentStatusColor(document.status)}
                size="small"
              />
              {hasExtraction && document.confidence && (
                <DxcTypography fontSize="12px" color={idpConfidenceColor(document.confidence)}>
                  {document.confidence}% Confidence
                </DxcTypography>
              )}
            </DxcFlex>
          </DxcFlex>

          <DxcFlex gap="var(--spacing-gap-s)">
            {onView && (
              <DxcButton
                icon="visibility"
                mode="tertiary"
                title="View Document"
                onClick={() => onView(document)}
              />
            )}
            {onDownload && (
              <DxcButton
                icon="download"
                mode="tertiary"
                title="Download"
                onClick={() => onDownload(document)}
              />
            )}
          </DxcFlex>
        </DxcFlex>

        {/* Processing Indicator */}
        {isProcessing && (
          <div>
            <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)" style={{ marginBottom: 'var(--spacing-gap-xs)' }}>
              Processing document...
            </DxcTypography>
            <DxcProgressBar showValue={false} />
          </div>
        )}

        {/* Details */}
        {!compact && (
          <DxcFlex gap="var(--spacing-gap-l)" wrap="wrap">
            <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
              <span className="material-icons" style={{ fontSize: '16px', color: 'var(--color-fg-neutral-dark)' }}>
                insert_drive_file
              </span>
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                {document.fileSize}
              </DxcTypography>
            </DxcFlex>
            <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
              <span className="material-icons" style={{ fontSize: '16px', color: 'var(--color-fg-neutral-dark)' }}>
                pages
              </span>
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                {document.pageCount} pages
              </DxcTypography>
            </DxcFlex>
            <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
              <span className="material-icons" style={{ fontSize: '16px', color: 'var(--color-fg-neutral-dark)' }}>
                schedule
              </span>
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                {document.uploadedDate}
              </DxcTypography>
            </DxcFlex>
            <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
              <span className="material-icons" style={{ fontSize: '16px', color: 'var(--color-fg-neutral-dark)' }}>
                person
              </span>
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                {document.uploadedBy}
              </DxcTypography>
            </DxcFlex>
          </DxcFlex>
        )}

        {/* Extraction Summary */}
        {hasExtraction && document.extractionResults && !compact && (
          <div
            style={{
              padding: 'var(--spacing-padding-s)',
              backgroundColor: 'var(--color-bg-success-lightest)',
              borderRadius: 'var(--border-radius-s)',
              marginTop: 'var(--spacing-gap-xs)'
            }}
          >
            <DxcFlex gap="var(--spacing-gap-l)" alignItems="center">
              <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                <span className="material-icons" style={{ fontSize: '16px', color: '#24A148' }}>
                  check_circle
                </span>
                <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                  {document.extractionResults.extractedFields} fields extracted
                </DxcTypography>
              </DxcFlex>
              <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                <span className="material-icons" style={{ fontSize: '16px', color: '#24A148' }}>
                  verified
                </span>
                <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                  {document.extractionResults.validatedFields} validated
                </DxcTypography>
              </DxcFlex>
              {document.extractionResults.flaggedFields > 0 && (
                <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                  <span className="material-icons" style={{ fontSize: '16px', color: '#FF6B00' }}>
                    flag
                  </span>
                  <DxcTypography fontSize="12px" color="#FF6B00">
                    {document.extractionResults.flaggedFields} flagged for review
                  </DxcTypography>
                </DxcFlex>
              )}
            </DxcFlex>
          </div>
        )}
      </DxcFlex>
    </div>
  );
};

export default DocumentCard;
