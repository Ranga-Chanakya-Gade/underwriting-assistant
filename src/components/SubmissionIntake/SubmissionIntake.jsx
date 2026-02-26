import { useState, useMemo, useEffect } from 'react';
import {
  DxcHeading,
  DxcFlex,
  DxcTypography,
  DxcButton,
  DxcTextInput,
  DxcSelect,
  DxcInset,
  DxcBadge,
  DxcAccordion,
  DxcDialog,
} from '@dxc-technology/halstack-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import DocumentUpload from '../shared/DocumentUpload';
import { createSubmission, updateSubmission, SUBMISSION_TABLE, isConnected } from '../../services/servicenow';
import './SubmissionIntake.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SubmissionIntake = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedForms, setUploadedForms] = useState([]);
  const [supportDocs, setSupportDocs] = useState([]);
  const [extractedData, setExtractedData] = useState({
    // Annuitant Information
    annFirstName: 'Mia',
    annMiddleName: 'Elizabeth',
    annLastName: 'Robinson',
    annDOB: '07/18/1982',
    annSSN: '512-84-4391',
    annGender: 'Female',
    annRelationship: 'Self',
    annAddress: '1427 Willow Creek Dr',
    annCity: 'Charlotte',
    annState: 'NC',
    annZip: '28277',
    annCountryCitizenship: 'USA',
    annCountryResidency: 'USA',
    annEmail: 'mia.robinson82@email.com',
    annPhone: '',
    // Beneficiary 1 – Primary
    ben1FirstName: 'Daniel',
    ben1MiddleName: 'Thomas',
    ben1LastName: 'Robinson',
    ben1BenType: 'Primary',
    ben1Percentage: '100',
    ben1SSN: '611-73-9042',
    ben1DOB: '03/11/1980',
    ben1Address: '1427 Willow Creek Dr',
    ben1City: 'Charlotte',
    ben1State: 'NC',
    ben1Zip: '28277',
    ben1Relationship: 'Spouse',
    ben1Phone: '704.555.2811',
    // Beneficiary 2 – Contingent
    ben2FirstName: 'Olivia',
    ben2MiddleName: 'Grace',
    ben2LastName: 'Robinson',
    ben2BenType: 'Contingent',
    ben2Percentage: '100',
    ben2SSN: '623-92-1184',
    ben2DOB: '04/02/2010',
    ben2Address: '1427 Willow Creek Dr',
    ben2City: 'Charlotte',
    ben2State: 'NC',
    ben2Zip: '28277',
    ben2Relationship: 'Daughter',
    ben2Phone: '704.555.2811',
    // Plan Type
    planType: 'Non-Qualified',
    // Replacements
    hasExistingPolicies: 'No',
    willReplacePolicy: 'No',
    // Initial Purchase Payment
    initialPurchaseAmount: '$75,000',
    paymentType: 'Payment/Contribution',
    // Benefit Riders
    livingBenefitRider: 'FlexChoice Access Level (GLWB)',
    deathBenefitRider: '',
    // Purchase Payment Allocation
    allocationBloomAA60: '50',
    allocationBlackRockGlobal: '30',
    allocationJPMorgan: '20',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [lowConfidenceFields, setLowConfidenceFields] = useState(['annSSN', 'ben1SSN', 'ben2SSN']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessingBanner, setShowProcessingBanner] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDocProcessingModal, setShowDocProcessingModal] = useState(false);
  const [dontShowDocProcessingAgain, setDontShowDocProcessingAgain] = useState(false);
  const [showViewSource, setShowViewSource] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  // ServiceNow sys_id of the draft submission record (created on mount)
  const [snSysId, setSnSysId] = useState(null);
  // True while the SN draft record is still being created — blocks upload until ready
  const [snCreating, setSnCreating] = useState(isConnected());
  const [snSubmitting, setSnSubmitting] = useState(false);

  // Display number for breadcrumb / UI (falls back to draft label)
  const submissionId = snSysId ? snSysId : 'New Submission';

  // Create a draft submission record in ServiceNow as soon as the component mounts
  useEffect(() => {
    if (!isConnected()) return;
    createSubmission({
      applicant_name: 'Draft',
      status: 'new_submission',
    })
      .then(res => {
        const id = res?.result?.sys_id;
        if (id) setSnSysId(id);
      })
      .catch(err => console.error('[SubmissionIntake] draft creation failed:', err))
      .finally(() => setSnCreating(false));
  }, []);

  const validationSummary = useMemo(() => {
    const errorCount = Object.keys(validationErrors).length;
    const lowConfCount = lowConfidenceFields.length;
    return { errorCount, lowConfCount };
  }, [validationErrors, lowConfidenceFields]);

  const steps = [
    { number: 1, label: 'Upload Insurance Forms', completed: currentStep > 1 },
    { number: 2, label: 'Upload Supporting Documents', completed: currentStep > 2 },
    { number: 3, label: 'Review/Edit AI-Extracted Data', completed: currentStep > 3 },
    { number: 4, label: 'Submit', completed: false },
  ];

  const handleFileUpload = (files, isSupport = false) => {
    const newFiles = Array.from(files).map((file, index) => {
      const fileUrl = URL.createObjectURL(file);
      return {
        id: Date.now() + index,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        uploadDate: new Date().toLocaleDateString(),
        documentType: isSupport ? 'Loss Runs' : 'ACORD 125',
        description: isSupport ? '' : 'Application',
        file: file,
        fileUrl: fileUrl,
        fileType: file.type,
      };
    });

    if (isSupport) {
      setSupportDocs([...supportDocs, ...newFiles]);
    } else {
      setUploadedForms([...uploadedForms, ...newFiles]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      // Show Documents for Processing modal after Step 1 (ACORD forms are processed by AI)
      if (currentStep === 1 && !dontShowDocProcessingAgain && uploadedForms.length > 0) {
        setShowDocProcessingModal(true);
      } else {
        setCurrentStep(currentStep + 1);
        // Start processing simulation when leaving step 1 with uploaded forms
        if (currentStep === 1 && uploadedForms.length > 0) {
          setIsProcessing(true);
          setShowProcessingBanner(true);
          setTimeout(() => { setIsProcessing(false); }, 5000);
        }
      }
    }
  };

  const handleContinueFromDocProcessing = () => {
    setShowDocProcessingModal(false);
    setCurrentStep(2);
    setIsProcessing(true);
    setShowProcessingBanner(true);
    setTimeout(() => { setIsProcessing(false); }, 5000);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSnSubmitting(true);
    try {
      // Map form fields to actual ServiceNow table field names
      const snPayload = {
        applicant_name:   `${extractedData.ben1FirstName} ${extractedData.ben1LastName}`,
        line_of_business: extractedData.planType,
        coverage_type:    extractedData.paymentType,
        primary_state:    extractedData.ben1State,
        status:           'pending_review',
      };

      if (snSysId && isConnected()) {
        // Update the draft record created on mount
        await updateSubmission(snSysId, snPayload);
      } else if (isConnected()) {
        // Fallback: create new if draft was never created
        const res = await createSubmission(snPayload);
        const id = res?.result?.sys_id;
        if (id) setSnSysId(id);
      }
    } catch (err) {
      console.error('[SubmissionIntake] submit failed:', err);
    } finally {
      setSnSubmitting(false);
    }
    setShowSuccessModal(true);
  };

  const handleFieldChange = (field, value) => {
    setExtractedData({ ...extractedData, [field]: value });
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
    if (lowConfidenceFields.includes(field)) {
      setLowConfidenceFields(lowConfidenceFields.filter(f => f !== field));
    }
  };

  const renderProgressStepper = () => (
    <div className="progress-stepper">
      {steps.map((step, index) => (
        <div key={step.number} className="step-container">
          <div className="step-indicator-wrapper">
            <div className={`step-indicator ${
              step.completed ? 'completed' :
              step.number === currentStep ? 'active' : 'pending'
            }`}>
              {step.completed ? (
                <span className="material-icons" style={{ fontSize: '16px' }}>check</span>
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <DxcTypography
              fontSize="font-scale-01"
              fontWeight={step.number === currentStep ? 'font-weight-semibold' : 'font-weight-regular'}
              color={step.number === currentStep ? '#1B75BB' : 'var(--color-fg-neutral-stronger)'}
            >
              {step.label}
            </DxcTypography>
          </div>
          {index < steps.length - 1 && <div className="step-connector" />}
        </div>
      ))}
    </div>
  );

  const renderBreadcrumb = () => (
    <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center" style={{ marginBottom: 'var(--spacing-gap-m)' }}>
      <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-stronger)">
        Submissions
      </DxcTypography>
      <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-stronger)">/</DxcTypography>
      <DxcTypography fontSize="font-scale-02" color="#1B75BB">
        Submission ID - {submissionId}
      </DxcTypography>
    </DxcFlex>
  );

  // ─── STEP 1 ────────────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="step-content-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <DxcTypography fontSize="var(--font-scale-04, 1.25rem)" fontWeight="font-weight-semibold" color="#333333">
          Upload Insurance Forms (ACORD)
        </DxcTypography>

        <DocumentUpload
          tableName={SUBMISSION_TABLE}
          submissionId={snSysId}
          awaitingRecord={snCreating}
          onUploadComplete={(data) => handleFileUpload(data.files)}
          onCancel={() => {}}
        />

        {uploadedForms.length > 0 && (
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
              Uploaded Files
            </DxcTypography>
            <table className="document-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Document Type</th>
                  <th>Description</th>
                  <th>Size</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedForms.map((file) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{file.documentType}</td>
                    <td>{file.description}</td>
                    <td>{file.size}</td>
                    <td>{file.uploadDate}</td>
                    <td>
                      <button className="icon-btn-small" onClick={() => setUploadedForms(uploadedForms.filter(f => f.id !== file.id))}>
                        <span className="material-icons">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DxcFlex>
        )}
      </DxcFlex>
    </div>
  );

  // ─── STEP 2 ────────────────────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="step-content-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <DxcTypography fontSize="var(--font-scale-04, 1.25rem)" fontWeight="font-weight-semibold" color="#333333">
          Upload Supporting Documents
        </DxcTypography>

        {/* Processing status banner from Step 1 ACORD processing */}
        {isProcessing && showProcessingBanner && (
          <div className="processing-banner">
            <DxcFlex alignItems="flex-start" justifyContent="space-between" gap="var(--spacing-gap-m)">
              <DxcFlex alignItems="center" gap="var(--spacing-gap-m)">
                <span className="material-icons" style={{ color: '#1B75BB', fontSize: '24px' }}>info</span>
                <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" fontWeight="font-weight-semibold">
                    ACORD forms are being processed
                  </DxcTypography>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)">
                    AI extraction is running on your uploaded insurance forms. You can continue uploading supporting documents while processing completes.
                  </DxcTypography>
                </DxcFlex>
              </DxcFlex>
              <button className="close-banner-btn" onClick={() => setShowProcessingBanner(false)} aria-label="Close banner">
                <span className="material-icons">close</span>
              </button>
            </DxcFlex>
          </div>
        )}

        <DocumentUpload
          tableName={SUBMISSION_TABLE}
          submissionId={snSysId}
          awaitingRecord={snCreating}
          onUploadComplete={(data) => handleFileUpload(data.files, true)}
          onCancel={() => {}}
        />

        {supportDocs.length > 0 && (
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
              Uploaded Supporting Documents
            </DxcTypography>
            <table className="document-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Document Type</th>
                  <th>Description</th>
                  <th>Size</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {supportDocs.map((file) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>
                      <DxcSelect
                        size="small"
                        options={[
                          { label: 'Loss Runs', value: 'loss-runs' },
                          { label: 'MVR', value: 'mvr' },
                          { label: 'Financial Statement', value: 'financial' },
                          { label: 'Other', value: 'other' },
                        ]}
                        value="loss-runs"
                      />
                    </td>
                    <td>
                      <DxcTextInput size="small" placeholder="Add description..." />
                    </td>
                    <td>{file.size}</td>
                    <td>{file.uploadDate}</td>
                    <td>
                      <button className="icon-btn-small" onClick={() => setSupportDocs(supportDocs.filter(f => f.id !== file.id))}>
                        <span className="material-icons">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DxcFlex>
        )}
      </DxcFlex>
    </div>
  );

  // ─── STEP 3 ────────────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="step-content-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <DxcTypography fontSize="var(--font-scale-04, 1.25rem)" fontWeight="font-weight-semibold" color="#333333">
          Review / Edit Extraction
        </DxcTypography>

        <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-stronger)">
          Review and modify the AI-extracted data. Override AI suggestions and address validation issues before submission.
        </DxcTypography>

        {/* Processing Banner */}
        {isProcessing && showProcessingBanner && (
          <div className="processing-banner">
            <DxcFlex alignItems="flex-start" justifyContent="space-between" gap="var(--spacing-gap-m)">
              <DxcFlex alignItems="center" gap="var(--spacing-gap-m)">
                <span className="material-icons" style={{ color: '#1B75BB', fontSize: '24px' }}>info</span>
                <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" fontWeight="font-weight-semibold">
                    Documents are still being processed
                  </DxcTypography>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)">
                    The system is currently processing the documents for data extraction. Please wait for a few minutes then refresh the page to see the results.
                  </DxcTypography>
                </DxcFlex>
              </DxcFlex>
              <button className="close-banner-btn" onClick={() => setShowProcessingBanner(false)} aria-label="Close banner">
                <span className="material-icons">close</span>
              </button>
            </DxcFlex>
          </div>
        )}

        {/* Error Alert (separate) */}
        {validationSummary.errorCount > 0 && (
          <div className="alert-error">
            <DxcFlex alignItems="center" gap="var(--spacing-gap-m)">
              <span className="material-icons" style={{ color: '#D02E2E', fontSize: '22px' }}>error</span>
              <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" fontWeight="font-weight-semibold" color="#D02E2E">
                {validationSummary.errorCount} Validation Error{validationSummary.errorCount !== 1 ? 's' : ''} — Fields with data inconsistencies that need to be resolved
              </DxcTypography>
            </DxcFlex>
          </div>
        )}

        {/* Low Confidence Alert (separate) */}
        {validationSummary.lowConfCount > 0 && (
          <div className="alert-low-confidence">
            <DxcFlex alignItems="center" gap="var(--spacing-gap-m)">
              <span className="material-icons" style={{ color: '#F6921E', fontSize: '22px' }}>warning_amber</span>
              <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" fontWeight="font-weight-semibold" color="#F6921E">
                {validationSummary.lowConfCount} Low AI Confidence — Fields where the AI extraction confidence is below threshold
              </DxcTypography>
            </DxcFlex>
          </div>
        )}

        <DxcFlex justifyContent="flex-end">
          <button
            className={`view-source-btn ${showViewSource ? 'active' : ''}`}
            onClick={() => setShowViewSource(!showViewSource)}
          >
            <DxcFlex alignItems="center" gap="var(--spacing-gap-xs)">
              <span className="material-icons" style={{ fontSize: '18px' }}>description</span>
              <span>{showViewSource ? 'Hide Source' : 'View Source'}</span>
            </DxcFlex>
          </button>
        </DxcFlex>

        {/* Side-by-side layout when View Source is active */}
        <div className={showViewSource ? 'extraction-container side-by-side' : 'extraction-container'}>
          <div className="extraction-fields">

            {/* Annuitant Information */}
            <div className="form-section">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                Annuitant Information
              </DxcTypography>
              <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
                <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="First Name" value={extractedData.annFirstName} onChange={({ value }) => handleFieldChange('annFirstName', value)} size="fillParent" />
                    <DxcTextInput label="Middle Name" value={extractedData.annMiddleName} onChange={({ value }) => handleFieldChange('annMiddleName', value)} size="fillParent" />
                    <DxcTextInput label="Last Name" value={extractedData.annLastName} onChange={({ value }) => handleFieldChange('annLastName', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="Date of Birth" value={extractedData.annDOB} onChange={({ value }) => handleFieldChange('annDOB', value)} size="fillParent" />
                    <div style={{ position: 'relative', width: '100%' }}>
                      {lowConfidenceFields.includes('annSSN') && (
                        <span className="field-indicator warning" title="Low AI Confidence">
                          <span className="confidence-dot"></span>
                        </span>
                      )}
                      <DxcTextInput label="Social Security Number" value={extractedData.annSSN} onChange={({ value }) => handleFieldChange('annSSN', value)} size="fillParent" />
                    </div>
                    <DxcTextInput label="Gender" value={extractedData.annGender} onChange={({ value }) => handleFieldChange('annGender', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="Relationship to Owner" value={extractedData.annRelationship} onChange={({ value }) => handleFieldChange('annRelationship', value)} size="fillParent" />
                    <DxcTextInput label="Country of Citizenship" value={extractedData.annCountryCitizenship} onChange={({ value }) => handleFieldChange('annCountryCitizenship', value)} size="fillParent" />
                    <DxcTextInput label="Country of Legal Residency" value={extractedData.annCountryResidency} onChange={({ value }) => handleFieldChange('annCountryResidency', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcTextInput label="Street Address" value={extractedData.annAddress} onChange={({ value }) => handleFieldChange('annAddress', value)} size="fillParent" />
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="City" value={extractedData.annCity} onChange={({ value }) => handleFieldChange('annCity', value)} size="fillParent" />
                    <DxcTextInput label="State" value={extractedData.annState} onChange={({ value }) => handleFieldChange('annState', value)} size="fillParent" />
                    <DxcTextInput label="Zip" value={extractedData.annZip} onChange={({ value }) => handleFieldChange('annZip', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="Email Address" value={extractedData.annEmail} onChange={({ value }) => handleFieldChange('annEmail', value)} size="fillParent" />
                    <DxcTextInput label="Phone Number" value={extractedData.annPhone} onChange={({ value }) => handleFieldChange('annPhone', value)} size="fillParent" placeholder="Not provided" />
                  </DxcFlex>
                </DxcFlex>
              </div>
            </div>

            {/* Beneficiary 1 */}
            <div className="form-section">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                Beneficiary 1 — Primary &nbsp;
                <span style={{ fontWeight: 'normal', color: 'var(--color-fg-neutral-medium)' }}>{extractedData.ben1Percentage}%</span>
              </DxcTypography>
              <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
                <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="First Name" value={extractedData.ben1FirstName} onChange={({ value }) => handleFieldChange('ben1FirstName', value)} size="fillParent" />
                    <DxcTextInput label="Middle Name" value={extractedData.ben1MiddleName} onChange={({ value }) => handleFieldChange('ben1MiddleName', value)} size="fillParent" />
                    <DxcTextInput label="Last Name" value={extractedData.ben1LastName} onChange={({ value }) => handleFieldChange('ben1LastName', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <div style={{ position: 'relative', width: '100%' }}>
                      {lowConfidenceFields.includes('ben1SSN') && (
                        <span className="field-indicator warning" title="Low AI Confidence">
                          <span className="confidence-dot"></span>
                        </span>
                      )}
                      <DxcTextInput label="SSN/TIN" value={extractedData.ben1SSN} onChange={({ value }) => handleFieldChange('ben1SSN', value)} size="fillParent" />
                    </div>
                    <DxcTextInput label="Date of Birth" value={extractedData.ben1DOB} onChange={({ value }) => handleFieldChange('ben1DOB', value)} size="fillParent" />
                    <DxcTextInput label="Relationship to Owner" value={extractedData.ben1Relationship} onChange={({ value }) => handleFieldChange('ben1Relationship', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcTextInput label="Street Address" value={extractedData.ben1Address} onChange={({ value }) => handleFieldChange('ben1Address', value)} size="fillParent" />
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="City" value={extractedData.ben1City} onChange={({ value }) => handleFieldChange('ben1City', value)} size="fillParent" />
                    <DxcTextInput label="State" value={extractedData.ben1State} onChange={({ value }) => handleFieldChange('ben1State', value)} size="fillParent" />
                    <DxcTextInput label="Zip" value={extractedData.ben1Zip} onChange={({ value }) => handleFieldChange('ben1Zip', value)} size="fillParent" />
                    <DxcTextInput label="Phone" value={extractedData.ben1Phone} onChange={({ value }) => handleFieldChange('ben1Phone', value)} size="fillParent" />
                  </DxcFlex>
                </DxcFlex>
              </div>
            </div>

            {/* Beneficiary 2 */}
            <div className="form-section">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                Beneficiary 2 — Contingent &nbsp;
                <span style={{ fontWeight: 'normal', color: 'var(--color-fg-neutral-medium)' }}>{extractedData.ben2Percentage}%</span>
              </DxcTypography>
              <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
                <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="First Name" value={extractedData.ben2FirstName} onChange={({ value }) => handleFieldChange('ben2FirstName', value)} size="fillParent" />
                    <DxcTextInput label="Middle Name" value={extractedData.ben2MiddleName} onChange={({ value }) => handleFieldChange('ben2MiddleName', value)} size="fillParent" />
                    <DxcTextInput label="Last Name" value={extractedData.ben2LastName} onChange={({ value }) => handleFieldChange('ben2LastName', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <div style={{ position: 'relative', width: '100%' }}>
                      {lowConfidenceFields.includes('ben2SSN') && (
                        <span className="field-indicator warning" title="Low AI Confidence">
                          <span className="confidence-dot"></span>
                        </span>
                      )}
                      <DxcTextInput label="SSN/TIN" value={extractedData.ben2SSN} onChange={({ value }) => handleFieldChange('ben2SSN', value)} size="fillParent" />
                    </div>
                    <DxcTextInput label="Date of Birth" value={extractedData.ben2DOB} onChange={({ value }) => handleFieldChange('ben2DOB', value)} size="fillParent" />
                    <DxcTextInput label="Relationship to Owner" value={extractedData.ben2Relationship} onChange={({ value }) => handleFieldChange('ben2Relationship', value)} size="fillParent" />
                  </DxcFlex>
                  <DxcTextInput label="Street Address" value={extractedData.ben2Address} onChange={({ value }) => handleFieldChange('ben2Address', value)} size="fillParent" />
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="City" value={extractedData.ben2City} onChange={({ value }) => handleFieldChange('ben2City', value)} size="fillParent" />
                    <DxcTextInput label="State" value={extractedData.ben2State} onChange={({ value }) => handleFieldChange('ben2State', value)} size="fillParent" />
                    <DxcTextInput label="Zip" value={extractedData.ben2Zip} onChange={({ value }) => handleFieldChange('ben2Zip', value)} size="fillParent" />
                    <DxcTextInput label="Phone" value={extractedData.ben2Phone} onChange={({ value }) => handleFieldChange('ben2Phone', value)} size="fillParent" />
                  </DxcFlex>
                </DxcFlex>
              </div>
            </div>

            {/* Plan Type & Replacements */}
            <div className="form-section">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                Plan Type &amp; Replacements
              </DxcTypography>
              <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
                <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                  <DxcTextInput label="Plan Type" value={extractedData.planType} onChange={({ value }) => handleFieldChange('planType', value)} size="fillParent" />
                  <DxcFlex gap="var(--spacing-gap-m)">
                    <DxcTextInput label="Existing life insurance / annuity contracts?" value={extractedData.hasExistingPolicies} onChange={({ value }) => handleFieldChange('hasExistingPolicies', value)} size="fillParent" />
                    <DxcTextInput label="Will annuity replace existing policy?" value={extractedData.willReplacePolicy} onChange={({ value }) => handleFieldChange('willReplacePolicy', value)} size="fillParent" />
                  </DxcFlex>
                </DxcFlex>
              </div>
            </div>

            {/* Initial Purchase Payment */}
            <div className="form-section">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                Initial Purchase Payment
              </DxcTypography>
              <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
                <DxcFlex gap="var(--spacing-gap-m)">
                  <DxcTextInput label="Amount" value={extractedData.initialPurchaseAmount} onChange={({ value }) => handleFieldChange('initialPurchaseAmount', value)} size="fillParent" />
                  <DxcTextInput label="Payment Type" value={extractedData.paymentType} onChange={({ value }) => handleFieldChange('paymentType', value)} size="fillParent" />
                </DxcFlex>
              </div>
            </div>

            {/* Benefit Riders */}
            <div className="form-section">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                Benefit Riders
              </DxcTypography>
              <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
                <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                  <DxcTextInput label="Living Benefit Rider (GLWB)" value={extractedData.livingBenefitRider} onChange={({ value }) => handleFieldChange('livingBenefitRider', value)} size="fillParent" />
                  <DxcTextInput label="Death Benefit Rider" value={extractedData.deathBenefitRider} onChange={({ value }) => handleFieldChange('deathBenefitRider', value)} size="fillParent" placeholder="None selected" />
                </DxcFlex>
              </div>
            </div>

            {/* Purchase Payment Allocation */}
            <div className="form-section">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                Purchase Payment Allocation
              </DxcTypography>
              <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
                <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                  <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
                    <DxcTextInput label="Bloom Asset Allocation 60 Portfolio (%)" value={extractedData.allocationBloomAA60} onChange={({ value }) => handleFieldChange('allocationBloomAA60', value)} size="fillParent" />
                    <DxcTextInput label="BlackRock Global Allocation V.I. Fund (%)" value={extractedData.allocationBlackRockGlobal} onChange={({ value }) => handleFieldChange('allocationBlackRockGlobal', value)} size="fillParent" />
                    <DxcTextInput label="JPMorgan Global Active Allocation (%)" value={extractedData.allocationJPMorgan} onChange={({ value }) => handleFieldChange('allocationJPMorgan', value)} size="fillParent" />
                  </DxcFlex>
                </DxcFlex>
              </div>
            </div>

          </div>

          {/* Document Viewer - shown when View Source is active */}
          {showViewSource && (
            <div className="document-viewer">
              <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
                  Source Document - {uploadedForms.length > 0 ? uploadedForms[0].documentType : 'ACORD 125'}
                </DxcTypography>
                <div className="document-preview">
                  {uploadedForms.length > 0 && uploadedForms[0].fileUrl ? (
                    uploadedForms[0].fileType === 'application/pdf' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-s)', width: '100%' }}>
                        <DxcFlex alignItems="center" justifyContent="center" gap="var(--spacing-gap-s)" style={{ padding: 'var(--spacing-padding-xs)', backgroundColor: 'var(--color-bg-neutral-lighter)', borderRadius: 'var(--border-radius-s)' }}>
                          <button className="zoom-btn" onClick={() => setScale(Math.max(0.5, scale - 0.25))} disabled={scale <= 0.5} title="Zoom Out">
                            <span className="material-icons" style={{ fontSize: '18px' }}>remove</span>
                          </button>
                          <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold">
                            {Math.round(scale * 100)}%
                          </DxcTypography>
                          <button className="zoom-btn" onClick={() => setScale(Math.min(2.0, scale + 0.25))} disabled={scale >= 2.0} title="Zoom In">
                            <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
                          </button>
                          <button className="zoom-btn" onClick={() => setScale(1.0)} title="Reset Zoom">
                            <span className="material-icons" style={{ fontSize: '18px' }}>refresh</span>
                          </button>
                        </DxcFlex>
                        <div style={{ overflowY: 'auto', maxHeight: '700px', display: 'flex', justifyContent: 'center' }}>
                          <Document
                            file={uploadedForms[0].fileUrl}
                            onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNumber(1); }}
                            onLoadError={(error) => console.error('Error loading PDF:', error)}
                          >
                            <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} />
                          </Document>
                        </div>
                        {numPages && numPages > 1 && (
                          <DxcFlex alignItems="center" justifyContent="center" gap="var(--spacing-gap-m)" style={{ padding: 'var(--spacing-padding-s)', backgroundColor: 'var(--color-bg-neutral-lighter)', borderRadius: 'var(--border-radius-s)' }}>
                            <DxcButton label="Previous" mode="secondary" size="small" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)} />
                            <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" fontWeight="font-weight-semibold">
                              Page {pageNumber} of {numPages}
                            </DxcTypography>
                            <DxcButton label="Next" mode="secondary" size="small" disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)} />
                          </DxcFlex>
                        )}
                      </div>
                    ) : uploadedForms[0].fileType.startsWith('image/') ? (
                      <img src={uploadedForms[0].fileUrl} alt={uploadedForms[0].name} style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />
                    ) : (
                      <DxcFlex direction="column" alignItems="center" justifyContent="center" style={{ height: '100%', padding: 'var(--spacing-padding-xl)' }}>
                        <span className="material-icons" style={{ fontSize: '120px', color: '#1B75BB', marginBottom: 'var(--spacing-gap-m)' }}>description</span>
                        <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">{uploadedForms[0].name}</DxcTypography>
                        <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-medium)" style={{ marginTop: 'var(--spacing-gap-s)' }}>Preview not available for this file type</DxcTypography>
                      </DxcFlex>
                    )
                  ) : (
                    <DxcFlex direction="column" alignItems="center" justifyContent="center" style={{ height: '100%', padding: 'var(--spacing-padding-xl)' }}>
                      <span className="material-icons" style={{ fontSize: '120px', color: '#1B75BB', marginBottom: 'var(--spacing-gap-m)' }}>description</span>
                      <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="var(--color-fg-neutral-stronger)">ACORD 125n</DxcTypography>
                      <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-medium)" style={{ marginTop: 'var(--spacing-gap-s)' }}>No document uploaded yet</DxcTypography>
                    </DxcFlex>
                  )}
                </div>
              </DxcFlex>
            </div>
          )}
        </div>
      </DxcFlex>
    </div>
  );

  // ─── STEP 4 ────────────────────────────────────────────────────────────────
  const renderStep4 = () => {
    const hasErrors = validationSummary.errorCount > 0;
    const hasDocs = uploadedForms.length > 0;
    const allFieldsFilled = extractedData.ben1FirstName && extractedData.ben1LastName && extractedData.planType;

    return (
      <div className="step-content-container">
        <DxcFlex direction="column" gap="var(--spacing-gap-l)">
          <DxcTypography fontSize="var(--font-scale-04, 1.25rem)" fontWeight="font-weight-semibold" color="#333333">
            Review and Submit
          </DxcTypography>

          <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-stronger)">
            Please review all information before submitting.
          </DxcTypography>

          {/* Submission Checklist */}
          <div className="submission-checklist">
            <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">
              Submission Checklist
            </DxcTypography>
            <div style={{ marginTop: 'var(--spacing-gap-m)' }}>
              <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
                  <span className="material-icons" style={{ fontSize: '20px', color: allFieldsFilled ? '#37A526' : '#D02E2E' }}>
                    {allFieldsFilled ? 'check_circle' : 'cancel'}
                  </span>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)">All required fields completed</DxcTypography>
                </DxcFlex>
                <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
                  <span className="material-icons" style={{ fontSize: '20px', color: hasDocs ? '#37A526' : '#D02E2E' }}>
                    {hasDocs ? 'check_circle' : 'cancel'}
                  </span>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)">Documents uploaded</DxcTypography>
                </DxcFlex>
                <DxcFlex alignItems="center" gap="var(--spacing-gap-s)">
                  <span className="material-icons" style={{ fontSize: '20px', color: !hasErrors ? '#37A526' : '#D02E2E' }}>
                    {!hasErrors ? 'check_circle' : 'cancel'}
                  </span>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)">No unresolved validation errors</DxcTypography>
                </DxcFlex>
              </DxcFlex>
            </div>
          </div>

          {/* Annuitant Information */}
          <div className="review-card">
            <div className="review-card-header">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">Annuitant Information</DxcTypography>
            </div>
            <div className="review-card-body">
              <div className="review-row"><span className="review-label">Name</span><span className="review-value">{extractedData.annFirstName} {extractedData.annMiddleName} {extractedData.annLastName}</span></div>
              <div className="review-row"><span className="review-label">Date of Birth</span><span className="review-value">{extractedData.annDOB}</span></div>
              <div className="review-row"><span className="review-label">SSN</span><span className="review-value">{extractedData.annSSN}</span></div>
              <div className="review-row"><span className="review-label">Gender</span><span className="review-value">{extractedData.annGender}</span></div>
              <div className="review-row"><span className="review-label">Relationship to Owner</span><span className="review-value">{extractedData.annRelationship}</span></div>
              <div className="review-row"><span className="review-label">Address</span><span className="review-value">{extractedData.annAddress}, {extractedData.annCity}, {extractedData.annState} {extractedData.annZip}</span></div>
              <div className="review-row"><span className="review-label">Citizenship / Residency</span><span className="review-value">{extractedData.annCountryCitizenship} / {extractedData.annCountryResidency}</span></div>
              <div className="review-row"><span className="review-label">Email</span><span className="review-value">{extractedData.annEmail}</span></div>
              {extractedData.annPhone && <div className="review-row"><span className="review-label">Phone</span><span className="review-value">{extractedData.annPhone}</span></div>}
            </div>
          </div>

          {/* Beneficiary 1 */}
          <div className="review-card">
            <div className="review-card-header">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">Beneficiary 1 — Primary ({extractedData.ben1Percentage}%)</DxcTypography>
            </div>
            <div className="review-card-body">
              <div className="review-row"><span className="review-label">Name</span><span className="review-value">{extractedData.ben1FirstName} {extractedData.ben1MiddleName} {extractedData.ben1LastName}</span></div>
              <div className="review-row"><span className="review-label">SSN/TIN</span><span className="review-value">{extractedData.ben1SSN}</span></div>
              <div className="review-row"><span className="review-label">Date of Birth</span><span className="review-value">{extractedData.ben1DOB}</span></div>
              <div className="review-row"><span className="review-label">Relationship</span><span className="review-value">{extractedData.ben1Relationship}</span></div>
              <div className="review-row"><span className="review-label">Address</span><span className="review-value">{extractedData.ben1Address}, {extractedData.ben1City}, {extractedData.ben1State} {extractedData.ben1Zip}</span></div>
              <div className="review-row"><span className="review-label">Phone</span><span className="review-value">{extractedData.ben1Phone}</span></div>
            </div>
          </div>

          {/* Beneficiary 2 */}
          <div className="review-card">
            <div className="review-card-header">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">Beneficiary 2 — Contingent ({extractedData.ben2Percentage}%)</DxcTypography>
            </div>
            <div className="review-card-body">
              <div className="review-row"><span className="review-label">Name</span><span className="review-value">{extractedData.ben2FirstName} {extractedData.ben2MiddleName} {extractedData.ben2LastName}</span></div>
              <div className="review-row"><span className="review-label">SSN/TIN</span><span className="review-value">{extractedData.ben2SSN}</span></div>
              <div className="review-row"><span className="review-label">Date of Birth</span><span className="review-value">{extractedData.ben2DOB}</span></div>
              <div className="review-row"><span className="review-label">Relationship</span><span className="review-value">{extractedData.ben2Relationship}</span></div>
              <div className="review-row"><span className="review-label">Address</span><span className="review-value">{extractedData.ben2Address}, {extractedData.ben2City}, {extractedData.ben2State} {extractedData.ben2Zip}</span></div>
              <div className="review-row"><span className="review-label">Phone</span><span className="review-value">{extractedData.ben2Phone}</span></div>
            </div>
          </div>

          {/* Plan Type & Replacements */}
          <div className="review-card">
            <div className="review-card-header">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">Plan Type &amp; Replacements</DxcTypography>
            </div>
            <div className="review-card-body">
              <div className="review-row"><span className="review-label">Plan Type</span><span className="review-value">{extractedData.planType}</span></div>
              <div className="review-row"><span className="review-label">Existing policies/annuities?</span><span className="review-value">{extractedData.hasExistingPolicies}</span></div>
              <div className="review-row"><span className="review-label">Will replace existing policy?</span><span className="review-value">{extractedData.willReplacePolicy}</span></div>
            </div>
          </div>

          {/* Initial Purchase Payment */}
          <div className="review-card">
            <div className="review-card-header">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">Initial Purchase Payment</DxcTypography>
            </div>
            <div className="review-card-body">
              <div className="review-row"><span className="review-label">Amount</span><span className="review-value">{extractedData.initialPurchaseAmount}</span></div>
              <div className="review-row"><span className="review-label">Payment Type</span><span className="review-value">{extractedData.paymentType}</span></div>
            </div>
          </div>

          {/* Benefit Riders & Allocation */}
          <div className="review-card">
            <div className="review-card-header">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">Benefit Riders &amp; Allocation</DxcTypography>
            </div>
            <div className="review-card-body">
              <div className="review-row"><span className="review-label">Living Benefit Rider</span><span className="review-value">{extractedData.livingBenefitRider}</span></div>
              {extractedData.deathBenefitRider && <div className="review-row"><span className="review-label">Death Benefit Rider</span><span className="review-value">{extractedData.deathBenefitRider}</span></div>}
              <div className="review-row"><span className="review-label">Bloom Asset Allocation 60</span><span className="review-value">{extractedData.allocationBloomAA60}%</span></div>
              <div className="review-row"><span className="review-label">BlackRock Global Allocation V.I.</span><span className="review-value">{extractedData.allocationBlackRockGlobal}%</span></div>
              <div className="review-row"><span className="review-label">JPMorgan Global Active Allocation</span><span className="review-value">{extractedData.allocationJPMorgan}%</span></div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="review-card">
            <div className="review-card-header">
              <DxcTypography fontSize="var(--font-scale-03, 1rem)" fontWeight="font-weight-semibold" color="#333333">Uploaded Documents</DxcTypography>
            </div>
            <div className="review-card-body">
              {uploadedForms.length > 0 && (
                <>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" fontWeight="font-weight-semibold" color="#333333">Insurance Forms</DxcTypography>
                  {uploadedForms.map(file => (
                    <div key={file.id} className="review-row"><span className="review-label">{file.documentType}</span><span className="review-value">{file.name}</span></div>
                  ))}
                </>
              )}
              {supportDocs.length > 0 && (
                <div style={{ marginTop: uploadedForms.length > 0 ? 'var(--spacing-gap-m)' : '0' }}>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" fontWeight="font-weight-semibold" color="#333333">Supporting Documents</DxcTypography>
                  {supportDocs.map(file => (
                    <div key={file.id} className="review-row"><span className="review-label">{file.documentType}</span><span className="review-value">{file.name}</span></div>
                  ))}
                </div>
              )}
              {uploadedForms.length === 0 && supportDocs.length === 0 && (
                <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-medium)">No documents uploaded</DxcTypography>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="action-bar">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcButton label="Cancel" mode="tertiary" onClick={() => {}} />
              <DxcFlex gap="var(--spacing-gap-m)">
                <DxcButton label="Save as Draft" mode="secondary" onClick={() => {}} />
                <DxcButton label="Submit" mode="primary" onClick={handleSubmit} />
              </DxcFlex>
            </DxcFlex>
          </div>
        </DxcFlex>
      </div>
    );
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: 'var(--spacing-padding-l)', backgroundColor: '#f5f5f5', minHeight: '100%' }}>
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        {renderBreadcrumb()}

        <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
          <DxcTypography fontSize="var(--font-scale-05, 1.5rem)" fontWeight="font-weight-semibold" color="#333333">
            New Submission
          </DxcTypography>
          <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-stronger)">
            {submissionId} 
          </DxcTypography>
        </DxcFlex>

        {renderProgressStepper()}

        <div>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation buttons (Step 4 has its own action bar) */}
        {currentStep < 4 && (
          <DxcFlex justifyContent="space-between">
            <div>
              {currentStep > 1 && (
                <DxcButton label="Previous Step" mode="secondary" onClick={handlePreviousStep} />
              )}
            </div>
            <DxcButton label="Next Step" mode="primary" onClick={handleNextStep} />
          </DxcFlex>
        )}
      </DxcFlex>

      {/* Success Modal */}
      {showSuccessModal && (
        <DxcDialog onCloseClick={() => setShowSuccessModal(false)}>
          <div style={{ padding: 'var(--spacing-padding-l)', minWidth: '400px' }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-m)" alignItems="center">
              <span className="material-icons" style={{ fontSize: '48px', color: '#37A526' }}>check_circle</span>
              <DxcTypography fontSize="var(--font-scale-04, 1.25rem)" fontWeight="font-weight-semibold" color="#333333">
                Submission Successful
              </DxcTypography>
              <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-stronger)" style={{ textAlign: 'center' }}>
                Your submission has been successfully processed. Please reach out to the support team for any questions or concerns.
              </DxcTypography>
              <DxcButton label="Okay" mode="primary" onClick={() => setShowSuccessModal(false)} />
            </DxcFlex>
          </div>
        </DxcDialog>
      )}

      {/* Documents for Processing Modal — shown after Step 1 */}
      {showDocProcessingModal && (
        <DxcDialog onCloseClick={() => setShowDocProcessingModal(false)}>
          <div style={{ padding: 'var(--spacing-padding-l)', minWidth: '500px' }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-l)">
              <DxcFlex alignItems="flex-start" gap="var(--spacing-gap-m)">
                <span className="material-icons" style={{ color: '#1B75BB', fontSize: '32px' }}>info</span>
                <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                  <DxcTypography fontSize="var(--font-scale-04, 1.25rem)" fontWeight="font-weight-semibold" color="#333333">
                    Documents for Processing
                  </DxcTypography>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-stronger)">
                    The ACORD forms you uploaded will now be processed by our AI extraction engine. This typically takes 2-5 minutes depending on document complexity.
                  </DxcTypography>
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)" color="var(--color-fg-neutral-stronger)" style={{ marginTop: 'var(--spacing-gap-s)' }}>
                    You can continue uploading supporting documents while processing runs. The extracted data will be available for review in Step 3.
                  </DxcTypography>
                </DxcFlex>
              </DxcFlex>

              <div style={{ borderTop: '1px solid var(--color-border-neutral-lighter)', paddingTop: 'var(--spacing-gap-m)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-gap-s)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={dontShowDocProcessingAgain}
                    onChange={(e) => setDontShowDocProcessingAgain(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <DxcTypography fontSize="var(--font-scale-02, 0.875rem)">Do not show this message again</DxcTypography>
                </label>
              </div>

              <DxcFlex justifyContent="flex-end" gap="var(--spacing-gap-m)">
                <DxcButton label="Cancel" mode="secondary" onClick={() => setShowDocProcessingModal(false)} />
                <DxcButton label="Continue" mode="primary" onClick={handleContinueFromDocProcessing} />
              </DxcFlex>
            </DxcFlex>
          </div>
        </DxcDialog>
      )}
    </div>
  );
};

export default SubmissionIntake;
