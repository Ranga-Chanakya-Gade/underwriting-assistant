import { DxcFlex, DxcTypography } from '@dxc-technology/halstack-react';

const ALERT_COLORS = {
  warning:  { bg: '#fee2e2', border: '#fca5a5', iconColor: '#b91c1c', labelBg: '#fca5a5', labelColor: '#991b1b', label: 'Warning' },
  watch:    { bg: '#fef9c3', border: '#fde68a', iconColor: '#d97706', labelBg: '#fde68a', labelColor: '#92400e', label: 'Watch'   },
  advisory: { bg: '#e0f0fc', border: '#93c5fd', iconColor: '#1d4ed8', labelBg: '#93c5fd', labelColor: '#1e3a5f', label: 'Advisory' },
};

const ALERT_ICONS = {
  hurricane:     'air',
  tornado:       'air',
  severe_storm:  'thunderstorm',
  flood:         'water',
  wildfire:      'local_fire_department',
  winter_storm:  'ac_unit',
};

const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

const WeatherAlerts = ({ weatherData }) => {
  if (!weatherData) {
    return (
      <div style={{
        padding: '24px', textAlign: 'center',
        border: '1px dashed #e0e5e4', borderRadius: '8px',
        backgroundColor: '#F2F7F6',
      }}>
        <span className="material-icons-outlined" style={{ color: '#e0e5e4', fontSize: '40px' }}>cloud_off</span>
        <DxcTypography fontSize="font-scale-02" color="#808285" style={{ marginTop: '8px' }}>
          No weather alert data available for this submission
        </DxcTypography>
      </div>
    );
  }

  const highPriorityAlerts = weatherData.alerts.filter((a) => a.severity === 'warning');
  const hasAlerts = weatherData.alerts.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Active Alerts */}
      {hasAlerts && (
        <div style={{
          border: '1px solid #fde68a',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#fef9c3',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #fde68a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
              <span className="material-icons-outlined" style={{ color: '#d97706', fontSize: '20px' }}>warning_amber</span>
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" color="#92400e">
                Active Weather Alerts ({weatherData.alerts.length})
              </DxcTypography>
            </DxcFlex>
            <span style={{
              padding: '2px 10px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 700,
              backgroundColor: '#fde68a', color: '#92400e',
            }}>
              ACTIVE
            </span>
          </div>

          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <DxcTypography fontSize="font-scale-02" color="#92400e">
              {highPriorityAlerts.length > 0
                ? `${highPriorityAlerts.length} warning(s) may impact insured properties`
                : 'Monitoring weather conditions in affected areas'}
            </DxcTypography>

            {weatherData.alerts.map((alert) => {
              const cfg = ALERT_COLORS[alert.severity] || ALERT_COLORS.advisory;
              const icon = ALERT_ICONS[alert.type] || 'cloud';

              return (
                <div key={alert.id} style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: `1px solid ${cfg.border}`,
                  backgroundColor: cfg.bg,
                }}>
                  <DxcFlex gap="var(--spacing-gap-s)" alignItems="flex-start">
                    <span className="material-icons-outlined" style={{ color: cfg.iconColor, fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>
                      {icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <DxcFlex justifyContent="space-between" alignItems="flex-start" gap="var(--spacing-gap-s)">
                        <div>
                          <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333">
                            {alert.title}
                          </DxcTypography>
                          <DxcTypography fontSize="font-scale-01" color="#808285" style={{ marginTop: '2px' }}>
                            {alert.affectedStates.join(', ')}
                          </DxcTypography>
                        </div>
                        <span style={{
                          padding: '2px 8px', borderRadius: '999px', fontSize: '0.625rem',
                          fontWeight: 700, backgroundColor: cfg.labelBg,
                          color: cfg.labelColor, whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase',
                        }}>
                          {cfg.label}
                        </span>
                      </DxcFlex>

                      <DxcTypography fontSize="font-scale-02" color="#555555" style={{ marginTop: '6px' }}>
                        {alert.description}
                      </DxcTypography>

                      {alert.type === 'hurricane' && alert.category !== undefined && (
                        <DxcFlex gap="var(--spacing-gap-m)" style={{ marginTop: '6px' }}>
                          <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333">
                            Category {alert.category}
                          </DxcTypography>
                          {alert.windSpeed && (
                            <DxcTypography fontSize="font-scale-02" color="#808285">
                              Winds: {alert.windSpeed} mph
                            </DxcTypography>
                          )}
                        </DxcFlex>
                      )}

                      <DxcFlex justifyContent="space-between" style={{ marginTop: '8px' }}>
                        <DxcTypography fontSize="font-scale-01" color="#808285">
                          Effective: {formatDateTime(alert.effectiveDate)}
                        </DxcTypography>
                        <DxcTypography fontSize="font-scale-01" color="#808285">
                          Expires: {formatDateTime(alert.expirationDate)}
                        </DxcTypography>
                      </DxcFlex>
                    </div>
                  </DxcFlex>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk Impact Assessment */}
      <div className="detail-card">
        <div className="detail-card-header">
          <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
            <span className="material-icons-outlined" style={{ color: '#1B75BB', fontSize: '20px' }}>analytics</span>
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" color="#333333">
              Risk Impact Assessment
            </DxcTypography>
          </DxcFlex>
          <DxcTypography fontSize="font-scale-01" color="#808285" style={{ marginTop: '2px' }}>
            Updated {formatDateTime(weatherData.lastUpdated)}
          </DxcTypography>
        </div>
        <div className="detail-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#F2F7F6', border: '1px solid #e0e5e4', textAlign: 'center' }}>
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold" color="#000000">
                {weatherData.riskImpact.affectedProperties.toLocaleString()}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="#808285" style={{ marginTop: '4px' }}>
                Properties in Alert Areas
              </DxcTypography>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#F2F7F6', border: '1px solid #e0e5e4', textAlign: 'center' }}>
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold" color="#000000">
                ${(weatherData.riskImpact.estimatedExposure / 1000000).toFixed(1)}M
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="#808285" style={{ marginTop: '4px' }}>
                Estimated Exposure
              </DxcTypography>
            </div>
            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#F2F7F6', border: '1px solid #e0e5e4', textAlign: 'center' }}>
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold" color="#000000">
                {weatherData.nearbyStorms.length}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="#808285" style={{ marginTop: '4px' }}>
                Nearby Storm Systems
              </DxcTypography>
            </div>
          </div>

          {weatherData.riskImpact.recommendedActions.length > 0 && (
            <div>
              <DxcFlex alignItems="center" gap="var(--spacing-gap-s)" style={{ marginBottom: '10px' }}>
                <span className="material-icons-outlined" style={{ color: '#1B75BB', fontSize: '16px' }}>checklist</span>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333">
                  Recommended Actions
                </DxcTypography>
              </DxcFlex>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {weatherData.riskImpact.recommendedActions.map((action, i) => (
                  <DxcFlex key={i} alignItems="flex-start" gap="8px">
                    <span className="material-icons-outlined" style={{ color: '#1B75BB', fontSize: '16px', marginTop: '1px', flexShrink: 0 }}>
                      arrow_right
                    </span>
                    <DxcTypography fontSize="font-scale-02" color="#555555">{action}</DxcTypography>
                  </DxcFlex>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nearby Storm Systems */}
      {weatherData.nearbyStorms.length > 0 && (
        <div className="detail-card">
          <div className="detail-card-header">
            <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
              <span className="material-icons-outlined" style={{ color: '#1B75BB', fontSize: '20px' }}>radar</span>
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" color="#333333">
                Nearby Storm Systems ({weatherData.nearbyStorms.length})
              </DxcTypography>
            </DxcFlex>
            <DxcTypography fontSize="font-scale-01" color="#808285" style={{ marginTop: '2px' }}>
              Monitoring systems that may affect insured areas
            </DxcTypography>
          </div>
          <div className="detail-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {weatherData.nearbyStorms.map((storm) => {
                const cfg = ALERT_COLORS[storm.severity] || ALERT_COLORS.advisory;
                const icon = ALERT_ICONS[storm.type] || 'cloud';
                return (
                  <div key={storm.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '6px',
                    border: '1px solid #e0e5e4', backgroundColor: '#F2F7F6',
                  }}>
                    <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
                      <span className="material-icons-outlined" style={{ color: cfg.iconColor, fontSize: '18px' }}>
                        {icon}
                      </span>
                      <div>
                        <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold" color="#333333">
                          {storm.title}
                        </DxcTypography>
                        <DxcTypography fontSize="font-scale-01" color="#808285">
                          {storm.affectedStates.join(', ')}
                        </DxcTypography>
                      </div>
                    </DxcFlex>
                    <span style={{
                      padding: '2px 8px', borderRadius: '999px', fontSize: '0.625rem',
                      fontWeight: 700, border: `1px solid ${cfg.border}`,
                      backgroundColor: '#fff', color: cfg.iconColor, textTransform: 'capitalize',
                    }}>
                      {storm.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;
