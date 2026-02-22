/**
 * Reports & Inspections Panel Component
 * Displays third-party reports status: MVR, Credit, Loss Control Inspections
 * Allows ordering new reports
 */

import { DxcFlex, DxcTypography, DxcBadge, DxcButton } from '@dxc-technology/halstack-react';

const ReportsPanel = ({ reports }) => {
  if (!reports) {
    return null;
  }

  const { mvr, credit, lossControl } = reports;

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'success';
      case 'pending':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'required':
        return 'warning';
      case 'waived':
      case 'not_required':
        return 'neutral';
      case 'not_ordered':
      default:
        return 'error';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'pending':
        return 'Pending';
      case 'scheduled':
        return 'Scheduled';
      case 'required':
        return 'Required';
      case 'waived':
        return 'Waived';
      case 'not_required':
        return 'Not Required';
      case 'not_ordered':
      default:
        return 'Not Ordered';
    }
  };

  const _getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return 'check_circle';
      case 'pending':
        return 'pending';
      case 'scheduled':
        return 'event';
      case 'required':
        return 'warning';
      case 'waived':
      case 'not_required':
        return 'remove_circle';
      case 'not_ordered':
      default:
        return 'error';
    }
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
            Reports & Inspections
          </DxcTypography>
          <DxcButton
            label="Order Reports"
            mode="secondary"
            icon="add"
            size="small"
            onClick={() => alert('Report ordering workflow would open here')}
          />
        </DxcFlex>

        {/* MVR Reports */}
        <div style={{
          padding: 'var(--spacing-padding-m)',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--border-radius-s)',
          border: '1px solid #E0E0E0'
        }}>
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                <span className="material-icons" style={{ color: '#1B75BB', fontSize: '24px' }}>
                  directions_car
                </span>
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                  MVR Reports (Motor Vehicle Records)
                </DxcTypography>
              </DxcFlex>
              <DxcBadge
                label={getStatusLabel(mvr.status)}
                mode="contextual"
                color={getStatusColor(mvr.status)}
              />
            </DxcFlex>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'var(--spacing-gap-m)'
            }}>
              <div>
                <DxcTypography fontSize="font-scale-01" color="#666666">
                  Total Drivers
                </DxcTypography>
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-bold" color="#333333">
                  {mvr.total}
                </DxcTypography>
              </div>
              <div>
                <DxcTypography fontSize="font-scale-01" color="#666666">
                  Complete
                </DxcTypography>
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-bold" color="#000000">
                  {mvr.complete}
                </DxcTypography>
              </div>
              <div>
                <DxcTypography fontSize="font-scale-01" color="#666666">
                  Pending
                </DxcTypography>
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-bold" color="#000000">
                  {mvr.pending}
                </DxcTypography>
              </div>
              <div>
                <DxcTypography fontSize="font-scale-01" color="#666666">
                  Flagged
                </DxcTypography>
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-bold" color="#000000">
                  {mvr.flagged}
                </DxcTypography>
              </div>
            </div>

            {mvr.lastOrdered && (
              <DxcTypography fontSize="font-scale-01" color="#666666">
                Last Ordered: {new Date(mvr.lastOrdered).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </DxcTypography>
            )}

            {mvr.flagged > 0 && (
              <div style={{
                padding: 'var(--spacing-padding-s)',
                backgroundColor: '#FFF3E0',
                borderRadius: 'var(--border-radius-s)',
                borderLeft: '4px solid #FFA500'
              }}>
                <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                  <span className="material-icons" style={{ color: '#FFA500', fontSize: '18px' }}>
                    warning
                  </span>
                  <DxcTypography fontSize="font-scale-01" color="#FFA500" fontWeight="font-weight-semibold">
                    {mvr.flagged} MVR{mvr.flagged > 1 ? 's' : ''} flagged for review
                  </DxcTypography>
                </DxcFlex>
              </div>
            )}

            {mvr.status === 'pending' && (
              <DxcButton
                label="View MVR Status"
                mode="tertiary"
                icon="visibility"
                size="small"
                onClick={() => alert('MVR report details would open here')}
              />
            )}

            {mvr.status === 'not_ordered' && (
              <DxcButton
                label={`Order ${mvr.total} MVR Reports`}
                mode="primary"
                icon="add"
                size="small"
                onClick={() => alert(`Ordering ${mvr.total} MVR reports...`)}
              />
            )}
          </DxcFlex>
        </div>

        {/* Credit Reports */}
        <div style={{
          padding: 'var(--spacing-padding-m)',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--border-radius-s)',
          border: '1px solid #E0E0E0'
        }}>
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                <span className="material-icons" style={{ color: '#1B75BB', fontSize: '24px' }}>
                  account_balance
                </span>
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                  Business Credit Report
                </DxcTypography>
              </DxcFlex>
              <DxcBadge
                label={getStatusLabel(credit.status)}
                mode="contextual"
                color={getStatusColor(credit.status)}
              />
            </DxcFlex>

            {credit.score ? (
              <>
                <div>
                  <DxcTypography fontSize="font-scale-01" color="#666666">
                    Credit Score
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold" color="#000000">
                    {credit.score}
                  </DxcTypography>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#E0E0E0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(credit.score / 850) * 100}%`,
                    height: '100%',
                    backgroundColor: credit.score >= 700 ? '#37A526' : credit.score >= 650 ? '#FFA500' : '#D02E2E',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <DxcTypography fontSize="font-scale-01" color="#666666">
                  {credit.score >= 700 ? 'Excellent - Preferred pricing eligible' :
                   credit.score >= 650 ? 'Good - Standard pricing' :
                   'Fair - May require higher deductible or pricing adjustment'}
                </DxcTypography>
              </>
            ) : (
              <DxcButton
                label="Order Credit Report"
                mode="primary"
                icon="add"
                size="small"
                onClick={() => alert('Ordering credit report...')}
              />
            )}
          </DxcFlex>
        </div>

        {/* Loss Control Inspection */}
        <div style={{
          padding: 'var(--spacing-padding-m)',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--border-radius-s)',
          border: '1px solid #E0E0E0'
        }}>
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                <span className="material-icons" style={{ color: '#1B75BB', fontSize: '24px' }}>
                  verified_user
                </span>
                <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                  Loss Control Inspection
                </DxcTypography>
              </DxcFlex>
              <DxcBadge
                label={getStatusLabel(lossControl.status)}
                mode="contextual"
                color={getStatusColor(lossControl.status)}
              />
            </DxcFlex>

            {lossControl.type && (
              <div>
                <DxcTypography fontSize="font-scale-01" color="#666666">
                  Inspection Type
                </DxcTypography>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333">
                  {lossControl.type}
                </DxcTypography>
              </div>
            )}

            {lossControl.scheduled && (
              <div style={{
                padding: 'var(--spacing-padding-s)',
                backgroundColor: '#E5F1FA',
                borderRadius: 'var(--border-radius-s)',
                borderLeft: '4px solid #1B75BB'
              }}>
                <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                  <span className="material-icons" style={{ color: '#1B75BB', fontSize: '18px' }}>
                    event
                  </span>
                  <div>
                    <DxcTypography fontSize="font-scale-01" color="#1B75BB" fontWeight="font-weight-semibold">
                      Scheduled
                    </DxcTypography>
                    <DxcTypography fontSize="font-scale-02" color="#333333">
                      {new Date(lossControl.scheduled).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </DxcTypography>
                  </div>
                </DxcFlex>
              </div>
            )}

            {lossControl.reason && (
              <div>
                <DxcTypography fontSize="font-scale-01" color="#666666">
                  Reason
                </DxcTypography>
                <DxcTypography fontSize="font-scale-02" color="#333333">
                  {lossControl.reason}
                </DxcTypography>
              </div>
            )}

            {lossControl.status === 'required' && !lossControl.scheduled && (
              <DxcButton
                label="Schedule Inspection"
                mode="primary"
                icon="event"
                size="small"
                onClick={() => alert('Inspection scheduling workflow would open here')}
              />
            )}

            {lossControl.status === 'waived' && (
              <div style={{
                padding: 'var(--spacing-padding-s)',
                backgroundColor: '#E8F5E9',
                borderRadius: 'var(--border-radius-s)'
              }}>
                <DxcTypography fontSize="font-scale-02" color="#000000">
                  ✓ Inspection waived - {lossControl.reason}
                </DxcTypography>
              </div>
            )}
          </DxcFlex>
        </div>

        {/* Quick Actions Footer */}
        <div style={{
          padding: 'var(--spacing-padding-m)',
          backgroundColor: '#F5F5F5',
          borderRadius: 'var(--border-radius-s)'
        }}>
          <DxcTypography fontSize="font-scale-01" color="#666666" style={{ marginBottom: '8px' }}>
            Common Third-Party Services
          </DxcTypography>
          <DxcFlex gap="var(--spacing-gap-s)" wrap="wrap">
            <DxcButton label="LexisNexis" mode="tertiary" size="small" />
            <DxcButton label="Verisk" mode="tertiary" size="small" />
            <DxcButton label="ISO" mode="tertiary" size="small" />
            <DxcButton label="CLUE Report" mode="tertiary" size="small" />
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
};

export default ReportsPanel;
