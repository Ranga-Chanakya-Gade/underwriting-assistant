// Geographic risk data for demo submissions
// Mirrors the commercial lines portfolio concentration in mock risk data

export const geoRiskData = {
  category: 'Commercial Lines — Property & Auto',
  overallRiskLevel: 'medium',
  states: {
    FL: {
      state: 'FL',
      riskScore: 88,
      riskLevel: 'critical',
      reasons: [
        'Active hurricane season with 2 named storms affecting coastal areas',
        'Storm surge exposure in Tampa Bay and Miami-Dade metro',
        'High concentration of insured properties in mandatory evacuation zones',
        'Sinkhole activity elevated in central Florida counties',
        'Flood zone mapping revisions increasing coastal exposure',
      ],
      metrics: {
        'Policies In Force': 76,
        'Total Insured Value': '$32M',
        'Avg Policy Exposure': '$421K',
        'CAT Reinsurance Layer': 'Triggered',
        'Loss Ratio (YTD)': '94.2%',
      },
      catExposure: {
        propertiesAtRisk: 847,
        totalInsuredValue: 285000000,
        estimatedLosses: {
          lowScenario: 8550000,
          mediumScenario: 28500000,
          highScenario: 71250000,
          catastrophicScenario: 142500000,
        },
        lossRatios: {
          lowScenario: 3,
          mediumScenario: 10,
          highScenario: 25,
          catastrophicScenario: 50,
        },
        activeAlerts: ['NHC-AL092024', 'NWS-FFW-FL-001'],
      },
    },

    TX: {
      state: 'TX',
      riskScore: 72,
      riskLevel: 'high',
      reasons: [
        'Tornado watch active in North Texas corridor',
        'Large hail events — commercial roof damage history elevated',
        'Winter storm Uri legacy: secondary structure claims still processing',
        'Houston commercial concentration in flood-prone Harris County',
        'Wind/hail deductible buyback provisions increasing net exposure',
      ],
      metrics: {
        'Policies In Force': 87,
        'Total Insured Value': '$38M',
        'Avg Policy Exposure': '$437K',
        'CAT Reinsurance Layer': 'Approaching',
        'Loss Ratio (YTD)': '78.5%',
      },
      catExposure: {
        propertiesAtRisk: 312,
        totalInsuredValue: 87500000,
        estimatedLosses: {
          lowScenario: 2625000,
          mediumScenario: 8750000,
          highScenario: 21875000,
          catastrophicScenario: 43750000,
        },
        lossRatios: {
          lowScenario: 3,
          mediumScenario: 10,
          highScenario: 25,
          catastrophicScenario: 50,
        },
        activeAlerts: ['SPC-TOR-TX-456', 'NWS-SVR-TX-789'],
      },
    },

    CA: {
      state: 'CA',
      riskScore: 75,
      riskLevel: 'high',
      reasons: [
        'Red Flag Warning in effect — critical fire weather conditions',
        'WUI (Wildland-Urban Interface) exposure high in LA and San Diego counties',
        'Bridge Fire still 40% contained — structures threatened',
        'Seismic zone rating requires annual review',
        'Insurance availability crisis — voluntary market exit by 3 carriers',
      ],
      metrics: {
        'Policies In Force': 132,
        'Total Insured Value': '$58M',
        'Avg Policy Exposure': '$439K',
        'CAT Reinsurance Layer': 'Monitoring',
        'Loss Ratio (YTD)': '82.1%',
      },
      catExposure: {
        propertiesAtRisk: 156,
        totalInsuredValue: 94200000,
        estimatedLosses: {
          lowScenario: 4710000,
          mediumScenario: 18840000,
          highScenario: 47100000,
          catastrophicScenario: 94200000,
        },
        lossRatios: {
          lowScenario: 5,
          mediumScenario: 20,
          highScenario: 50,
          catastrophicScenario: 100,
        },
        activeAlerts: ['CAL-FIRE-2024-085'],
      },
    },

    IL: {
      state: 'IL',
      riskScore: 42,
      riskLevel: 'low',
      reasons: [
        'Chicago metro commercial concentration well within tolerance',
        'No active weather alerts affecting insured portfolio',
        'Strong construction standards and fire protection class ratings',
        'Earthquake risk minimal (Wabash Valley Zone is low probability)',
      ],
      metrics: {
        'Policies In Force': 145,
        'Total Insured Value': '$62M',
        'Avg Policy Exposure': '$428K',
        'CAT Reinsurance Layer': 'Well Below',
        'Loss Ratio (YTD)': '58.3%',
      },
    },

    NY: {
      state: 'NY',
      riskScore: 55,
      riskLevel: 'medium',
      reasons: [
        'Coastal flood exposure in Long Island and coastal Queens/Brooklyn',
        'Nor\'easter season — winter weather claims historically elevated Q1',
        'Concentration risk in NYC metro — high TIV per policy',
        'Sea-level rise modeling increasing long-term coastal exposure',
      ],
      metrics: {
        'Policies In Force': 98,
        'Total Insured Value': '$45M',
        'Avg Policy Exposure': '$459K',
        'CAT Reinsurance Layer': 'Below Threshold',
        'Loss Ratio (YTD)': '65.7%',
      },
    },

    GA: {
      state: 'GA',
      riskScore: 62,
      riskLevel: 'medium',
      reasons: [
        'Hurricane track exposure from Gulf and Atlantic systems',
        'Tornado corridor in north Georgia active this season',
        'Atlanta commercial corridor — moderate concentration',
      ],
      metrics: {
        'Policies In Force': 34,
        'Total Insured Value': '$14M',
        'Avg Policy Exposure': '$411K',
        'Loss Ratio (YTD)': '61.2%',
      },
    },

    LA: {
      state: 'LA',
      riskScore: 84,
      riskLevel: 'critical',
      reasons: [
        'Repeated hurricane landfalls have elevated base loss rates',
        'Subsidence and coastal erosion affecting long-term insurability',
        'NFIP dependency high — significant gap coverage exposure',
        'Bourbon Street / French Quarter commercial concentration',
      ],
      metrics: {
        'Policies In Force': 18,
        'Total Insured Value': '$7.2M',
        'Avg Policy Exposure': '$400K',
        'Loss Ratio (YTD)': '112.4%',
      },
    },

    NC: {
      state: 'NC',
      riskScore: 58,
      riskLevel: 'medium',
      reasons: [
        'Coastal exposure — Outer Banks and Wilmington corridor',
        'Inland flooding risk elevated (Hurricane Matthew / Florence legacy)',
        'Moderate hail exposure in Piedmont region',
      ],
      metrics: {
        'Policies In Force': 29,
        'Total Insured Value': '$11.6M',
        'Loss Ratio (YTD)': '67.8%',
      },
    },

    CO: {
      state: 'CO',
      riskScore: 51,
      riskLevel: 'medium',
      reasons: [
        'Hailstorm corridor along Front Range — high severity hail events',
        'Wildfire interface risk in mountain communities',
        'Denver metro concentration — commercial auto fleet exposure',
      ],
      metrics: {
        'Policies In Force': 22,
        'Total Insured Value': '$9.8M',
        'Loss Ratio (YTD)': '59.4%',
      },
    },

    OK: {
      state: 'OK',
      riskScore: 69,
      riskLevel: 'high',
      reasons: [
        'Tornado Alley — among highest frequency tornado states nationally',
        'Large hail events increase commercial property losses',
        'Oklahoma City metro concentration warrants monitoring',
      ],
      metrics: {
        'Policies In Force': 14,
        'Total Insured Value': '$5.6M',
        'Loss Ratio (YTD)': '71.3%',
      },
    },

    SC: {
      state: 'SC',
      riskScore: 60,
      riskLevel: 'medium',
      reasons: [
        'Hurricane landfall exposure along Grand Strand and Lowcountry',
        'Flood plain designation expanding under FEMA remapping',
        'Coastal tourism/hospitality commercial concentration',
      ],
      metrics: {
        'Policies In Force': 12,
        'Total Insured Value': '$4.8M',
        'Loss Ratio (YTD)': '63.1%',
      },
    },

    PA: {
      state: 'PA',
      riskScore: 35,
      riskLevel: 'low',
      reasons: [
        'Low CAT exposure — primarily mid-Atlantic continental climate',
        'Philadelphia commercial lines performing within target loss ratio',
        'No significant active weather events',
      ],
      metrics: {
        'Policies In Force': 41,
        'Total Insured Value': '$17.2M',
        'Loss Ratio (YTD)': '54.6%',
      },
    },

    OH: {
      state: 'OH',
      riskScore: 38,
      riskLevel: 'low',
      reasons: [
        'Stable Midwest commercial market',
        'Minor tornado risk — well below national CAT thresholds',
        'Columbus and Cleveland commercial corridors well diversified',
      ],
      metrics: {
        'Policies In Force': 33,
        'Total Insured Value': '$13.8M',
        'Loss Ratio (YTD)': '55.9%',
      },
    },

    MI: {
      state: 'MI',
      riskScore: 40,
      riskLevel: 'low',
      reasons: [
        'Great Lakes coastal flooding a monitoring area',
        'Winter severity — freeze/burst pipe losses historically moderate',
        'Detroit metro commercial lines stable',
      ],
      metrics: {
        'Policies In Force': 27,
        'Total Insured Value': '$11.1M',
        'Loss Ratio (YTD)': '57.2%',
      },
    },

    WA: {
      state: 'WA',
      riskScore: 52,
      riskLevel: 'medium',
      reasons: [
        'Cascadia Subduction Zone — major earthquake scenario exposure',
        'Wildfire risk in eastern Washington increasing',
        'Seattle commercial tech corridor — high TIV concentration',
      ],
      metrics: {
        'Policies In Force': 19,
        'Total Insured Value': '$8.4M',
        'Loss Ratio (YTD)': '61.5%',
      },
    },

    AZ: {
      state: 'AZ',
      riskScore: 48,
      riskLevel: 'medium',
      reasons: [
        'Monsoon season — flash flood and haboob damage to commercial structures',
        'Phoenix metro heat exposure affecting HVAC and mechanical systems',
        'Wildfire risk elevated in northern Arizona communities',
      ],
      metrics: {
        'Policies In Force': 16,
        'Total Insured Value': '$6.8M',
        'Loss Ratio (YTD)': '60.2%',
      },
    },
  },
};

// Lookup by submission ID for use in the workbench
export const geoRiskBySubmission = {
  'UW-2026-001': geoRiskData,
  'UW-2026-003': geoRiskData,
};

export function getGeoRiskData(submissionId) {
  return geoRiskBySubmission[submissionId] || geoRiskData;
}
