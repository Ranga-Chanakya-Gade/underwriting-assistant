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
            backgroundColor: referral.required ? '#FFE8CC' : '#D5F2CE',
            borderRadius: 'var(--border-radius-s)',
            borderLeft: referral.required ? '4px solid #F6921E' : '4px solid #37A526'
          }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcFlex alignItems="center" gap="var(--spacing-gap-xs)">
                <span
                  className="material-icons"
                  style={{ color: referral.required ? '#F6921E' : '#37A526', fontSize: '20px' }}
                >
                  {referral.required ? 'warning' : 'check_circle'}
                </span>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                  Authority Limit
                </DxcTypography>
              </DxcFlex>

              <DxcFlex gap="var(--spacing-gap-l)">
                <div>
                  <div style={{ display: 'block', marginBottom: '4px' }}>
                    <DxcTypography fontSize="font-scale-01" color="#666666">
                      Your Authority
                    </DxcTypography>
                  </div>
                  <div style={{ display: 'block' }}>
                    <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#000000">
                      {formatCurrency(referral.yourLimit)}
                    </DxcTypography>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'block', marginBottom: '4px' }}>
                    <DxcTypography fontSize="font-scale-01" color="#666666">
                      Coverage Amount
                    </DxcTypography>
                  </div>
                  <div style={{ display: 'block' }}>
                    <DxcTypography
                      fontSize="font-scale-02"
                      fontWeight="font-weight-semibold"
                      color="#000000"
                    >
                      {formatCurrency(coverageAmount)}
                    </DxcTypography>
                  </div>
                </div>
              </DxcFlex>

              {referral.required && (
                <div style={{
                  marginTop: 'var(--spacing-gap-xs)',
                  padding: 'var(--spacing-padding-s)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--border-radius-s)'
                }}>
                  <div style={{ display: 'block', marginBottom: '8px' }}>
                    <DxcTypography fontSize="font-scale-01" color="#D02E2E" fontWeight="font-weight-semibold">
                      ⚠️ Referral Required
                    </DxcTypography>
                  </div>
                  <div style={{ display: 'block', marginBottom: '8px' }}>
                    <DxcTypography fontSize="font-scale-02" color="#333333">
                      {referral.reason} → Refer to: {referral.referTo}
                    </DxcTypography>
                  </div>
                  <div style={{ display: 'block' }}>
                    <DxcTypography fontSize="font-scale-01" color="#666666">
                      Guideline Reference: {referral.guidelineReference}
                    </DxcTypography>
                  </div>
                </div>
              )}
            </DxcFlex>
          </div>
        )}

        {/* Appetite Notes */}
        <div>
          <div style={{ display: 'block', marginBottom: '8px' }}>
            <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333">
              Appetite Guidance
            </DxcTypography>
          </div>
          <div style={{ display: 'block' }}>
            <DxcTypography fontSize="font-scale-02" color="#666666">
              {guidelines.appetiteNotes}
            </DxcTypography>
          </div>
        </div>

        {/* Required Endorsements */}
        {guidelines.requiredEndorsements && guidelines.requiredEndorsements.length > 0 && (
          <div>
            <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333" style={{ marginBottom: '12px' }}>
              Required Endorsements
            </DxcTypography>
            <DxcFlex gap="var(--spacing-gap-s)" wrap="wrap">
              {guidelines.requiredEndorsements.map((endorsement, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    backgroundColor: '#1B75BB20',
                    borderRadius: '24px',
                    border: '1px solid #1B75BB4D',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B75BB33';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B75BB20';
                  }}
                >
                  <span className="material-icons" style={{ color: '#1B75BB', fontSize: '18px' }}>
                    verified
                  </span>
                  <DxcTypography fontSize="font-scale-01" color="#1B75BB" fontWeight="font-weight-semibold">
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
            backgroundColor: '#FFE8CC',
            borderRadius: 'var(--border-radius-s)'
          }}>
            <DxcFlex gap="var(--spacing-gap-xs)" alignItems="flex-start">
              <span className="material-icons" style={{ color: '#F6921E', fontSize: '20px' }}>
                info
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'block', marginBottom: '4px' }}>
                  <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#F6921E">
                    Restrictions
                  </DxcTypography>
                </div>
                <div style={{ display: 'block' }}>
                  <DxcTypography fontSize="font-scale-02" color="#333333">
                    {guidelines.restrictions}
                  </DxcTypography>
                </div>
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
              backgroundColor: '#F8F9FA',
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
          backgroundColor: '#D6E9F7',
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
