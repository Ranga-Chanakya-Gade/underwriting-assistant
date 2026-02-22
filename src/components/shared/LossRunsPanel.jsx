/**
 * Loss Runs Panel Component
 * Displays loss history with detailed claims, AI summary, and frequency/severity analysis
 */

import { DxcFlex, DxcTypography, DxcBadge } from '@dxc-technology/halstack-react';

const LossRunsPanel = ({ lossRuns }) => {
  if (!lossRuns) {
    return null;
  }

  const { summary, claims, aiSummary } = lossRuns;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'None':
      case 'Low':
        return 'success';
      case 'Average':
        return 'info';
      case 'Above Average':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'None':
      case 'Low':
        return 'success';
      case 'Low-Moderate':
      case 'Moderate':
        return 'warning';
      case 'Moderate-High':
      case 'High':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getClaimStatusColor = (status) => {
    return status === 'Closed' ? '#37A526' : '#FFA500';
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
            Loss Runs
          </DxcTypography>
          <DxcTypography fontSize="font-scale-01" color="#666666">
            Period: {summary.period}
          </DxcTypography>
        </DxcFlex>

        {/* Summary Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--spacing-gap-m)'
        }}>
          <div style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: '#F5F5F5',
            borderRadius: 'var(--border-radius-s)'
          }}>
            <DxcTypography fontSize="font-scale-01" color="#666666">
              Total Claims
            </DxcTypography>
            <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold" color="#000000">
              {summary.totalClaims}
            </DxcTypography>
          </div>

          <div style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: '#F5F5F5',
            borderRadius: 'var(--border-radius-s)'
          }}>
            <DxcTypography fontSize="font-scale-01" color="#666666">
              Total Incurred
            </DxcTypography>
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-bold" color="#000000">
              {formatCurrency(summary.totalIncurred)}
            </DxcTypography>
          </div>

          <div style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: '#F5F5F5',
            borderRadius: 'var(--border-radius-s)'
          }}>
            <DxcTypography fontSize="font-scale-01" color="#666666">
              Total Paid
            </DxcTypography>
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-bold" color="#000000">
              {formatCurrency(summary.totalPaid)}
            </DxcTypography>
          </div>

          <div style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: '#F5F5F5',
            borderRadius: 'var(--border-radius-s)'
          }}>
            <DxcTypography fontSize="font-scale-01" color="#666666">
              Total Reserved
            </DxcTypography>
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-bold" color="#000000">
              {formatCurrency(summary.totalReserved)}
            </DxcTypography>
          </div>
        </div>

        {/* Frequency & Severity */}
        <DxcFlex gap="var(--spacing-gap-m)">
          <div style={{ flex: 1 }}>
            <DxcTypography fontSize="font-scale-01" color="#666666" style={{ marginBottom: '4px' }}>
              Frequency
            </DxcTypography>
            <DxcBadge
              label={summary.frequency}
              mode="contextual"
              color={getFrequencyColor(summary.frequency)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <DxcTypography fontSize="font-scale-01" color="#666666" style={{ marginBottom: '4px' }}>
              Severity
            </DxcTypography>
            <DxcBadge
              label={summary.severity}
              mode="contextual"
              color={getSeverityColor(summary.severity)}
            />
          </div>
        </DxcFlex>

        {/* Loss History Analysis */}
        {aiSummary && (
          <div style={{
            padding: 'var(--spacing-padding-m)',
            backgroundColor: '#E5F1FA',
            borderRadius: 'var(--border-radius-s)',
            borderLeft: '4px solid #1B75BB'
          }}>
            <DxcFlex gap="var(--spacing-gap-s)" alignItems="flex-start">
              <span className="material-icons" style={{ color: '#1B75BB', fontSize: '20px' }}>
                psychology
              </span>
              <div>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#1B75BB">
                  Loss History Analysis
                </DxcTypography>
                <DxcTypography fontSize="font-scale-02" color="#333333" style={{ marginTop: '8px' }}>
                  {aiSummary}
                </DxcTypography>
              </div>
            </DxcFlex>
          </div>
        )}

        {/* Claims Table */}
        {claims && claims.length > 0 && (
          <div>
            <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333" style={{ marginBottom: '12px' }}>
              Claim Details ({claims.length})
            </DxcTypography>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--border-radius-s)',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5F5F5', borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#333333'
                    }}>
                      Date
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#333333'
                    }}>
                      Type
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#333333'
                    }}>
                      Description
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#333333'
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: '#333333'
                    }}>
                      Incurred
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: '#333333'
                    }}>
                      Paid
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: '#333333'
                    }}>
                      Reserved
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid #E0E0E0',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <DxcTypography fontSize="font-scale-02" color="#333333">
                          {new Date(claim.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </DxcTypography>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: '#E5F1FA',
                          borderRadius: '4px'
                        }}>
                          <DxcTypography fontSize="font-scale-01" color="#1B75BB" fontWeight="font-weight-medium">
                            {claim.type}
                          </DxcTypography>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <DxcTypography fontSize="font-scale-02" color="#666666">
                          {claim.description}
                        </DxcTypography>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                          <span
                            className="material-icons"
                            style={{
                              fontSize: '16px',
                              color: getClaimStatusColor(claim.status)
                            }}
                          >
                            {claim.status === 'Closed' ? 'check_circle' : 'pending'}
                          </span>
                          <DxcTypography
                            fontSize="font-scale-02"
                            color={getClaimStatusColor(claim.status)}
                            fontWeight="font-weight-medium"
                          >
                            {claim.status}
                          </DxcTypography>
                        </DxcFlex>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#000000">
                          {formatCurrency(claim.incurred)}
                        </DxcTypography>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <DxcTypography fontSize="font-scale-02" color="#000000">
                          {formatCurrency(claim.paid)}
                        </DxcTypography>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <DxcTypography fontSize="font-scale-02" color="#000000">
                          {formatCurrency(claim.reserved)}
                        </DxcTypography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Claims Message */}
        {claims && claims.length === 0 && (
          <div style={{
            padding: 'var(--spacing-padding-l)',
            backgroundColor: '#E8F5E9',
            borderRadius: 'var(--border-radius-s)',
            textAlign: 'center'
          }}>
            <span className="material-icons" style={{ fontSize: '48px', color: '#37A526', marginBottom: '12px' }}>
              verified
            </span>
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" color="#000000">
              Excellent Loss History
            </DxcTypography>
            <DxcTypography fontSize="font-scale-02" color="#666666" style={{ marginTop: '8px' }}>
              No claims in the last {summary.period.split('-')[1] - summary.period.split('-')[0]} years
            </DxcTypography>
          </div>
        )}
      </DxcFlex>
    </div>
  );
};

export default LossRunsPanel;
