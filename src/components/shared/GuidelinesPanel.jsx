/**
 * Guidelines Panel Component
 * Displays underwriting guidelines, authority limits, referral criteria, and appetite information
 */

import { DxcFlex, DxcTypography, DxcBadge } from '@dxc-technology/halstack-react';

const GuidelinesPanel = ({ guidelines, referral, coverageAmount }) => {
  if (!guidelines) {
    return null;
  }

  const getAppetiteColor = (appetiteMatch) => {
    switch (appetiteMatch) {
      case 'Preferred':
        return 'success';
      case 'Standard':
        return 'info';
      case 'Conditional':
        return 'warning';
      case 'Out of Appetite':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-neutral-lightest)',
      borderRadius: 'var(--border-radius-m)',
      padding: 'var(--spacing-padding-l)',
      boxShadow: 'var(--shadow-mid-02)'
    }}>
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        {/* Header */}
        <DxcFlex justifyContent="space-between" alignItems="center">
          <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
            Underwriting Guidelines
          </DxcTypography>
          <DxcBadge
            label={guidelines.appetiteMatch}
            mode="contextual"
            color={getAppetiteColor(guidelines.appetiteMatch)}
          />
        </DxcFlex>

        {/* Authority Limits */}
        {referral && (
          <div style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: referral.required ? '#FFF3E0' : '#E8F5E9',
            borderRadius: 'var(--border-radius-s)',
            borderLeft: referral.required ? '4px solid #FFA500' : '4px solid #37A526'
          }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcFlex alignItems="center" gap="var(--spacing-gap-xs)">
                <span
                  className="material-icons"
                  style={{ color: referral.required ? '#FFA500' : '#37A526', fontSize: '20px' }}
                >
                  {referral.required ? 'warning' : 'check_circle'}
                </span>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                  Authority Limit
                </DxcTypography>
              </DxcFlex>

              <DxcFlex gap="var(--spacing-gap-l)">
                <div>
                  <DxcTypography fontSize="font-scale-01" color="#666666">
                    Your Authority
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                    {formatCurrency(referral.yourLimit)}
                  </DxcTypography>
                </div>
                <div>
                  <DxcTypography fontSize="font-scale-01" color="#666666">
                    Coverage Amount
                  </DxcTypography>
                  <DxcTypography
                    fontSize="font-scale-02"
                    fontWeight="font-weight-semibold"
                    color={referral.required ? '#D02E2E' : '#37A526'}
                  >
                    {formatCurrency(coverageAmount)}
                  </DxcTypography>
                </div>
              </DxcFlex>

              {referral.required && (
                <div style={{
                  marginTop: 'var(--spacing-gap-xs)',
                  padding: 'var(--spacing-padding-s)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--border-radius-s)'
                }}>
                  <DxcTypography fontSize="font-scale-01" color="#D02E2E" fontWeight="font-weight-semibold">
                    ⚠️ Referral Required
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-02" color="#333333">
                    {referral.reason} → Refer to: {referral.referTo}
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-01" color="#666666" style={{ marginTop: '4px' }}>
                    Guideline Reference: {referral.guidelineReference}
                  </DxcTypography>
                </div>
              )}
            </DxcFlex>
          </div>
        )}

        {/* Appetite Notes */}
        <div>
          <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333">
            Appetite Guidance
          </DxcTypography>
          <DxcTypography fontSize="font-scale-02" color="#666666" style={{ marginTop: '8px' }}>
            {guidelines.appetiteNotes}
          </DxcTypography>
        </div>

        {/* Required Endorsements */}
        {guidelines.requiredEndorsements && guidelines.requiredEndorsements.length > 0 && (
          <div>
            <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333" style={{ marginBottom: '8px' }}>
              Required Endorsements
            </DxcTypography>
            <DxcFlex gap="var(--spacing-gap-xs)" wrap="wrap">
              {guidelines.requiredEndorsements.map((endorsement, index) => (
                <div
                  key={index}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#E5F1FA',
                    borderRadius: 'var(--border-radius-s)',
                    border: '1px solid #1B75BB'
                  }}
                >
                  <DxcTypography fontSize="font-scale-01" color="#1B75BB" fontWeight="font-weight-medium">
                    {endorsement}
                  </DxcTypography>
                </div>
              ))}
            </DxcFlex>
          </div>
        )}

        {/* Restrictions */}
        {guidelines.restrictions && guidelines.restrictions !== 'None' && (
          <div style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: '#FFF3E0',
            borderRadius: 'var(--border-radius-s)'
          }}>
            <DxcFlex gap="var(--spacing-gap-xs)" alignItems="flex-start">
              <span className="material-icons" style={{ color: '#FFA500', fontSize: '20px' }}>
                info
              </span>
              <div>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#FFA500">
                  Restrictions
                </DxcTypography>
                <DxcTypography fontSize="font-scale-02" color="#333333" style={{ marginTop: '4px' }}>
                  {guidelines.restrictions}
                </DxcTypography>
              </div>
            </DxcFlex>
          </div>
        )}

        {/* Referral Triggers */}
        {guidelines.referralTriggers && guidelines.referralTriggers.length > 0 && (
          <div>
            <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333" style={{ marginBottom: '8px' }}>
              Referral Triggers
            </DxcTypography>
            <div style={{
              padding: 'var(--spacing-padding-m)',
              backgroundColor: '#F5F5F5',
              borderRadius: 'var(--border-radius-s)'
            }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {guidelines.referralTriggers.map((trigger, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    <DxcTypography fontSize="font-scale-02" color="#666666">
                      {trigger}
                    </DxcTypography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Reference Footer */}
        <div style={{
          padding: 'var(--spacing-padding-s)',
          backgroundColor: '#E5F1FA',
          borderRadius: 'var(--border-radius-s)',
          borderLeft: '4px solid #1B75BB'
        }}>
          <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
            <span className="material-icons" style={{ color: '#1B75BB', fontSize: '18px' }}>
              library_books
            </span>
            <DxcTypography fontSize="font-scale-01" color="#1B75BB" fontWeight="font-weight-medium">
              📖 Access full underwriting guidelines in Rules Library
            </DxcTypography>
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
};

export default GuidelinesPanel;
