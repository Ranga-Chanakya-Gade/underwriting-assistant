import { useState, useMemo } from 'react';
import {
  DxcHeading,
  DxcFlex,
  DxcContainer,
  DxcTypography,
  DxcTextInput,
  DxcButton,
  DxcSwitch,
  DxcTabs,
  DxcBadge,
  DxcPaginator,
  DxcInset,
} from '@dxc-technology/halstack-react';
import { mockSubmissions, getStatusColor, getPriorityColor } from '../../data/mockSubmissions';
import './Dashboard.css';

const Dashboard = ({ onSubmissionSelect }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isGridView, setIsGridView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSubmissions = mockSubmissions.length;
    const newToday = mockSubmissions.filter(s => s.submittedDate === '2026-01-22').length;
    const pendingReview = mockSubmissions.filter(s =>
      s.status === 'Pending Review' || s.status === 'In Review'
    ).length;
    const highPriority = mockSubmissions.filter(s => s.priority === 'High').length;
    const approved = mockSubmissions.filter(s => s.status === 'Approved').length;
    const declined = mockSubmissions.filter(s => s.status === 'Declined').length;
    const avgRiskScore = Math.round(
      mockSubmissions.reduce((sum, s) => sum + s.riskScore, 0) / totalSubmissions
    );
    const totalCoverage = mockSubmissions.reduce((sum, s) => sum + s.coverageAmount, 0);

    return {
      totalSubmissions,
      newToday,
      pendingReview,
      highPriority,
      approved,
      declined,
      avgRiskScore,
      totalCoverage: `$${(totalCoverage / 1000000).toFixed(1)}M`
    };
  }, []);

  // Filter submissions based on active tab and search
  const filteredSubmissions = useMemo(() => {
    let filtered = [...mockSubmissions];

    // Filter by tab
    if (activeTabIndex === 1) {
      filtered = filtered.filter(s => s.lineOfBusiness.includes('Term'));
    } else if (activeTabIndex === 2) {
      filtered = filtered.filter(s => s.lineOfBusiness.includes('Whole'));
    } else if (activeTabIndex === 3) {
      filtered = filtered.filter(s => s.lineOfBusiness.includes('Universal'));
    }

    // Filter by search
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(s =>
        s.id?.toLowerCase().includes(search) ||
        s.applicantName?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [activeTabIndex, searchValue]);

  // Paginate submissions
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * 9;
    return filteredSubmissions.slice(startIndex, startIndex + 9);
  }, [filteredSubmissions, currentPage]);

  return (
    <div style={{ padding: '24px', width: '100%', backgroundColor: '#f5f5f5' }}>
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        <DxcHeading level={1} text="Dashboard" />

        {/* Metrics Section */}
        <DxcFlex gap="var(--spacing-gap-m)">
          {/* My Work Card */}
          <div style={{
            backgroundColor: "var(--color-bg-neutral-lightest)",
            borderRadius: "var(--border-radius-m)",
            boxShadow: "var(--shadow-mid-04)",
            flex: 1,
            height: "240px",
            boxSizing: "border-box",
            padding: "var(--spacing-padding-m)"
          }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcHeading level={3} text="My Work" />
              <DxcFlex gap="var(--spacing-gap-none)" alignItems="center">
                <DxcFlex
                  direction="column"
                  gap="var(--spacing-gap-s)"
                  alignItems="center"
                  justifyContent="center"
                  grow={1}
                  basis="0"
                >
                  <DxcTypography
                    fontSize="32px"
                    fontWeight="font-weight-semibold"
                    color="#0095FF"
                    textAlign="center"
                  >
                    {metrics.totalSubmissions}
                  </DxcTypography>
                  <DxcTypography
                    fontSize="font-scale-03"
                    fontWeight="font-weight-semibold"
                    color="var(--color-fg-neutral-stronger)"
                    textAlign="center"
                  >
                    Total Submissions
                  </DxcTypography>
                </DxcFlex>

                <div style={{ padding: "var(--spacing-padding-xs)" }}>
                  <div style={{
                    height: "97px",
                    width: "1px",
                    backgroundColor: "var(--color-bg-neutral-light)"
                  }} />
                </div>

                <DxcFlex
                  direction="column"
                  gap="var(--spacing-gap-s)"
                  alignItems="center"
                  justifyContent="center"
                  grow={1}
                  basis="0"
                >
                  <DxcTypography
                    fontSize="32px"
                    fontWeight="font-weight-semibold"
                    color="var(--color-fg-error-medium)"
                    textAlign="center"
                  >
                    {metrics.newToday}
                  </DxcTypography>
                  <DxcTypography
                    fontSize="font-scale-03"
                    fontWeight="font-weight-semibold"
                    color="var(--color-fg-neutral-stronger)"
                    textAlign="center"
                  >
                    New Today
                  </DxcTypography>
                </DxcFlex>

                <div style={{ padding: "var(--spacing-padding-xs)" }}>
                  <div style={{
                    height: "97px",
                    width: "1px",
                    backgroundColor: "var(--color-bg-neutral-light)"
                  }} />
                </div>

                <DxcFlex
                  direction="column"
                  gap="var(--spacing-gap-s)"
                  alignItems="center"
                  justifyContent="center"
                  grow={1}
                  basis="0"
                >
                  <DxcTypography
                    fontSize="32px"
                    fontWeight="font-weight-semibold"
                    color="var(--color-fg-warning-medium)"
                    textAlign="center"
                  >
                    {metrics.highPriority}
                  </DxcTypography>
                  <DxcTypography
                    fontSize="font-scale-03"
                    fontWeight="font-weight-semibold"
                    color="var(--color-fg-neutral-stronger)"
                    textAlign="center"
                  >
                    High Priority
                  </DxcTypography>
                </DxcFlex>
              </DxcFlex>
            </DxcFlex>
          </div>

          {/* Key Metrics Card */}
          <div style={{
            backgroundColor: "var(--color-bg-neutral-lightest)",
            borderRadius: "var(--border-radius-m)",
            boxShadow: "var(--shadow-mid-04)",
            flex: 2,
            height: "240px",
            boxSizing: "border-box",
            padding: "var(--spacing-padding-m)"
          }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcHeading level={3} text="Key Metrics" />
              <DxcFlex gap="var(--spacing-gap-m)" alignItems="center" justifyContent="space-between">
                {/* Total Coverage */}
                <div style={{ borderTop: "4px solid #0095FF", flex: "1" }}>
                  <div style={{ backgroundColor: "var(--color-bg-neutral-lightest)", height: "120px" }}>
                    <DxcFlex
                      direction="column"
                      gap="var(--spacing-gap-xxs)"
                      alignItems="center"
                      justifyContent="center"
                      fullHeight
                    >
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="var(--color-fg-neutral-stronger)"
                        textAlign="center"
                      >
                        TOTAL COVERAGE
                      </DxcTypography>
                      <DxcTypography
                        fontSize="32px"
                        fontWeight="font-weight-semibold"
                        color="#0095FF"
                        textAlign="center"
                      >
                        {metrics.totalCoverage}
                      </DxcTypography>
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="#0095FF"
                        textAlign="center"
                      >
                        In review
                      </DxcTypography>
                    </DxcFlex>
                  </div>
                </div>

                {/* Pending Review */}
                <div style={{ borderTop: "4px solid #FF6B00", flex: "1" }}>
                  <div style={{ backgroundColor: "var(--color-bg-neutral-lightest)", height: "120px" }}>
                    <DxcFlex
                      direction="column"
                      gap="var(--spacing-gap-xxs)"
                      alignItems="center"
                      justifyContent="center"
                      fullHeight
                    >
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="var(--color-fg-neutral-stronger)"
                        textAlign="center"
                      >
                        PENDING REVIEW
                      </DxcTypography>
                      <DxcTypography
                        fontSize="32px"
                        fontWeight="font-weight-semibold"
                        color="var(--color-fg-warning-medium)"
                        textAlign="center"
                      >
                        {metrics.pendingReview}
                      </DxcTypography>
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="var(--color-fg-warning-medium)"
                        textAlign="center"
                      >
                        Requires action
                      </DxcTypography>
                    </DxcFlex>
                  </div>
                </div>

                {/* Approved */}
                <div style={{ borderTop: "4px solid #24A148", flex: "1" }}>
                  <div style={{ backgroundColor: "var(--color-bg-neutral-lightest)", height: "120px" }}>
                    <DxcFlex
                      direction="column"
                      gap="var(--spacing-gap-xxs)"
                      alignItems="center"
                      justifyContent="center"
                      fullHeight
                    >
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="var(--color-fg-neutral-stronger)"
                        textAlign="center"
                      >
                        APPROVED
                      </DxcTypography>
                      <DxcTypography
                        fontSize="32px"
                        fontWeight="font-weight-semibold"
                        color="var(--color-fg-success-medium)"
                        textAlign="center"
                      >
                        {metrics.approved}
                      </DxcTypography>
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="var(--color-fg-success-medium)"
                        textAlign="center"
                      >
                        This period
                      </DxcTypography>
                    </DxcFlex>
                  </div>
                </div>

                {/* Avg Risk Score */}
                <div style={{ borderTop: "4px solid #0077CC", flex: "1" }}>
                  <div style={{ backgroundColor: "var(--color-bg-neutral-lightest)", height: "120px" }}>
                    <DxcFlex
                      direction="column"
                      gap="var(--spacing-gap-xxs)"
                      alignItems="center"
                      justifyContent="center"
                      fullHeight
                    >
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="var(--color-fg-neutral-stronger)"
                        textAlign="center"
                      >
                        AVG RISK SCORE
                      </DxcTypography>
                      <DxcTypography
                        fontSize="32px"
                        fontWeight="font-weight-semibold"
                        color="#0077CC"
                        textAlign="center"
                      >
                        {metrics.avgRiskScore}
                      </DxcTypography>
                      <DxcTypography
                        fontSize="12px"
                        fontWeight="font-weight-regular"
                        color="#0077CC"
                        textAlign="center"
                      >
                        Target: ≥75
                      </DxcTypography>
                    </DxcFlex>
                  </div>
                </div>
              </DxcFlex>
            </DxcFlex>
          </div>
        </DxcFlex>

        {/* Main Content - My Queue */}
        <div style={{
          backgroundColor: "var(--color-bg-neutral-lightest)",
          borderRadius: "var(--border-radius-m)",
          boxShadow: "var(--shadow-mid-02)",
          padding: "var(--spacing-padding-l)"
        }}>
          <DxcFlex direction="column" gap="var(--spacing-gap-s)">
            <DxcHeading level={3} text="My Queue" />

            {/* Tabs */}
            <DxcTabs iconPosition="left">
              <DxcTabs.Tab
                label="All Submissions"
                icon="assignment"
                active={activeTabIndex === 0}
                onClick={() => setActiveTabIndex(0)}
              >
                <div />
              </DxcTabs.Tab>
              <DxcTabs.Tab
                label="Term Life"
                icon="favorite"
                active={activeTabIndex === 1}
                onClick={() => setActiveTabIndex(1)}
              >
                <div />
              </DxcTabs.Tab>
              <DxcTabs.Tab
                label="Whole Life"
                icon="account_balance"
                active={activeTabIndex === 2}
                onClick={() => setActiveTabIndex(2)}
              >
                <div />
              </DxcTabs.Tab>
              <DxcTabs.Tab
                label="Universal Life"
                icon="trending_up"
                active={activeTabIndex === 3}
                onClick={() => setActiveTabIndex(3)}
              >
                <div />
              </DxcTabs.Tab>
            </DxcTabs>

            {/* Toolbar */}
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcTextInput
                placeholder="Search by Submission ID or Applicant Name..."
                value={searchValue}
                onChange={({ value }) => setSearchValue(value)}
                size="medium"
              />
              <DxcFlex gap="var(--spacing-gap-ml)" alignItems="center">
                <DxcButton
                  label="Columns"
                  mode="tertiary"
                  icon="view_column"
                  onClick={() => {}}
                />
                <DxcFlex gap="var(--spacing-gap-none)" alignItems="center">
                  <DxcTypography
                    fontSize="font-scale-03"
                    color="#0095FF"
                  >
                    Card View
                  </DxcTypography>
                  <DxcSwitch
                    checked={isGridView}
                    onChange={(checked) => setIsGridView(checked)}
                  />
                  <DxcTypography
                    fontSize="font-scale-03"
                    color="#0095FF"
                  >
                    Grid View
                  </DxcTypography>
                </DxcFlex>
              </DxcFlex>
            </DxcFlex>

            {/* Cards List or Grid */}
            <DxcFlex
              direction={isGridView ? "row" : "column"}
              gap="var(--spacing-gap-m)"
              wrap={isGridView ? "wrap" : "nowrap"}
            >
              {paginatedSubmissions.map((submission, index) => (
                <DxcContainer
                  key={index}
                  style={
                    isGridView
                      ? { backgroundColor: "var(--color-bg-neutral-lighter)", flex: "1 1 calc(50% - var(--spacing-gap-m) / 2)", minWidth: "400px", cursor: "pointer", borderRadius: "var(--border-radius-m)", border: "1px solid var(--border-color-neutral-lighter)" }
                      : { backgroundColor: "var(--color-bg-neutral-lighter)", cursor: "pointer", borderRadius: "var(--border-radius-m)", border: "1px solid var(--border-color-neutral-lighter)" }
                  }
                  onClick={() => onSubmissionSelect(submission)}
                >
                  <DxcInset space="var(--spacing-padding-m)">
                    <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
                      <DxcFlex justifyContent="space-between" alignItems="center">
                        <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
                          <DxcTypography
                            fontSize="font-scale-03"
                            fontWeight="font-weight-semibold"
                            color="#0095FF"
                          >
                            {submission.id}
                          </DxcTypography>
                          <DxcTypography fontSize="font-scale-03">
                            {submission.applicantName}
                          </DxcTypography>
                          <DxcBadge
                            label={submission.priority}
                            mode="contextual"
                            color={getPriorityColor(submission.priority)}
                            size="small"
                          />
                        </DxcFlex>
                        <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                          <DxcButton
                            icon="check"
                            mode="tertiary"
                            title="Approve"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <DxcButton
                            icon="cancel"
                            mode="tertiary"
                            title="Decline"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <DxcButton
                            icon="swap_horiz"
                            mode="tertiary"
                            title="Reassign"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </DxcFlex>
                      </DxcFlex>

                      <DxcFlex gap="var(--spacing-gap-m)" alignItems="center" wrap="wrap">
                        <DxcBadge
                          label={submission.status}
                          mode="contextual"
                          color={getStatusColor(submission.status)}
                        />
                        <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                          {submission.lineOfBusiness}
                        </DxcTypography>
                        <div style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-fg-neutral-strong)"
                        }} />
                        <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                          ${(submission.coverageAmount / 1000).toLocaleString()}K
                        </DxcTypography>
                        <div style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-fg-neutral-strong)"
                        }} />
                        <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                          Submitted: {submission.submittedDate}
                        </DxcTypography>
                        <div style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-fg-neutral-strong)"
                        }} />
                        <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                          Requirements: {submission.requirementsComplete}%
                        </DxcTypography>
                      </DxcFlex>
                    </DxcFlex>
                  </DxcInset>
                </DxcContainer>
              ))}
            </DxcFlex>

            {/* Paginator */}
            <DxcPaginator
              currentPage={currentPage}
              itemsPerPage={9}
              totalItems={filteredSubmissions.length}
              showGoToPage={true}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
};

export default Dashboard;
