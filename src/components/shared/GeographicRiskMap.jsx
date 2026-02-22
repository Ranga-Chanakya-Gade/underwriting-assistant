import { useState } from 'react';
import { DxcFlex, DxcTypography } from '@dxc-technology/halstack-react';
import USMapSVG from './USMapSVG';

const RISK_COLORS = {
  low:      '#22c55e',
  medium:   '#f59e0b',
  high:     '#f97316',
  critical: '#ef4444',
  none:     '#e0e5e4',
};

const RISK_LABEL_COLORS = {
  low:      { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
  medium:   { bg: '#fef9c3', color: '#92400e', border: '#fde68a' },
  high:     { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  critical: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

const GeographicRiskMap = ({ data, riskCategory }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  const stateColors = {};
  if (data && data.states) {
    Object.keys(data.states).forEach((code) => {
      const s = data.states[code];
      stateColors[code] = RISK_COLORS[s.riskLevel] || RISK_COLORS.none;
    });
  }

  const handleStateClick = (stateCode) => {
    const stateData = data && data.states ? data.states[stateCode] : null;
    setSelectedState(stateData || null);
  };

  const formatMoney = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Map card */}
      <div className="detail-card">
        <div className="detail-card-header">
          <DxcFlex alignItems="center" justifyContent="space-between">
            <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
              <span className="material-icons-outlined" style={{ color: '#1B75BB', fontSize: '20px' }}>map</span>
              <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" color="#333333">
                Geographic Risk Distribution
              </DxcTypography>
            </DxcFlex>
            <DxcTypography fontSize="font-scale-01" color="#808285">
              {riskCategory || data?.category || 'Portfolio Risk'} · Click a state for details
            </DxcTypography>
          </DxcFlex>
        </div>

        <div className="detail-card-body">
          <DxcFlex gap="var(--spacing-gap-l)" style={{ flexWrap: 'wrap' }}>

            {/* Map */}
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{
                border: '1px solid #e0e5e4', borderRadius: '8px',
                backgroundColor: '#F2F7F6', padding: '16px',
              }}>
                <USMapSVG
                  stateColors={stateColors}
                  onStateClick={handleStateClick}
                  onStateHover={setHoveredState}
                  selectedState={selectedState?.state || null}
                  hoveredState={hoveredState}
                />
              </div>

              {/* Legend */}
              <DxcFlex gap="var(--spacing-gap-m)" style={{ marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {Object.entries(RISK_COLORS).filter(([k]) => k !== 'none').map(([level, color]) => (
                  <DxcFlex key={level} alignItems="center" gap="6px">
                    <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: color, flexShrink: 0 }} />
                    <DxcTypography fontSize="font-scale-01" color="#808285">
                      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
                    </DxcTypography>
                  </DxcFlex>
                ))}
                <DxcFlex alignItems="center" gap="6px">
                  <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: RISK_COLORS.none, flexShrink: 0 }} />
                  <DxcTypography fontSize="font-scale-01" color="#808285">No Data</DxcTypography>
                </DxcFlex>
              </DxcFlex>
            </div>

            {/* Detail panel */}
            <div style={{ width: 320, flexShrink: 0 }}>
              {selectedState ? (
                <StateDetailPanel state={selectedState} formatMoney={formatMoney} />
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: '100%', minHeight: 200,
                  border: '1px dashed #e0e5e4', borderRadius: '8px',
                  padding: '24px', textAlign: 'center',
                }}>
                  <div>
                    <span className="material-icons-outlined" style={{ color: '#e0e5e4', fontSize: '40px' }}>touch_app</span>
                    <DxcTypography fontSize="font-scale-02" color="#808285" style={{ marginTop: '8px' }}>
                      Click a state to view detailed risk factors and CAT exposure
                    </DxcTypography>
                  </div>
                </div>
              )}
            </div>

          </DxcFlex>
        </div>
      </div>
    </div>
  );
};

const StateDetailPanel = ({ state, formatMoney }) => {
  const levelCfg = RISK_LABEL_COLORS[state.riskLevel] || RISK_LABEL_COLORS.medium;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* State header */}
      <div style={{
        padding: '12px 16px',
        border: `1px solid ${levelCfg.border}`,
        borderRadius: '8px',
        backgroundColor: levelCfg.bg,
      }}>
        <DxcFlex justifyContent="space-between" alignItems="center">
          <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-bold" color="#333333">
            {state.state}
          </DxcTypography>
          <span style={{
            padding: '2px 10px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 700,
            backgroundColor: levelCfg.border, color: levelCfg.color, textTransform: 'capitalize',
          }}>
            {state.riskLevel} Risk · {state.riskScore}
          </span>
        </DxcFlex>
      </div>

      {/* Risk factors */}
      <div style={{ border: '1px solid #e0e5e4', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', backgroundColor: '#F2F7F6', borderBottom: '1px solid #e0e5e4' }}>
          <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold" color="#808285">
            RISK FACTORS
          </DxcTypography>
        </div>
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {state.reasons.map((reason, i) => (
            <DxcFlex key={i} alignItems="flex-start" gap="8px">
              <span className="material-icons-outlined" style={{ color: '#f97316', fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>
                warning_amber
              </span>
              <DxcTypography fontSize="font-scale-01" color="#555555">{reason}</DxcTypography>
            </DxcFlex>
          ))}
        </div>
      </div>

      {/* Metrics */}
      {state.metrics && Object.keys(state.metrics).length > 0 && (
        <div style={{ border: '1px solid #e0e5e4', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', backgroundColor: '#F2F7F6', borderBottom: '1px solid #e0e5e4' }}>
            <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold" color="#808285">
              KEY METRICS
            </DxcTypography>
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(state.metrics).map(([key, value]) => (
              <DxcFlex key={key} justifyContent="space-between" alignItems="center">
                <DxcTypography fontSize="font-scale-01" color="#808285">{key}</DxcTypography>
                <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold" color="#333333">
                  {value}
                </DxcTypography>
              </DxcFlex>
            ))}
          </div>
        </div>
      )}

      {/* CAT Exposure */}
      {state.catExposure && (
        <div style={{ border: '1px solid #fca5a5', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{
            padding: '8px 12px', backgroundColor: '#fee2e2',
            borderBottom: '1px solid #fca5a5',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span className="material-icons-outlined" style={{ color: '#b91c1c', fontSize: '16px' }}>
              crisis_alert
            </span>
            <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold" color="#991b1b">
              ACTIVE CAT EXPOSURE
            </DxcTypography>
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

            {state.catExposure.activeAlerts && state.catExposure.activeAlerts.length > 0 && (
              <div style={{ padding: '6px 10px', backgroundColor: '#fee2e2', borderRadius: '4px', border: '1px solid #fca5a5' }}>
                <DxcTypography fontSize="font-scale-01" color="#991b1b">
                  <strong>{state.catExposure.activeAlerts.length}</strong> active weather alert(s) affecting this state
                </DxcTypography>
              </div>
            )}

            <DxcFlex justifyContent="space-between">
              <DxcTypography fontSize="font-scale-01" color="#808285">Properties at Risk</DxcTypography>
              <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-bold" color="#000000">
                {state.catExposure.propertiesAtRisk.toLocaleString()}
              </DxcTypography>
            </DxcFlex>
            <DxcFlex justifyContent="space-between">
              <DxcTypography fontSize="font-scale-01" color="#808285">Total Insured Value</DxcTypography>
              <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-bold" color="#000000">
                {formatMoney(state.catExposure.totalInsuredValue)}
              </DxcTypography>
            </DxcFlex>

            {/* Loss scenarios */}
            <div style={{ marginTop: '4px' }}>
              <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold" color="#808285" style={{ marginBottom: '6px' }}>
                ESTIMATED LOSS SCENARIOS
              </DxcTypography>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: 'Low Impact', scenario: 'lowScenario', bg: '#dcfce7', border: '#bbf7d0', textColor: '#15803d' },
                  { label: 'Medium Impact', scenario: 'mediumScenario', bg: '#fef9c3', border: '#fde68a', textColor: '#92400e' },
                  { label: 'High Impact', scenario: 'highScenario', bg: '#fff7ed', border: '#fed7aa', textColor: '#c2410c' },
                  { label: 'Catastrophic', scenario: 'catastrophicScenario', bg: '#fee2e2', border: '#fca5a5', textColor: '#991b1b' },
                ].map(({ label, scenario, bg, border, textColor }) => (
                  <div key={scenario} style={{
                    padding: '6px 10px', borderRadius: '4px',
                    backgroundColor: bg, border: `1px solid ${border}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: textColor }}>{label}</span>
                      <span style={{
                        marginLeft: 6, fontSize: '0.5625rem', fontWeight: 600, color: textColor,
                        backgroundColor: border, padding: '1px 6px', borderRadius: '999px',
                      }}>
                        {state.catExposure.lossRatios[scenario]}% LR
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: textColor }}>
                      {formatMoney(state.catExposure.estimatedLosses[scenario])}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: '4px', padding: '6px 10px',
              backgroundColor: '#fef9c3', border: '1px solid #fde68a', borderRadius: '4px',
            }}>
              <DxcTypography fontSize="font-scale-01" color="#92400e">
                <strong>Note:</strong> Estimates based on current portfolio exposure and historical loss patterns. Actual losses may vary.
              </DxcTypography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeographicRiskMap;
