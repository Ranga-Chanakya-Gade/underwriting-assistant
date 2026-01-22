// Mock data for underwriting submissions

export const mockSubmissions = [
  {
    id: 'UW-2026-001',
    applicantName: 'James Anderson',
    status: 'New Submission',
    priority: 'High',
    lineOfBusiness: 'Term Life',
    coverageAmount: 500000,
    submittedDate: '2026-01-22',
    receivedDate: '2026-01-22',
    effectiveDate: '2026-02-15',
    assignedTo: 'Sarah Chen',
    riskScore: 72,
    medicalHistory: 'Diabetes Type 2',
    requirementsComplete: 45
  },
  {
    id: 'UW-2026-002',
    applicantName: 'Maria Rodriguez',
    status: 'Pending Review',
    priority: 'Medium',
    lineOfBusiness: 'Whole Life',
    coverageAmount: 250000,
    submittedDate: '2026-01-21',
    receivedDate: '2026-01-21',
    effectiveDate: '2026-02-10',
    assignedTo: 'Michael Park',
    riskScore: 85,
    medicalHistory: 'None',
    requirementsComplete: 80
  },
  {
    id: 'UW-2026-003',
    applicantName: 'David Chen',
    status: 'In Review',
    priority: 'High',
    lineOfBusiness: 'Universal Life',
    coverageAmount: 1000000,
    submittedDate: '2026-01-20',
    receivedDate: '2026-01-20',
    effectiveDate: '2026-02-05',
    assignedTo: 'Sarah Chen',
    riskScore: 58,
    medicalHistory: 'Hypertension, High Cholesterol',
    requirementsComplete: 65
  },
  {
    id: 'UW-2026-004',
    applicantName: 'Emily Thompson',
    status: 'Requirements Needed',
    priority: 'Medium',
    lineOfBusiness: 'Term Life',
    coverageAmount: 750000,
    submittedDate: '2026-01-19',
    receivedDate: '2026-01-19',
    effectiveDate: '2026-02-12',
    assignedTo: 'James Wilson',
    riskScore: 68,
    medicalHistory: 'Asthma',
    requirementsComplete: 30
  },
  {
    id: 'UW-2026-005',
    applicantName: 'Robert Martinez',
    status: 'Approved',
    priority: 'Low',
    lineOfBusiness: 'Whole Life',
    coverageAmount: 350000,
    submittedDate: '2026-01-18',
    receivedDate: '2026-01-18',
    effectiveDate: '2026-02-01',
    assignedTo: 'Sarah Chen',
    riskScore: 92,
    medicalHistory: 'None',
    requirementsComplete: 100
  },
  {
    id: 'UW-2026-006',
    applicantName: 'Jennifer Lee',
    status: 'In Review',
    priority: 'High',
    lineOfBusiness: 'Term Life',
    coverageAmount: 2000000,
    submittedDate: '2026-01-17',
    receivedDate: '2026-01-17',
    effectiveDate: '2026-01-31',
    assignedTo: 'Michael Park',
    riskScore: 61,
    medicalHistory: 'Cancer (remission 5 years)',
    requirementsComplete: 70
  },
  {
    id: 'UW-2026-007',
    applicantName: 'William Brown',
    status: 'Pending Review',
    priority: 'Medium',
    lineOfBusiness: 'Universal Life',
    coverageAmount: 800000,
    submittedDate: '2026-01-16',
    receivedDate: '2026-01-16',
    effectiveDate: '2026-02-08',
    assignedTo: 'James Wilson',
    riskScore: 75,
    medicalHistory: 'None',
    requirementsComplete: 55
  },
  {
    id: 'UW-2026-008',
    applicantName: 'Patricia Davis',
    status: 'Declined',
    priority: 'Low',
    lineOfBusiness: 'Term Life',
    coverageAmount: 500000,
    submittedDate: '2026-01-15',
    receivedDate: '2026-01-15',
    effectiveDate: '2026-01-30',
    assignedTo: 'Sarah Chen',
    riskScore: 35,
    medicalHistory: 'Heart Disease, Stroke',
    requirementsComplete: 100
  }
];

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
