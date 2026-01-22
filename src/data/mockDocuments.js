// Mock data for documents and IDP extraction results

export const documentTypes = {
  APPLICATION: 'Application Form',
  SOV: 'Statement of Values',
  LOSS_RUN: 'Loss Run',
  FINANCIAL: 'Financial Statement',
  MEDICAL: 'Medical Records',
  INSPECTION: 'Inspection Report',
  CERTIFICATE: 'Certificate of Insurance',
  ENDORSEMENT: 'Endorsement',
  OTHER: 'Other Document'
};

export const documentStatus = {
  PENDING_UPLOAD: 'Pending Upload',
  UPLOADED: 'Uploaded',
  PROCESSING: 'Processing',
  EXTRACTED: 'Extracted',
  VALIDATED: 'Validated',
  REJECTED: 'Rejected'
};

export const mockDocuments = [
  {
    id: 'DOC-001',
    submissionId: 'UW-2026-001',
    documentType: documentTypes.APPLICATION,
    fileName: 'Application_James_Anderson.pdf',
    fileSize: '2.4 MB',
    uploadedDate: '2026-01-22 09:15 AM',
    uploadedBy: 'Broker Portal',
    status: documentStatus.EXTRACTED,
    confidence: 98,
    pageCount: 8,
    extractionResults: {
      applicantName: 'James Anderson',
      dateOfBirth: '03/15/1985',
      ssn: 'XXX-XX-6789',
      address: '123 Main Street, Chicago, IL 60601',
      occupation: 'Software Engineer',
      annualIncome: '$125,000',
      coverageRequested: '$500,000',
      lineOfBusiness: 'Term Life',
      termLength: '20 years',
      beneficiary: 'Sarah Anderson (Spouse)',
      medicalHistory: {
        diabetes: true,
        diabetesType: 'Type 2',
        diagnosisDate: '2021',
        currentMedication: 'Metformin',
        lastA1C: '6.8%',
        smoker: false,
        height: '5\'10"',
        weight: '185 lbs',
        bloodPressure: '128/82'
      },
      extractedFields: 42,
      validatedFields: 40,
      flaggedFields: 2
    }
  },
  {
    id: 'DOC-002',
    submissionId: 'UW-2026-001',
    documentType: documentTypes.MEDICAL,
    fileName: 'Medical_Exam_James_Anderson.pdf',
    fileSize: '1.8 MB',
    uploadedDate: '2026-01-22 10:30 AM',
    uploadedBy: 'ExamOne',
    status: documentStatus.EXTRACTED,
    confidence: 95,
    pageCount: 4,
    extractionResults: {
      examDate: '2026-01-18',
      examiner: 'Dr. Michelle Roberts',
      facility: 'LabCorp - Chicago North',
      vitalSigns: {
        bloodPressure: '128/82',
        pulse: '72 bpm',
        temperature: '98.4°F',
        height: '70 inches',
        weight: '185 lbs',
        bmi: '26.5'
      },
      labResults: {
        cholesterol: '195 mg/dL',
        hdl: '52 mg/dL',
        ldl: '118 mg/dL',
        triglycerides: '125 mg/dL',
        glucose: '118 mg/dL',
        a1c: '6.8%',
        creatinine: '1.0 mg/dL',
        alt: '28 U/L',
        ast: '24 U/L'
      },
      urinalysis: {
        protein: 'Negative',
        glucose: 'Negative',
        blood: 'Negative'
      },
      summary: 'Overall health good with controlled Type 2 Diabetes. Patient compliant with medication.',
      extractedFields: 28,
      validatedFields: 28,
      flaggedFields: 0
    }
  },
  {
    id: 'DOC-003',
    submissionId: 'UW-2026-001',
    documentType: documentTypes.FINANCIAL,
    fileName: 'Tax_Return_2025_James_Anderson.pdf',
    fileSize: '3.2 MB',
    uploadedDate: '2026-01-22 11:00 AM',
    uploadedBy: 'James Anderson',
    status: documentStatus.EXTRACTED,
    confidence: 92,
    pageCount: 24,
    extractionResults: {
      taxYear: 2025,
      filingStatus: 'Married Filing Jointly',
      totalIncome: '$142,500',
      wages: '$125,000',
      otherIncome: '$17,500',
      adjustedGrossIncome: '$138,200',
      taxableIncome: '$114,800',
      totalTax: '$18,720',
      occupation: 'Computer Software Engineer',
      employer: 'TechCorp Solutions Inc.',
      extractedFields: 35,
      validatedFields: 33,
      flaggedFields: 2
    }
  },
  {
    id: 'DOC-004',
    submissionId: 'UW-2026-001',
    documentType: documentTypes.OTHER,
    fileName: 'Attending_Physician_Statement.pdf',
    fileSize: '956 KB',
    uploadedDate: '2026-01-22 02:15 PM',
    uploadedBy: 'Dr. Sarah Chen',
    status: documentStatus.PROCESSING,
    confidence: null,
    pageCount: 3,
    extractionResults: null
  }
];

export const getDocumentsBySubmission = (submissionId) => {
  return mockDocuments.filter(doc => doc.submissionId === submissionId);
};

export const getDocumentStatusColor = (status) => {
  switch (status) {
    case documentStatus.PENDING_UPLOAD:
      return 'warning';
    case documentStatus.UPLOADED:
      return 'info';
    case documentStatus.PROCESSING:
      return 'warning';
    case documentStatus.EXTRACTED:
      return 'success';
    case documentStatus.VALIDATED:
      return 'success';
    case documentStatus.REJECTED:
      return 'error';
    default:
      return 'neutral';
  }
};

export const idpConfidenceColor = (confidence) => {
  if (confidence >= 95) return '#24A148'; // Green
  if (confidence >= 85) return '#0095FF'; // Blue
  if (confidence >= 75) return '#FF6B00'; // Orange
  return '#D0021B'; // Red
};

// Document classification rules
export const documentClassification = {
  APPLICATION: {
    keywords: ['application', 'applicant', 'insured', 'coverage', 'beneficiary'],
    confidence: 'high',
    required: true
  },
  SOV: {
    keywords: ['statement of values', 'property schedule', 'building schedule', 'location'],
    confidence: 'high',
    required: false
  },
  LOSS_RUN: {
    keywords: ['loss history', 'claims history', 'loss run', 'clue report'],
    confidence: 'high',
    required: true
  },
  MEDICAL: {
    keywords: ['medical', 'exam', 'physician', 'health', 'lab results'],
    confidence: 'high',
    required: true
  },
  FINANCIAL: {
    keywords: ['financial', 'tax return', 'income', 'w2', '1040', 'balance sheet'],
    confidence: 'medium',
    required: false
  }
};

// IDP extraction metrics
export const idpMetrics = {
  totalDocumentsProcessed: 1247,
  averageConfidence: 94.2,
  averageProcessingTime: '23 seconds',
  fieldsExtracted: 52847,
  fieldsValidated: 50123,
  fieldsFlagged: 2724,
  straightThroughRate: 87.3
};
