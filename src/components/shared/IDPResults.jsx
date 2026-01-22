import {
  DxcFlex,
  DxcTypography,
  DxcHeading,
  DxcBadge,
  DxcButton,
  DxcProgressBar,
} from '@dxc-technology/halstack-react';
import { idpConfidenceColor } from '../../data/mockDocuments';

const IDPResults = ({ document, onEdit, onValidate }) => {
  if (!document.extractionResults) {
    return (
      <div style={{ padding: 'var(--spacing-padding-m)', textAlign: 'center' }}>
        <DxcTypography color="var(--color-fg-neutral-dark)">
          No extraction results available
        </DxcTypography>
      </div>
    );
  }

  const { extractionResults } = document;
  const validationRate = Math.round(
    (extractionResults.validatedFields / extractionResults.extractedFields) * 100
  );

  const renderFieldValue = (label, value, flagged = false) => {
    if (value === null || value === undefined) return null;

    return (
      <div
        style={{
          padding: 'var(--spacing-padding-s)',
          backgroundColor: flagged
            ? 'var(--color-bg-warning-lightest)'
            : 'var(--color-bg-neutral-lightest)',
          borderRadius: 'var(--border-radius-s)',
          borderLeft: flagged ? '3px solid #FF6B00' : '3px solid #0095FF'
        }}
      >
        <DxcFlex justifyContent="space-between" alignItems="center">
          <DxcFlex direction="column" gap="var(--spacing-gap-xxs)">
            <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
              {label}
            </DxcTypography>
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
              {typeof value === 'object' ? JSON.stringify(value) : value}
            </DxcTypography>
          </DxcFlex>
          {flagged && (
            <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
              <span className="material-icons" style={{ fontSize: '18px', color: '#FF6B00' }}>
                flag
              </span>
              <DxcButton
                label="Review"
                mode="tertiary"
                size="small"
                onClick={() => onEdit && onEdit(label)}
              />
            </DxcFlex>
          )}
        </DxcFlex>
      </div>
    );
  };

  const renderSection = (title, data, icon) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <div>
        <DxcFlex gap="var(--spacing-gap-s)" alignItems="center" style={{ marginBottom: 'var(--spacing-gap-s)' }}>
          {icon && (
            <span className="material-icons" style={{ fontSize: '20px', color: '#0095FF' }}>
              {icon}
            </span>
          )}
          <DxcHeading level={5} text={title} />
        </DxcFlex>
        <DxcFlex direction="column" gap="var(--spacing-gap-s)">
          {Object.entries(data).map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return renderFieldValue(label, value, false);
          })}
        </DxcFlex>
      </div>
    );
  };

  return (
    <DxcFlex direction="column" gap="var(--spacing-gap-l)">
      {/* Extraction Summary */}
      <div
        style={{
          padding: 'var(--spacing-padding-m)',
          backgroundColor: 'var(--color-bg-neutral-lightest)',
          borderRadius: 'var(--border-radius-m)',
          borderTop: `4px solid ${idpConfidenceColor(document.confidence)}`
        }}
      >
        <DxcFlex direction="column" gap="var(--spacing-gap-m)">
          <DxcFlex justifyContent="space-between" alignItems="center">
            <DxcHeading level={4} text="Extraction Summary" />
            <DxcFlex gap="var(--spacing-gap-s)">
              {onValidate && (
                <DxcButton
                  label="Validate All"
                  icon="verified"
                  mode="secondary"
                  onClick={onValidate}
                />
              )}
              {onEdit && (
                <DxcButton
                  label="Edit Extraction"
                  icon="edit"
                  mode="tertiary"
                  onClick={() => onEdit()}
                />
              )}
            </DxcFlex>
          </DxcFlex>

          <DxcFlex gap="var(--spacing-gap-l)" wrap="wrap">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                CONFIDENCE SCORE
              </DxcTypography>
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color={idpConfidenceColor(document.confidence)}
              >
                {document.confidence}%
              </DxcTypography>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                FIELDS EXTRACTED
              </DxcTypography>
              <DxcTypography fontSize="32px" fontWeight="font-weight-semibold" color="#0095FF">
                {extractionResults.extractedFields}
              </DxcTypography>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                VALIDATION RATE
              </DxcTypography>
              <DxcTypography fontSize="32px" fontWeight="font-weight-semibold" color="#24A148">
                {validationRate}%
              </DxcTypography>
            </div>
            {extractionResults.flaggedFields > 0 && (
              <div style={{ flex: 1, minWidth: '200px' }}>
                <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)">
                  FLAGGED FOR REVIEW
                </DxcTypography>
                <DxcTypography fontSize="32px" fontWeight="font-weight-semibold" color="#FF6B00">
                  {extractionResults.flaggedFields}
                </DxcTypography>
              </div>
            )}
          </DxcFlex>

          <div>
            <DxcTypography fontSize="12px" color="var(--color-fg-neutral-stronger)" style={{ marginBottom: 'var(--spacing-gap-xs)' }}>
              VALIDATION PROGRESS
            </DxcTypography>
            <DxcProgressBar
              value={validationRate}
              showValue={true}
            />
          </div>
        </DxcFlex>
      </div>

      {/* Application Form Fields */}
      {document.documentType === 'Application Form' && (
        <>
          {renderFieldValue('Applicant Name', extractionResults.applicantName)}
          {renderFieldValue('Date of Birth', extractionResults.dateOfBirth)}
          {renderFieldValue('SSN', extractionResults.ssn)}
          {renderFieldValue('Address', extractionResults.address)}
          {renderFieldValue('Occupation', extractionResults.occupation)}
          {renderFieldValue('Annual Income', extractionResults.annualIncome)}
          {renderFieldValue('Coverage Requested', extractionResults.coverageRequested)}
          {renderFieldValue('Line of Business', extractionResults.lineOfBusiness)}
          {extractionResults.termLength && renderFieldValue('Term Length', extractionResults.termLength)}
          {renderFieldValue('Beneficiary', extractionResults.beneficiary)}

          {extractionResults.medicalHistory && renderSection('Medical History', extractionResults.medicalHistory, 'local_hospital')}
        </>
      )}

      {/* Medical Exam Fields */}
      {document.documentType === 'Medical Records' && (
        <>
          {renderFieldValue('Exam Date', extractionResults.examDate)}
          {renderFieldValue('Examiner', extractionResults.examiner)}
          {renderFieldValue('Facility', extractionResults.facility)}
          {extractionResults.vitalSigns && renderSection('Vital Signs', extractionResults.vitalSigns, 'favorite')}
          {extractionResults.labResults && renderSection('Lab Results', extractionResults.labResults, 'science')}
          {extractionResults.urinalysis && renderSection('Urinalysis', extractionResults.urinalysis, 'opacity')}
          {extractionResults.summary && renderFieldValue('Summary', extractionResults.summary)}
        </>
      )}

      {/* Financial Statement Fields */}
      {document.documentType === 'Financial Statement' && (
        <>
          {renderFieldValue('Tax Year', extractionResults.taxYear)}
          {renderFieldValue('Filing Status', extractionResults.filingStatus)}
          {renderFieldValue('Total Income', extractionResults.totalIncome)}
          {renderFieldValue('Wages', extractionResults.wages)}
          {extractionResults.otherIncome && renderFieldValue('Other Income', extractionResults.otherIncome)}
          {renderFieldValue('Adjusted Gross Income', extractionResults.adjustedGrossIncome)}
          {renderFieldValue('Taxable Income', extractionResults.taxableIncome)}
          {renderFieldValue('Total Tax', extractionResults.totalTax)}
          {renderFieldValue('Occupation', extractionResults.occupation)}
          {renderFieldValue('Employer', extractionResults.employer)}
        </>
      )}

      {/* Flagged Fields Section */}
      {extractionResults.flaggedFields > 0 && (
        <div
          style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: 'var(--color-bg-warning-lightest)',
            borderRadius: 'var(--border-radius-m)',
            borderLeft: '4px solid #FF6B00'
          }}
        >
          <DxcFlex direction="column" gap="var(--spacing-gap-s)">
            <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
              <span className="material-icons" style={{ fontSize: '24px', color: '#FF6B00' }}>
                flag
              </span>
              <DxcHeading level={5} text="Fields Requiring Review" />
            </DxcFlex>
            <DxcTypography fontSize="font-scale-03" color="var(--color-fg-neutral-dark)">
              {extractionResults.flaggedFields} field(s) have been flagged for manual review due to low confidence or validation conflicts.
            </DxcTypography>
          </DxcFlex>
        </div>
      )}
    </DxcFlex>
  );
};

export default IDPResults;
