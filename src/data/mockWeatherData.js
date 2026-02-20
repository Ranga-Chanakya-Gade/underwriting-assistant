// Mock weather alert data for demo submissions

export const mockWeatherData = {
  // Florida submission — active hurricane
  'UW-2026-001': {
    alerts: [
      {
        id: 'NHC-AL092024',
        type: 'hurricane',
        severity: 'warning',
        title: 'Hurricane Milton — Category 4',
        description:
          'Major hurricane approaching Florida Gulf Coast. Life-threatening storm surge, destructive winds, and flooding rainfall expected. Landfall anticipated within 24–36 hours near Tampa Bay area.',
        affectedStates: ['FL', 'GA', 'SC', 'AL'],
        effectiveDate: '2024-10-08T06:00:00Z',
        expirationDate: '2024-10-12T18:00:00Z',
        windSpeed: 150,
        category: 4,
      },
      {
        id: 'NWS-FFW-FL-001',
        type: 'flood',
        severity: 'warning',
        title: 'Flash Flood Warning — Tampa Bay Metro',
        description:
          'Flash flooding imminent or occurring. Rainfall rates of 3–5 inches per hour expected. Move to higher ground immediately.',
        affectedStates: ['FL'],
        effectiveDate: '2024-10-09T14:00:00Z',
        expirationDate: '2024-10-09T22:00:00Z',
      },
    ],
    nearbyStorms: [
      {
        id: 'NHC-AL102024',
        type: 'hurricane',
        severity: 'watch',
        title: 'Tropical Storm Nadine',
        description:
          'Tropical storm located 800 miles east of Florida. Expected to strengthen. Monitoring for potential US impacts later this week.',
        affectedStates: ['FL'],
        effectiveDate: '2024-10-09T00:00:00Z',
        expirationDate: '2024-10-15T00:00:00Z',
        windSpeed: 60,
        category: 0,
      },
    ],
    riskImpact: {
      affectedProperties: 847,
      estimatedExposure: 285000000,
      recommendedActions: [
        'Defer new binding in affected counties until storm passes',
        'Contact insureds in evacuation zones to confirm property protection measures',
        'Prepare for surge in claims following landfall',
        'Review CAT reinsurance attachment points and coverage',
        'Consider temporary moratorium on quote generation in high-impact zones',
        'Alert claims team to pre-stage adjusters in nearby unaffected areas',
      ],
    },
    lastUpdated: '2024-10-09T15:30:00Z',
  },

  // Texas submission — tornado activity
  'UW-2026-003': {
    alerts: [
      {
        id: 'SPC-TOR-TX-456',
        type: 'tornado',
        severity: 'watch',
        title: 'Tornado Watch — North Texas',
        description:
          'Conditions favorable for tornadoes and severe thunderstorms. Large hail up to 2 inches and damaging winds up to 70 mph also possible.',
        affectedStates: ['TX', 'OK'],
        effectiveDate: '2024-03-15T16:00:00Z',
        expirationDate: '2024-03-16T01:00:00Z',
      },
      {
        id: 'NWS-SVR-TX-789',
        type: 'severe_storm',
        severity: 'warning',
        title: 'Severe Thunderstorm Warning — Dallas Metro',
        description:
          'Severe thunderstorm capable of producing quarter-size hail and 60 mph wind gusts. Take shelter immediately.',
        affectedStates: ['TX'],
        effectiveDate: '2024-03-15T18:15:00Z',
        expirationDate: '2024-03-15T19:30:00Z',
      },
    ],
    nearbyStorms: [],
    riskImpact: {
      affectedProperties: 312,
      estimatedExposure: 87500000,
      recommendedActions: [
        'Monitor storm development and adjust underwriting guidelines if widespread damage occurs',
        'Review commercial property submissions for adequate hail protection',
        'Consider additional inspection requirements for metal roofs in tornado-prone areas',
      ],
    },
    lastUpdated: '2024-03-15T18:45:00Z',
  },
};

export function getWeatherData(submissionId) {
  return mockWeatherData[submissionId];
}

export function hasWeatherAlerts(submissionId) {
  const data = mockWeatherData[submissionId];
  return data ? data.alerts.length > 0 : false;
}
