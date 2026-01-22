import { useState } from 'react';
import {
  DxcHeading,
  DxcFlex,
  DxcContainer,
  DxcTypography,
  DxcButton,
  DxcTextInput,
  DxcSelect,
  DxcDateInput,
  DxcTextarea,
  DxcRadioGroup,
  DxcProgressBar,
  DxcAlert,
  DxcInset,
} from '@dxc-technology/halstack-react';
import './SubmissionIntake.css';

const SubmissionIntake = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Applicant Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    phone: '',

    // Coverage Info
    lineOfBusiness: '',
    coverageAmount: '',
    effectiveDate: '',

    // Medical Info
    hasMedicalConditions: '',
    medicalDetails: '',
    smoker: '',

    // Additional Info
    occupation: '',
    annualIncome: '',
    beneficiary: '',
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting:', formData);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      ssn: '',
      email: '',
      phone: '',
      lineOfBusiness: '',
      coverageAmount: '',
      effectiveDate: '',
      hasMedicalConditions: '',
      medicalDetails: '',
      smoker: '',
      occupation: '',
      annualIncome: '',
      beneficiary: '',
    });
    setCurrentStep(1);
    setShowSuccess(false);
  };

  const lobOptions = [
    { label: 'Term Life', value: 'term' },
    { label: 'Whole Life', value: 'whole' },
    { label: 'Universal Life', value: 'universal' },
  ];

  const coverageOptions = [
    { label: '$250,000', value: '250000' },
    { label: '$500,000', value: '500000' },
    { label: '$750,000', value: '750000' },
    { label: '$1,000,000', value: '1000000' },
    { label: '$2,000,000', value: '2000000' },
  ];

  return (
    <div style={{ padding: '24px', width: '100%', backgroundColor: '#f5f5f5' }}>
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        <DxcHeading level={1} text="New Underwriting Submission" />

        {showSuccess ? (
          <div style={{
            backgroundColor: "var(--color-bg-neutral-lightest)",
            borderRadius: "var(--border-radius-m)",
            boxShadow: "var(--shadow-mid-02)",
            padding: "var(--spacing-padding-l)"
          }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-l)" alignItems="center">
              <DxcAlert
                type="success"
                mode="inline"
                children={
                  <DxcInset space="var(--spacing-padding-s)">
                    <DxcTypography fontSize="font-scale-03">
                      Submission successfully created! Reference number: UW-2026-{Math.floor(Math.random() * 1000)}
                    </DxcTypography>
                  </DxcInset>
                }
              />

              <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                <DxcHeading level={3} text="What happens next?" />
                <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ marginTop: 'var(--spacing-gap-m)' }}>
                  <div style={{
                    padding: 'var(--spacing-padding-m)',
                    backgroundColor: 'var(--color-bg-neutral-lighter)',
                    borderRadius: 'var(--border-radius-m)',
                    textAlign: 'left'
                  }}>
                    <DxcFlex gap="var(--spacing-gap-s)">
                      <span className="material-icons" style={{ color: '#0095FF' }}>assignment</span>
                      <div>
                        <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                          Assigned to Underwriter
                        </DxcTypography>
                        <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                          Your submission will be assigned to an underwriter within 24 hours.
                        </DxcTypography>
                      </div>
                    </DxcFlex>
                  </div>

                  <div style={{
                    padding: 'var(--spacing-padding-m)',
                    backgroundColor: 'var(--color-bg-neutral-lighter)',
                    borderRadius: 'var(--border-radius-m)',
                    textAlign: 'left'
                  }}>
                    <DxcFlex gap="var(--spacing-gap-s)">
                      <span className="material-icons" style={{ color: '#0095FF' }}>description</span>
                      <div>
                        <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                          Document Review
                        </DxcTypography>
                        <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                          The underwriter will review all submitted documents and may request additional information.
                        </DxcTypography>
                      </div>
                    </DxcFlex>
                  </div>

                  <div style={{
                    padding: 'var(--spacing-padding-m)',
                    backgroundColor: 'var(--color-bg-neutral-lighter)',
                    borderRadius: 'var(--border-radius-m)',
                    textAlign: 'left'
                  }}>
                    <DxcFlex gap="var(--spacing-gap-s)">
                      <span className="material-icons" style={{ color: '#0095FF' }}>check_circle</span>
                      <div>
                        <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                          Decision
                        </DxcTypography>
                        <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                          You will receive a decision within 5-7 business days.
                        </DxcTypography>
                      </div>
                    </DxcFlex>
                  </div>
                </DxcFlex>
              </div>

              <DxcButton
                label="Create Another Submission"
                onClick={handleCancel}
              />
            </DxcFlex>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div style={{
              backgroundColor: "var(--color-bg-neutral-lightest)",
              borderRadius: "var(--border-radius-m)",
              boxShadow: "var(--shadow-mid-02)",
              padding: "var(--spacing-padding-m)"
            }}>
              <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                <DxcFlex justifyContent="space-between" alignItems="center">
                  <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                    Step {currentStep} of {totalSteps}
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-03" color="#0095FF">
                    {Math.round(progress)}% Complete
                  </DxcTypography>
                </DxcFlex>
                <DxcProgressBar
                  value={progress}
                  showValue={false}
                />
              </DxcFlex>
            </div>

            {/* Form Content */}
            <div style={{
              backgroundColor: "var(--color-bg-neutral-lightest)",
              borderRadius: "var(--border-radius-m)",
              boxShadow: "var(--shadow-mid-02)",
              padding: "var(--spacing-padding-l)"
            }}>
              <DxcFlex direction="column" gap="var(--spacing-gap-l)">
                {currentStep === 1 && (
                  <div>
                    <DxcHeading level={3} text="Applicant Information" />
                    <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ marginTop: 'var(--spacing-gap-m)' }}>
                      <DxcFlex gap="var(--spacing-gap-m)">
                        <DxcTextInput
                          label="First Name"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={({ value }) => handleInputChange('firstName', value)}
                        />
                        <DxcTextInput
                          label="Last Name"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={({ value }) => handleInputChange('lastName', value)}
                        />
                      </DxcFlex>
                      <DxcFlex gap="var(--spacing-gap-m)">
                        <DxcDateInput
                          label="Date of Birth"
                          placeholder="MM/DD/YYYY"
                          value={formData.dateOfBirth}
                          onChange={({ value }) => handleInputChange('dateOfBirth', value)}
                        />
                        <DxcTextInput
                          label="Social Security Number"
                          placeholder="XXX-XX-XXXX"
                          value={formData.ssn}
                          onChange={({ value }) => handleInputChange('ssn', value)}
                        />
                      </DxcFlex>
                      <DxcFlex gap="var(--spacing-gap-m)">
                        <DxcTextInput
                          label="Email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={({ value }) => handleInputChange('email', value)}
                        />
                        <DxcTextInput
                          label="Phone Number"
                          placeholder="(XXX) XXX-XXXX"
                          value={formData.phone}
                          onChange={({ value }) => handleInputChange('phone', value)}
                        />
                      </DxcFlex>
                    </DxcFlex>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <DxcHeading level={3} text="Coverage Information" />
                    <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ marginTop: 'var(--spacing-gap-m)' }}>
                      <DxcSelect
                        label="Line of Business"
                        placeholder="Select product type"
                        options={lobOptions}
                        value={formData.lineOfBusiness}
                        onChange={({ value }) => handleInputChange('lineOfBusiness', value)}
                      />
                      <DxcSelect
                        label="Coverage Amount"
                        placeholder="Select coverage amount"
                        options={coverageOptions}
                        value={formData.coverageAmount}
                        onChange={({ value }) => handleInputChange('coverageAmount', value)}
                      />
                      <DxcDateInput
                        label="Desired Effective Date"
                        placeholder="MM/DD/YYYY"
                        value={formData.effectiveDate}
                        onChange={({ value }) => handleInputChange('effectiveDate', value)}
                      />
                    </DxcFlex>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <DxcHeading level={3} text="Medical Information" />
                    <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ marginTop: 'var(--spacing-gap-m)' }}>
                      <DxcRadioGroup
                        label="Do you have any pre-existing medical conditions?"
                        options={[
                          { label: 'Yes', value: 'yes' },
                          { label: 'No', value: 'no' }
                        ]}
                        value={formData.hasMedicalConditions}
                        onChange={({ value }) => handleInputChange('hasMedicalConditions', value)}
                      />
                      {formData.hasMedicalConditions === 'yes' && (
                        <DxcTextarea
                          label="Please describe your medical conditions"
                          placeholder="Enter details about your medical history"
                          value={formData.medicalDetails}
                          onChange={({ value }) => handleInputChange('medicalDetails', value)}
                          rows={4}
                        />
                      )}
                      <DxcRadioGroup
                        label="Tobacco Use"
                        options={[
                          { label: 'Current Smoker', value: 'current' },
                          { label: 'Former Smoker', value: 'former' },
                          { label: 'Never Smoked', value: 'never' }
                        ]}
                        value={formData.smoker}
                        onChange={({ value }) => handleInputChange('smoker', value)}
                      />
                    </DxcFlex>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <DxcHeading level={3} text="Additional Information" />
                    <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ marginTop: 'var(--spacing-gap-m)' }}>
                      <DxcTextInput
                        label="Occupation"
                        placeholder="Enter your occupation"
                        value={formData.occupation}
                        onChange={({ value }) => handleInputChange('occupation', value)}
                      />
                      <DxcTextInput
                        label="Annual Income"
                        placeholder="Enter annual income"
                        value={formData.annualIncome}
                        onChange={({ value }) => handleInputChange('annualIncome', value)}
                      />
                      <DxcTextInput
                        label="Primary Beneficiary"
                        placeholder="Enter beneficiary name"
                        value={formData.beneficiary}
                        onChange={({ value }) => handleInputChange('beneficiary', value)}
                      />
                    </DxcFlex>
                  </div>
                )}

                {/* Navigation Buttons */}
                <DxcFlex justifyContent="space-between" style={{ marginTop: 'var(--spacing-gap-m)' }}>
                  <DxcFlex gap="var(--spacing-gap-m)">
                    {currentStep > 1 && (
                      <DxcButton
                        label="Back"
                        mode="secondary"
                        onClick={handleBack}
                      />
                    )}
                    <DxcButton
                      label="Cancel"
                      mode="tertiary"
                      onClick={handleCancel}
                    />
                  </DxcFlex>
                  {currentStep < totalSteps ? (
                    <DxcButton
                      label="Next"
                      icon="arrow_forward"
                      iconPosition="after"
                      onClick={handleNext}
                    />
                  ) : (
                    <DxcButton
                      label="Submit"
                      icon="check"
                      onClick={handleSubmit}
                    />
                  )}
                </DxcFlex>
              </DxcFlex>
            </div>
          </>
        )}
      </DxcFlex>
    </div>
  );
};

export default SubmissionIntake;
