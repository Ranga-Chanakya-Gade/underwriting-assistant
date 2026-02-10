// Mock data for underwriting submissions - Enhanced for P&C Demo Script Alignment

// P&C - Commercial Auto Submissions with comprehensive underwriting data
export const pcSubmissions = [
  {
    id: 'UW-2026-PC-001',
    applicantName: 'ABC Trucking LLC',
    status: 'New Submission',
    priority: 'High',
    productType: 'P&C',
    lineOfBusiness: 'Commercial Auto',
    coverageType: 'Fleet',
    coverageAmount: 5000000,
    submittedDate: '2026-01-22',
    receivedDate: '2026-01-22',
    effectiveDate: '2026-02-15',
    assignedTo: 'Sarah Chen',
    riskScore: 68,
    fleetSize: 45,
    vehicles: '35 Tractors, 10 Box Trucks',
    driversCount: 52,
    radiusOfOperation: 'Long Haul (500+ miles)',
    cargo: 'General Freight',
    lossHistory: '3 claims in last 3 years',
    requirementsComplete: 45,
    daysInQueue: 1,

    // ACORD Form Processing
    acordForms: [
      {
        type: 'ACORD 125',
        name: 'Commercial Insurance Application',
        autoExtracted: true,
        confidenceScore: 94,
        fieldsExtracted: 87,
        totalFields: 92,
        extractionTime: '2 min 14 sec'
      },
      {
        type: 'ACORD 140',
        name: 'Commercial Auto Application',
        autoExtracted: true,
        confidenceScore: 89,
        fieldsExtracted: 45,
        totalFields: 48,
        extractionTime: '1 min 32 sec'
      }
    ],

    // Loss Runs Detail
    lossRuns: {
      summary: {
        totalClaims: 3,
        totalIncurred: 145000,
        totalPaid: 128000,
        totalReserved: 17000,
        period: '2023-2026',
        frequency: 'Average',
        severity: 'Moderate'
      },
      claims: [
        {
          date: '2025-08-15',
          type: 'Collision',
          description: 'Rear-end collision on I-80',
          status: 'Closed',
          incurred: 45000,
          paid: 45000,
          reserved: 0
        },
        {
          date: '2024-11-22',
          type: 'Comprehensive',
          description: 'Vehicle theft - recovered',
          status: 'Closed',
          incurred: 35000,
          paid: 32000,
          reserved: 3000
        },
        {
          date: '2024-03-10',
          type: 'Liability',
          description: 'Property damage - backing incident',
          status: 'Open',
          incurred: 65000,
          paid: 51000,
          reserved: 14000
        }
      ],
      aiSummary: 'Loss frequency is within expected range for fleet size. Severity trending downward. No red flag patterns detected. Driver training program recommended.'
    },

    // Routing Decision & Logic
    routing: {
      decision: 'Senior Underwriter Review',
      assignedTo: 'Sarah Chen',
      reason: 'Exceeds standard authority limit',
      logic: 'Coverage Amount $5M > Authority Limit $2M',
      autoRouted: true,
      routingTime: '< 1 second',
      fastTrackEligible: false
    },

    // Referral & Authority
    referral: {
      required: true,
      reason: 'Exceeds underwriter authority',
      referTo: 'Senior Underwriting Team',
      guidelineReference: 'Section 4.2.1 - Authority Limits',
      authorityLimit: 2000000,
      yourLimit: 2000000,
      triggers: ['Coverage > $2M', 'Fleet size > 40 units']
    },

    // Workflow Progress
    workflow: {
      currentStage: 'Underwriting Review',
      stages: [
        { name: 'Submission Received', status: 'complete', date: '2026-01-22 09:15' },
        { name: 'Documents Processed', status: 'complete', date: '2026-01-22 09:17' },
        { name: 'Triage Complete', status: 'complete', date: '2026-01-22 09:18' },
        { name: 'Underwriting Review', status: 'current', date: null },
        { name: 'Loss Control Inspection', status: 'pending', date: null },
        { name: 'Final Decision', status: 'pending', date: null },
        { name: 'Quote', status: 'pending', date: null },
        { name: 'Bind', status: 'pending', date: null }
      ],
      nextAction: 'Order MVR reports for 52 drivers',
      targetCompletionDate: '2026-01-29',
      daysRemaining: 7
    },

    // Third-Party Reports
    reports: {
      mvr: {
        status: 'pending',
        total: 52,
        complete: 0,
        pending: 52,
        flagged: 0,
        lastOrdered: null
      },
      credit: {
        status: 'not_ordered',
        score: null
      },
      lossControl: {
        status: 'required',
        type: 'Fleet Safety Inspection',
        scheduled: null,
        reason: 'Fleet size > 40 units'
      }
    },

    // Guidelines & Appetite
    guidelines: {
      appetiteMatch: 'Conditional',
      appetiteNotes: 'Long-haul trucking acceptable with clean safety record',
      requiredEndorsements: ['Hired & Non-Owned Auto', 'MCS-90'],
      restrictions: 'Minimum 3 years experience required for all drivers',
      referralTriggers: [
        'Coverage amount > $2M',
        'More than 3 claims in 3 years',
        'Fleet size > 100 units',
        'Hazardous materials (conditional)'
      ]
    },

    // AI Recommendations
    aiRecommendations: {
      pricing: {
        suggestion: 'Quote at 12% above base rate',
        reasoning: 'Loss frequency within expected range, but long-haul exposure requires premium loading',
        manualRate: 125000,
        aiSuggestedRate: 140000,
        confidence: 87
      },
      comparableRisks: [
        { account: 'XYZ Transport', premium: 138000, lossRatio: 0.62 },
        { account: 'Highway Logistics', premium: 145000, lossRatio: 0.58 },
        { account: 'Interstate Haulers', premium: 132000, lossRatio: 0.71 }
      ],
      redFlags: [
        'Fleet size growing rapidly (15% YoY growth)',
        'Need to verify driver hiring practices'
      ],
      positiveFactors: [
        'Strong safety program in place',
        'GPS tracking on all vehicles',
        'Experienced management team (12+ years)'
      ]
    },

    // Compliance
    compliance: {
      stateFilingCompliant: true,
      requiredDocsReceived: false,
      missingDocs: ['Driver roster', 'Vehicle schedule', 'Safety manual'],
      guidelinesFollowed: true,
      authorityVerified: false
    }
  },
  {
    id: 'UW-2026-PC-002',
    applicantName: 'Metro Delivery Services',
    status: 'Pending Review',
    priority: 'Medium',
    productType: 'P&C',
    lineOfBusiness: 'Commercial Auto',
    coverageType: 'Fleet',
    coverageAmount: 2000000,
    submittedDate: '2026-01-21',
    receivedDate: '2026-01-21',
    effectiveDate: '2026-02-10',
    assignedTo: 'Michael Park',
    riskScore: 82,
    fleetSize: 18,
    vehicles: '18 Cargo Vans',
    driversCount: 22,
    radiusOfOperation: 'Local (under 50 miles)',
    cargo: 'Packages & Documents',
    lossHistory: '1 claim in last 3 years',
    requirementsComplete: 75,
    daysInQueue: 2,

    acordForms: [
      {
        type: 'ACORD 125',
        name: 'Commercial Insurance Application',
        autoExtracted: true,
        confidenceScore: 96,
        fieldsExtracted: 90,
        totalFields: 92,
        extractionTime: '1 min 58 sec'
      }
    ],

    lossRuns: {
      summary: {
        totalClaims: 1,
        totalIncurred: 12000,
        totalPaid: 12000,
        totalReserved: 0,
        period: '2023-2026',
        frequency: 'Low',
        severity: 'Low'
      },
      claims: [
        {
          date: '2024-06-12',
          type: 'Collision',
          description: 'Minor fender bender in parking lot',
          status: 'Closed',
          incurred: 12000,
          paid: 12000,
          reserved: 0
        }
      ],
      aiSummary: 'Excellent loss history. Low frequency and severity. Strong candidate for preferred pricing.'
    },

    routing: {
      decision: 'Standard Review',
      assignedTo: 'Michael Park',
      reason: 'Within authority limits, low risk profile',
      logic: 'Risk Score: 82 + Coverage $2M ≤ Authority + Local Delivery = Standard',
      autoRouted: true,
      routingTime: '< 1 second',
      fastTrackEligible: true
    },

    referral: {
      required: false,
      reason: null,
      referTo: null,
      guidelineReference: null,
      authorityLimit: 2000000,
      yourLimit: 2000000,
      triggers: []
    },

    workflow: {
      currentStage: 'Underwriting Review',
      stages: [
        { name: 'Submission Received', status: 'complete', date: '2026-01-21 14:22' },
        { name: 'Documents Processed', status: 'complete', date: '2026-01-21 14:24' },
        { name: 'Triage Complete', status: 'complete', date: '2026-01-21 14:24' },
        { name: 'Underwriting Review', status: 'current', date: null },
        { name: 'Loss Control Inspection', status: 'pending', date: null },
        { name: 'Final Decision', status: 'pending', date: null },
        { name: 'Quote', status: 'pending', date: null },
        { name: 'Bind', status: 'pending', date: null }
      ],
      nextAction: 'Review MVR reports and finalize pricing',
      targetCompletionDate: '2026-01-24',
      daysRemaining: 3
    },

    reports: {
      mvr: {
        status: 'complete',
        total: 22,
        complete: 22,
        pending: 0,
        flagged: 1,
        lastOrdered: '2026-01-21'
      },
      credit: {
        status: 'complete',
        score: 720
      },
      lossControl: {
        status: 'waived',
        type: null,
        scheduled: null,
        reason: 'Local delivery, fleet < 25 units'
      }
    },

    guidelines: {
      appetiteMatch: 'Preferred',
      appetiteNotes: 'Local delivery with excellent safety record is preferred risk',
      requiredEndorsements: ['Hired Auto'],
      restrictions: 'None',
      referralTriggers: []
    },

    aiRecommendations: {
      pricing: {
        suggestion: 'Quote at base rate',
        reasoning: 'Excellent loss history, local operation, strong credit',
        manualRate: 32000,
        aiSuggestedRate: 32000,
        confidence: 94
      },
      comparableRisks: [
        { account: 'City Couriers', premium: 31500, lossRatio: 0.45 },
        { account: 'Express Delivery Co', premium: 33800, lossRatio: 0.52 }
      ],
      redFlags: [],
      positiveFactors: [
        'Clean loss history',
        'Local operations only',
        'Strong credit score (720)',
        'Experienced drivers (avg 5+ years)'
      ]
    },

    compliance: {
      stateFilingCompliant: true,
      requiredDocsReceived: true,
      missingDocs: [],
      guidelinesFollowed: true,
      authorityVerified: true
    }
  },
  {
    id: 'UW-2026-PC-003',
    applicantName: 'Midwest Transport Inc',
    status: 'In Review',
    priority: 'High',
    productType: 'P&C',
    lineOfBusiness: 'Commercial Auto',
    coverageType: 'Fleet',
    coverageAmount: 10000000,
    submittedDate: '2026-01-20',
    receivedDate: '2026-01-20',
    effectiveDate: '2026-02-05',
    assignedTo: 'Sarah Chen',
    riskScore: 55,
    fleetSize: 120,
    vehicles: '85 Tractors, 25 Flatbeds, 10 Tank Trucks',
    driversCount: 135,
    radiusOfOperation: 'Regional (200-500 miles)',
    cargo: 'Hazardous Materials',
    lossHistory: '8 claims in last 3 years',
    requirementsComplete: 60,
    daysInQueue: 3,

    acordForms: [
      {
        type: 'ACORD 125',
        name: 'Commercial Insurance Application',
        autoExtracted: true,
        confidenceScore: 91,
        fieldsExtracted: 88,
        totalFields: 92,
        extractionTime: '2 min 45 sec'
      },
      {
        type: 'ACORD 140',
        name: 'Commercial Auto Application',
        autoExtracted: true,
        confidenceScore: 87,
        fieldsExtracted: 46,
        totalFields: 48,
        extractionTime: '1 min 52 sec'
      }
    ],

    lossRuns: {
      summary: {
        totalClaims: 8,
        totalIncurred: 425000,
        totalPaid: 380000,
        totalReserved: 45000,
        period: '2023-2026',
        frequency: 'Above Average',
        severity: 'Moderate-High'
      },
      claims: [
        {
          date: '2025-11-08',
          type: 'Collision',
          description: 'Multi-vehicle accident - Interstate',
          status: 'Open',
          incurred: 125000,
          paid: 90000,
          reserved: 35000
        },
        {
          date: '2025-09-15',
          type: 'Cargo',
          description: 'Hazmat spill - cleanup costs',
          status: 'Closed',
          incurred: 85000,
          paid: 85000,
          reserved: 0
        },
        {
          date: '2025-06-22',
          type: 'Liability',
          description: 'Third-party property damage',
          status: 'Closed',
          incurred: 52000,
          paid: 52000,
          reserved: 0
        },
        {
          date: '2025-02-10',
          type: 'Collision',
          description: 'Jackknife incident',
          status: 'Closed',
          incurred: 68000,
          paid: 68000,
          reserved: 0
        },
        {
          date: '2024-10-05',
          type: 'Comprehensive',
          description: 'Hail damage to 3 vehicles',
          status: 'Closed',
          incurred: 35000,
          paid: 35000,
          reserved: 0
        },
        {
          date: '2024-07-18',
          type: 'Liability',
          description: 'Loading dock incident',
          status: 'Open',
          incurred: 28000,
          paid: 18000,
          reserved: 10000
        },
        {
          date: '2024-04-12',
          type: 'Collision',
          description: 'Rear-end collision',
          status: 'Closed',
          incurred: 22000,
          paid: 22000,
          reserved: 0
        },
        {
          date: '2023-12-01',
          type: 'Comprehensive',
          description: 'Vehicle fire',
          status: 'Closed',
          incurred: 10000,
          paid: 10000,
          reserved: 0
        }
      ],
      aiSummary: 'Elevated loss frequency for fleet size. Hazmat exposure requires careful review. Recent severity spike needs investigation. Strong safety program required.'
    },

    routing: {
      decision: 'Senior Underwriter + Management Review',
      assignedTo: 'Sarah Chen',
      reason: 'Exceeds authority + Hazmat exposure + High claim count',
      logic: 'Coverage $10M > Authority $2M + Hazmat Cargo + 8 Claims > Threshold',
      autoRouted: true,
      routingTime: '< 1 second',
      fastTrackEligible: false
    },

    referral: {
      required: true,
      reason: 'Multiple referral triggers - requires management approval',
      referTo: 'VP Underwriting',
      guidelineReference: 'Section 4.2.1 (Authority) & Section 5.3 (Hazmat)',
      authorityLimit: 2000000,
      yourLimit: 2000000,
      triggers: [
        'Coverage > $5M (Exceeds by $8M)',
        'Hazmat exposure',
        'Claims > 6 in 3 years',
        'Fleet size > 100 units'
      ]
    },

    workflow: {
      currentStage: 'Loss Control Inspection',
      stages: [
        { name: 'Submission Received', status: 'complete', date: '2026-01-20 11:05' },
        { name: 'Documents Processed', status: 'complete', date: '2026-01-20 11:08' },
        { name: 'Triage Complete', status: 'complete', date: '2026-01-20 11:09' },
        { name: 'Underwriting Review', status: 'complete', date: '2026-01-21 16:30' },
        { name: 'Loss Control Inspection', status: 'current', date: null },
        { name: 'Final Decision', status: 'pending', date: null },
        { name: 'Quote', status: 'pending', date: null },
        { name: 'Bind', status: 'pending', date: null }
      ],
      nextAction: 'Complete fleet safety inspection - scheduled Jan 25',
      targetCompletionDate: '2026-02-03',
      daysRemaining: 14
    },

    reports: {
      mvr: {
        status: 'complete',
        total: 135,
        complete: 135,
        pending: 0,
        flagged: 8,
        lastOrdered: '2026-01-20'
      },
      credit: {
        status: 'complete',
        score: 680
      },
      lossControl: {
        status: 'scheduled',
        type: 'Comprehensive Fleet Safety Inspection',
        scheduled: '2026-01-25',
        reason: 'Hazmat exposure + elevated loss frequency'
      }
    },

    guidelines: {
      appetiteMatch: 'Out of Appetite',
      appetiteNotes: 'Hazmat risks require exceptional safety programs and loss control approval',
      requiredEndorsements: ['MCS-90', 'Pollution Liability', 'Hazmat Endorsement'],
      restrictions: 'Must pass fleet inspection. Safety program mandatory. Deductible minimum $25K.',
      referralTriggers: [
        'All hazmat risks',
        'Coverage > $5M',
        'Claims > 6 in 3 years'
      ]
    },

    aiRecommendations: {
      pricing: {
        suggestion: 'Quote at 35% above base rate OR decline if inspection fails',
        reasoning: 'High loss frequency + hazmat exposure + large fleet = elevated risk. Pricing must reflect exposure.',
        manualRate: 425000,
        aiSuggestedRate: 574000,
        confidence: 76
      },
      comparableRisks: [
        { account: 'National Hazmat Transport', premium: 612000, lossRatio: 0.88 },
        { account: 'Chem-Trans Inc', premium: 545000, lossRatio: 0.79 }
      ],
      redFlags: [
        'Loss frequency 2x industry average',
        '8 MVR violations across driver pool',
        'Recent hazmat spill incident',
        'Inspection findings pending'
      ],
      positiveFactors: [
        '15 years in business',
        'Dedicated safety officer on staff',
        'Modern fleet (avg 3 years old)'
      ]
    },

    compliance: {
      stateFilingCompliant: true,
      requiredDocsReceived: false,
      missingDocs: ['Safety manual', 'Hazmat training records', 'DOT compliance docs'],
      guidelinesFollowed: false,
      authorityVerified: false
    }
  },
  {
    id: 'UW-2026-PC-004',
    applicantName: 'City Cab Company',
    status: 'Requirements Needed',
    priority: 'Medium',
    productType: 'P&C',
    lineOfBusiness: 'Commercial Auto',
    coverageType: 'For-Hire',
    coverageAmount: 1500000,
    submittedDate: '2026-01-19',
    receivedDate: '2026-01-19',
    effectiveDate: '2026-02-12',
    assignedTo: 'James Wilson',
    riskScore: 72,
    fleetSize: 35,
    vehicles: '35 Sedans',
    driversCount: 48,
    radiusOfOperation: 'Local (under 50 miles)',
    cargo: 'Passengers',
    lossHistory: '5 claims in last 3 years',
    requirementsComplete: 30,
    daysInQueue: 4,

    acordForms: [
      {
        type: 'ACORD 125',
        name: 'Commercial Insurance Application',
        autoExtracted: true,
        confidenceScore: 88,
        fieldsExtracted: 82,
        totalFields: 92,
        extractionTime: '2 min 12 sec'
      }
    ],

    lossRuns: {
      summary: {
        totalClaims: 5,
        totalIncurred: 98000,
        totalPaid: 88000,
        totalReserved: 10000,
        period: '2023-2026',
        frequency: 'Average',
        severity: 'Low-Moderate'
      },
      claims: [
        {
          date: '2025-10-15',
          type: 'Liability',
          description: 'Passenger injury claim',
          status: 'Open',
          incurred: 28000,
          paid: 18000,
          reserved: 10000
        },
        {
          date: '2025-07-22',
          type: 'Collision',
          description: 'Intersection accident',
          status: 'Closed',
          incurred: 22000,
          paid: 22000,
          reserved: 0
        },
        {
          date: '2025-03-10',
          type: 'Comprehensive',
          description: 'Vandalism to vehicle',
          status: 'Closed',
          incurred: 8000,
          paid: 8000,
          reserved: 0
        },
        {
          date: '2024-11-05',
          type: 'Collision',
          description: 'Parking lot incident',
          status: 'Closed',
          incurred: 15000,
          paid: 15000,
          reserved: 0
        },
        {
          date: '2024-06-18',
          type: 'Liability',
          description: 'Property damage',
          status: 'Closed',
          incurred: 25000,
          paid: 25000,
          reserved: 0
        }
      ],
      aiSummary: 'Loss frequency typical for for-hire passenger service. Open passenger injury claim warrants monitoring. Overall acceptable risk profile.'
    },

    routing: {
      decision: 'Standard Review - Requirements Hold',
      assignedTo: 'James Wilson',
      reason: 'Missing required documentation',
      logic: 'Coverage $1.5M ≤ Authority + For-Hire = Standard, but docs incomplete',
      autoRouted: true,
      routingTime: '< 1 second',
      fastTrackEligible: false
    },

    referral: {
      required: false,
      reason: null,
      referTo: null,
      guidelineReference: null,
      authorityLimit: 2000000,
      yourLimit: 2000000,
      triggers: []
    },

    workflow: {
      currentStage: 'Requirements Needed',
      stages: [
        { name: 'Submission Received', status: 'complete', date: '2026-01-19 08:45' },
        { name: 'Documents Processed', status: 'complete', date: '2026-01-19 08:47' },
        { name: 'Triage Complete', status: 'complete', date: '2026-01-19 08:48' },
        { name: 'Underwriting Review', status: 'blocked', date: null },
        { name: 'Loss Control Inspection', status: 'pending', date: null },
        { name: 'Final Decision', status: 'pending', date: null },
        { name: 'Quote', status: 'pending', date: null },
        { name: 'Bind', status: 'pending', date: null }
      ],
      nextAction: 'Follow up on missing driver roster and vehicle schedule',
      targetCompletionDate: '2026-01-26',
      daysRemaining: 7
    },

    reports: {
      mvr: {
        status: 'pending',
        total: 48,
        complete: 0,
        pending: 48,
        flagged: 0,
        lastOrdered: null
      },
      credit: {
        status: 'not_ordered',
        score: null
      },
      lossControl: {
        status: 'not_required',
        type: null,
        scheduled: null,
        reason: 'For-hire passenger with standard coverage'
      }
    },

    guidelines: {
      appetiteMatch: 'Standard',
      appetiteNotes: 'For-hire passenger service acceptable with proper endorsements',
      requiredEndorsements: ['Hired Auto', 'Passenger Hazard'],
      restrictions: 'Background checks required for all drivers',
      referralTriggers: ['Claims > 8 in 3 years', 'Coverage > $3M']
    },

    aiRecommendations: {
      pricing: {
        suggestion: 'Quote at 8% above base rate',
        reasoning: 'Loss frequency acceptable but open passenger claim requires loading',
        manualRate: 58000,
        aiSuggestedRate: 62640,
        confidence: 81
      },
      comparableRisks: [
        { account: 'Metro Taxi Service', premium: 65000, lossRatio: 0.68 },
        { account: 'Downtown Cabs', premium: 59500, lossRatio: 0.61 }
      ],
      redFlags: [
        'Open passenger injury claim',
        'Missing documentation delays review'
      ],
      positiveFactors: [
        'Local operation only',
        '8 years in business',
        'No major violations'
      ]
    },

    compliance: {
      stateFilingCompliant: true,
      requiredDocsReceived: false,
      missingDocs: ['Driver roster', 'Vehicle schedule', 'Background check results'],
      guidelinesFollowed: true,
      authorityVerified: true
    }
  },
  {
    id: 'UW-2026-PC-005',
    applicantName: 'Green Valley Landscaping',
    status: 'Approved',
    priority: 'Low',
    productType: 'P&C',
    lineOfBusiness: 'Commercial Auto',
    coverageType: 'Business Use',
    coverageAmount: 750000,
    submittedDate: '2026-01-18',
    receivedDate: '2026-01-18',
    effectiveDate: '2026-02-01',
    assignedTo: 'Sarah Chen',
    riskScore: 91,
    fleetSize: 8,
    vehicles: '5 Pickup Trucks, 3 Cargo Vans',
    driversCount: 10,
    radiusOfOperation: 'Local (under 50 miles)',
    cargo: 'Landscaping Equipment',
    lossHistory: 'No claims in last 5 years',
    requirementsComplete: 100,
    daysInQueue: 5,

    acordForms: [
      {
        type: 'ACORD 125',
        name: 'Commercial Insurance Application',
        autoExtracted: true,
        confidenceScore: 98,
        fieldsExtracted: 91,
        totalFields: 92,
        extractionTime: '1 min 45 sec'
      }
    ],

    lossRuns: {
      summary: {
        totalClaims: 0,
        totalIncurred: 0,
        totalPaid: 0,
        totalReserved: 0,
        period: '2021-2026',
        frequency: 'None',
        severity: 'None'
      },
      claims: [],
      aiSummary: 'Excellent risk. No claims in 5+ years. Strong safety culture indicated. Preferred pricing recommended.'
    },

    routing: {
      decision: 'Fast-Track Approval',
      assignedTo: 'Sarah Chen',
      reason: 'Low risk profile, clean loss history, within appetite',
      logic: 'Risk Score: 91 + 0 Claims + Coverage ≤ $1M + Local = Fast-Track',
      autoRouted: true,
      routingTime: '< 1 second',
      fastTrackEligible: true
    },

    referral: {
      required: false,
      reason: null,
      referTo: null,
      guidelineReference: null,
      authorityLimit: 2000000,
      yourLimit: 2000000,
      triggers: []
    },

    workflow: {
      currentStage: 'Bind',
      stages: [
        { name: 'Submission Received', status: 'complete', date: '2026-01-18 13:20' },
        { name: 'Documents Processed', status: 'complete', date: '2026-01-18 13:22' },
        { name: 'Triage Complete', status: 'complete', date: '2026-01-18 13:22' },
        { name: 'Underwriting Review', status: 'complete', date: '2026-01-18 15:45' },
        { name: 'Loss Control Inspection', status: 'waived', date: '2026-01-18 15:45' },
        { name: 'Final Decision', status: 'complete', date: '2026-01-18 16:00' },
        { name: 'Quote', status: 'complete', date: '2026-01-18 16:15' },
        { name: 'Bind', status: 'current', date: null }
      ],
      nextAction: 'Awaiting broker acceptance',
      targetCompletionDate: '2026-01-23',
      daysRemaining: 5
    },

    reports: {
      mvr: {
        status: 'complete',
        total: 10,
        complete: 10,
        pending: 0,
        flagged: 0,
        lastOrdered: '2026-01-18'
      },
      credit: {
        status: 'complete',
        score: 745
      },
      lossControl: {
        status: 'waived',
        type: null,
        scheduled: null,
        reason: 'Clean loss history, small fleet, low exposure'
      }
    },

    guidelines: {
      appetiteMatch: 'Preferred',
      appetiteNotes: 'Local service contractors with clean records are preferred risks',
      requiredEndorsements: ['Hired Auto'],
      restrictions: 'None',
      referralTriggers: []
    },

    aiRecommendations: {
      pricing: {
        suggestion: 'Quote at 5% below base rate (preferred pricing)',
        reasoning: 'Exceptional risk profile. No claims, strong credit, local operation.',
        manualRate: 12500,
        aiSuggestedRate: 11875,
        confidence: 96
      },
      comparableRisks: [
        { account: 'Garden Pro Services', premium: 11200, lossRatio: 0.28 },
        { account: 'Lawn Masters', premium: 12800, lossRatio: 0.35 }
      ],
      redFlags: [],
      positiveFactors: [
        'No claims in 5+ years',
        'Excellent credit (745)',
        'Clean MVRs for all drivers',
        'Local operations only',
        'Small, manageable fleet',
        '10+ years in business'
      ]
    },

    compliance: {
      stateFilingCompliant: true,
      requiredDocsReceived: true,
      missingDocs: [],
      guidelinesFollowed: true,
      authorityVerified: true
    }
  }
];

// Life & Annuity Submissions (unchanged - keeping for reference)
export const lifeAnnuitySubmissions = [
  {
    id: 'UW-2026-LA-001',
    applicantName: 'James Anderson',
    status: 'New Submission',
    priority: 'High',
    productType: 'Life & Annuity',
    lineOfBusiness: 'Term Life',
    coverageAmount: 500000,
    submittedDate: '2026-01-22',
    receivedDate: '2026-01-22',
    effectiveDate: '2026-02-15',
    assignedTo: 'Sarah Chen',
    riskScore: 72,
    age: 38,
    gender: 'Male',
    medicalHistory: 'Diabetes Type 2',
    tobaccoUse: 'No',
    occupation: 'Software Engineer',
    requirementsComplete: 45
  },
  {
    id: 'UW-2026-LA-002',
    applicantName: 'Maria Rodriguez',
    status: 'Pending Review',
    priority: 'Medium',
    productType: 'Life & Annuity',
    lineOfBusiness: 'Whole Life',
    coverageAmount: 250000,
    submittedDate: '2026-01-21',
    receivedDate: '2026-01-21',
    effectiveDate: '2026-02-10',
    assignedTo: 'Michael Park',
    riskScore: 85,
    age: 32,
    gender: 'Female',
    medicalHistory: 'None',
    tobaccoUse: 'No',
    occupation: 'Teacher',
    requirementsComplete: 80
  },
  {
    id: 'UW-2026-LA-003',
    applicantName: 'David Chen',
    status: 'In Review',
    priority: 'High',
    productType: 'Life & Annuity',
    lineOfBusiness: 'Universal Life',
    coverageAmount: 1000000,
    submittedDate: '2026-01-20',
    receivedDate: '2026-01-20',
    effectiveDate: '2026-02-05',
    assignedTo: 'Sarah Chen',
    riskScore: 58,
    age: 52,
    gender: 'Male',
    medicalHistory: 'Hypertension, High Cholesterol',
    tobaccoUse: 'Former (quit 5 years ago)',
    occupation: 'Business Owner',
    requirementsComplete: 65
  },
  {
    id: 'UW-2026-LA-004',
    applicantName: 'Emily Thompson',
    status: 'Requirements Needed',
    priority: 'Medium',
    productType: 'Life & Annuity',
    lineOfBusiness: 'Term Life',
    coverageAmount: 750000,
    submittedDate: '2026-01-19',
    receivedDate: '2026-01-19',
    effectiveDate: '2026-02-12',
    assignedTo: 'James Wilson',
    riskScore: 68,
    age: 45,
    gender: 'Female',
    medicalHistory: 'Asthma',
    tobaccoUse: 'No',
    occupation: 'Marketing Director',
    requirementsComplete: 30
  },
  {
    id: 'UW-2026-LA-005',
    applicantName: 'Robert Martinez',
    status: 'Approved',
    priority: 'Low',
    productType: 'Life & Annuity',
    lineOfBusiness: 'Whole Life',
    coverageAmount: 350000,
    submittedDate: '2026-01-18',
    receivedDate: '2026-01-18',
    effectiveDate: '2026-02-01',
    assignedTo: 'Sarah Chen',
    riskScore: 92,
    age: 28,
    gender: 'Male',
    medicalHistory: 'None',
    tobaccoUse: 'No',
    occupation: 'Physical Therapist',
    requirementsComplete: 100
  }
];

// Combined submissions
export const mockSubmissions = [...pcSubmissions, ...lifeAnnuitySubmissions];

// Filter by product type
export const getSubmissionsByProductType = (productType) => {
  if (productType === 'P&C') {
    return pcSubmissions;
  } else if (productType === 'Life & Annuity') {
    return lifeAnnuitySubmissions;
  }
  return mockSubmissions;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'New Submission':
      return 'info';
    case 'Pending Review':
      return 'warning';
    case 'In Review':
      return 'warning';
    case 'Requirements Needed':
      return 'error';
    case 'Approved':
      return 'success';
    case 'Declined':
      return 'error';
    default:
      return 'neutral';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'neutral';
  }
};
