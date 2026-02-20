import { useEffect, useState, useRef } from 'react';
import { geoPath, geoAlbersUsa } from 'd3-geo';
import { feature } from 'topojson-client';

// State FIPS code to 2-letter abbreviation mapping
const FIPS_TO_STATE = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
  '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
  '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
  '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
  '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
  '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
  '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
  '56': 'WY',
};

const USMapSVG = ({ stateColors, onStateClick, onStateHover, selectedState, hoveredState }) => {
  const [topology, setTopology] = useState(null);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef(null);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then((res) => res.json())
      .then((data) => {
        setTopology(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading map data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '400px', backgroundColor: '#F2F7F6', borderRadius: '8px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, border: '3px solid #e0e5e4',
            borderTopColor: '#1B75BB', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 8px',
          }} />
          <p style={{ fontSize: '0.8125rem', color: '#808285' }}>Loading map...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!topology) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '400px', backgroundColor: '#F2F7F6', borderRadius: '8px',
      }}>
        <p style={{ fontSize: '0.8125rem', color: '#808285' }}>Failed to load map data</p>
      </div>
    );
  }

  const states = feature(topology, topology.objects.states).features;
  const projection = geoAlbersUsa().scale(1000).translate([487.5, 305]);
  const pathGenerator = geoPath().projection(projection);

  const getStateFill = (fipsCode) => {
    const stateCode = FIPS_TO_STATE[fipsCode];
    if (!stateCode) return '#e0e5e4';
    return stateColors[stateCode] || '#e0e5e4';
  };

  const getStateOpacity = (fipsCode) => {
    const stateCode = FIPS_TO_STATE[fipsCode];
    if (stateCode === hoveredState) return 0.75;
    return 1;
  };

  const getStroke = (fipsCode) => {
    const stateCode = FIPS_TO_STATE[fipsCode];
    if (stateCode === selectedState) return '#1B75BB';
    if (stateCode === hoveredState) return '#00ADEE';
    return '#ffffff';
  };

  const getStrokeWidth = (fipsCode) => {
    const stateCode = FIPS_TO_STATE[fipsCode];
    if (stateCode === selectedState) return 2.5;
    if (stateCode === hoveredState) return 2;
    return 0.8;
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 975 610"
      style={{ width: '100%', height: 'auto', maxHeight: '520px', display: 'block' }}
    >
      <g>
        {states.map((state) => {
          const fipsCode = state.id;
          const stateCode = FIPS_TO_STATE[fipsCode];
          const path = pathGenerator(state.geometry);
          if (!path) return null;

          return (
            <path
              key={fipsCode}
              d={path}
              fill={getStateFill(fipsCode)}
              fillOpacity={getStateOpacity(fipsCode)}
              stroke={getStroke(fipsCode)}
              strokeWidth={getStrokeWidth(fipsCode)}
              style={{ cursor: stateColors[stateCode] ? 'pointer' : 'default', transition: 'opacity 0.15s' }}
              onClick={() => stateCode && onStateClick(stateCode)}
              onMouseEnter={() => stateCode && onStateHover(stateCode)}
              onMouseLeave={() => onStateHover(null)}
            >
              <title>{state.properties.name}</title>
            </path>
          );
        })}
      </g>

      {/* Labels for selected / hovered states */}
      {states.map((state) => {
        const fipsCode = state.id;
        const stateCode = FIPS_TO_STATE[fipsCode];
        if (stateCode !== selectedState && stateCode !== hoveredState) return null;

        const centroid = pathGenerator.centroid(state.geometry);
        if (!centroid || !isFinite(centroid[0]) || !isFinite(centroid[1])) return null;

        return (
          <text
            key={`label-${fipsCode}`}
            x={centroid[0]}
            y={centroid[1]}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              fill: '#ffffff',
              pointerEvents: 'none',
              textShadow: '0 0 4px rgba(0,0,0,0.9)',
            }}
          >
            {stateCode}
          </text>
        );
      })}
    </svg>
  );
};

export default USMapSVG;
