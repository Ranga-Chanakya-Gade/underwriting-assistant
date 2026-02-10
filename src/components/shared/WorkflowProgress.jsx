/**
 * Workflow Progress Component
 * Visual 8-stage workflow progress tracker for underwriting submissions
 * Shows: Submission → Documents → Triage → Review → Loss Control → Decision → Quote → Bind
 */

import { DxcFlex, DxcTypography, DxcBadge } from '@dxc-technology/halstack-react';

const WorkflowProgress = ({ workflow }) => {
  if (!workflow || !workflow.stages) {
    return null;
  }

  const { stages, currentStage, nextAction, targetCompletionDate, daysRemaining } = workflow;

  const getStageIcon = (stageName, status) => {
    const icons = {
      'Submission Received': 'inbox',
      'Documents Processed': 'description',
      'Triage Complete': 'sort',
      'Underwriting Review': 'search',
      'Loss Control Inspection': 'verified_user',
      'Final Decision': 'gavel',
      'Quote': 'request_quote',
      'Bind': 'check_circle'
    };

    if (status === 'complete') return 'check_circle';
    if (status === 'current') return 'radio_button_checked';
    if (status === 'blocked') return 'error';
    if (status === 'waived') return 'remove_circle';

    return icons[stageName] || 'circle';
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'complete':
        return '#37A526'; // Green
      case 'current':
        return '#1B75BB'; // Blue
      case 'blocked':
        return '#D02E2E'; // Red
      case 'waived':
        return '#808285'; // Gray
      case 'pending':
      default:
        return '#E0E0E0'; // Light gray
    }
  };

  const getStageTextColor = (status) => {
    switch (status) {
      case 'complete':
      case 'current':
      case 'blocked':
        return '#333333';
      case 'waived':
      case 'pending':
      default:
        return '#999999';
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
            Workflow Progress
          </DxcTypography>
          {daysRemaining !== undefined && (
            <DxcBadge
              label={`${daysRemaining} days to target`}
              mode="contextual"
              color={daysRemaining < 3 ? 'error' : daysRemaining < 7 ? 'warning' : 'info'}
            />
          )}
        </DxcFlex>

        {/* Visual Workflow */}
        <div style={{ position: 'relative', paddingTop: '20px' }}>
          <DxcFlex justifyContent="space-between" alignItems="flex-start">
            {stages.map((stage, index) => (
              <div key={index} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Connection Line */}
                {index < stages.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    width: 'calc(100% - 20px)',
                    height: '4px',
                    backgroundColor: stage.status === 'complete' ? '#37A526' : '#E0E0E0',
                    zIndex: 0
                  }} />
                )}

                {/* Stage Circle */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: getStageColor(stage.status),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: stage.status === 'current' ? '3px solid #1B75BB' : 'none',
                  boxShadow: stage.status === 'current' ? '0 0 0 4px rgba(27, 117, 187, 0.2)' : 'none',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.3s ease'
                }}>
                  <span
                    className="material-icons"
                    style={{
                      fontSize: '20px',
                      color: stage.status === 'pending' || stage.status === 'waived' ? '#999999' : '#FFFFFF'
                    }}
                  >
                    {getStageIcon(stage.name, stage.status)}
                  </span>
                </div>

                {/* Stage Label */}
                <div style={{ marginTop: '12px', textAlign: 'center', maxWidth: '100px' }}>
                  <DxcTypography
                    fontSize="font-scale-01"
                    fontWeight={stage.status === 'current' ? 'font-weight-semibold' : 'font-weight-regular'}
                    color={getStageTextColor(stage.status)}
                    style={{ lineHeight: '1.2' }}
                  >
                    {stage.name}
                  </DxcTypography>
                  {stage.date && (
                    <DxcTypography
                      fontSize="10px"
                      color="#999999"
                      style={{ marginTop: '4px' }}
                    >
                      {new Date(stage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </DxcTypography>
                  )}
                  {stage.status === 'waived' && (
                    <DxcTypography
                      fontSize="10px"
                      color="#999999"
                      style={{ marginTop: '4px', fontStyle: 'italic' }}
                    >
                      Waived
                    </DxcTypography>
                  )}
                </div>
              </div>
            ))}
          </DxcFlex>
        </div>

        {/* Next Action */}
        {nextAction && (
          <div style={{
            backgroundColor: '#E5F1FA',
            padding: 'var(--spacing-padding-m)',
            borderRadius: 'var(--border-radius-s)',
            borderLeft: '4px solid #1B75BB'
          }}>
            <DxcFlex gap="var(--spacing-gap-s)" alignItems="flex-start">
              <span className="material-icons" style={{ color: '#1B75BB', fontSize: '20px' }}>
                arrow_forward
              </span>
              <div>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#1B75BB">
                  Next Action
                </DxcTypography>
                <DxcTypography fontSize="font-scale-02" color="#333333">
                  {nextAction}
                </DxcTypography>
                {targetCompletionDate && (
                  <DxcTypography fontSize="font-scale-01" color="#666666" style={{ marginTop: '4px' }}>
                    Target: {new Date(targetCompletionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </DxcTypography>
                )}
              </div>
            </DxcFlex>
          </div>
        )}

        {/* Current Stage Details */}
        <div style={{
          padding: 'var(--spacing-padding-m)',
          backgroundColor: '#F5F5F5',
          borderRadius: 'var(--border-radius-s)'
        }}>
          <DxcFlex gap="var(--spacing-gap-l)">
            <div>
              <DxcTypography fontSize="font-scale-01" color="#666666">
                Current Stage
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                {currentStage}
              </DxcTypography>
            </div>
            <div>
              <DxcTypography fontSize="font-scale-01" color="#666666">
                Progress
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                {stages.filter(s => s.status === 'complete').length} of {stages.filter(s => s.status !== 'waived').length} completed
              </DxcTypography>
            </div>
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
};

export default WorkflowProgress;
