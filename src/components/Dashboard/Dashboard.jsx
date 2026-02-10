import { useState, useMemo } from 'react';
import {
  DxcHeading,
  DxcFlex,
  DxcTypography,
  DxcTabs,
  DxcBadge,
  DxcSelect,
  DxcInset,
} from '@dxc-technology/halstack-react';
import { pcSubmissions, getStatusColor } from '../../data/mockSubmissions';
import './Dashboard.css';

const Dashboard = ({ onSubmissionSelect }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    quotePolicy: true,
    dateSubmitted: true,
    dateReceived: true,
    effectiveDate: true,
    lob: true,
    symbol: true,
    primaryState: true,
    applicant: true,
    transactionStatus: true,
  });
  const itemsPerPage = 9;

  // Use P&C Commercial Auto submissions only
  const submissions = pcSubmissions;

  // Calculate metrics based on mockup
  const metrics = useMemo(() => {
    const totalSubmissions = 12;
    const newSubmissions = 2;
    const quotesRequired = 6;
    const writtenPremiumYTD = 24.8; // in millions
    const pendingReview = 7;
    const approvedThisMonth = 42;
    const declinedThisMonth = 7;
    const approvalRate = 87; // 42/(42+7) * 100

    return {
      totalSubmissions,
      newSubmissions,
      quotesRequired,
      writtenPremiumYTD,
      pendingReview,
      approvedThisMonth,
      declinedThisMonth,
      approvalRate,
    };
  }, []);

  // Filter submissions based on active tab
  const filteredSubmissions = useMemo(() => {
    let filtered = [...submissions];

    // Tab filtering (if needed)
    if (activeTabIndex === 1) {
      // Quotes tab
      filtered = filtered.filter(s => s.status === 'Pending Review');
    } else if (activeTabIndex === 2) {
      // Renewals tab
      filtered = filtered.filter(s => s.status === 'Approved');
    }

    return filtered;
  }, [submissions, activeTabIndex]);

  // Paginate submissions
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubmissions, currentPage]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`
  }));

  return (
    <div style={{ padding: '24px', width: '100%', backgroundColor: '#f5f5f5' }}>
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <DxcTypography
          fontSize="var(--font-scale-05, 1.5rem)"
          fontWeight="font-weight-semibold"
          color="#333333"
          letterSpacing="var(--font-tracking-wide-01, normal)"
        >
          Dashboard
        </DxcTypography>

        {/* Key Metrics Cards */}
        <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
          {/* Total Submissions */}
          <div className="metric-card">
            <div className="metric-icon-container" style={{ backgroundColor: '#E8F4FD' }}>
              <span className="material-icons" style={{ color: '#1B75BB', fontSize: '24px' }}>inbox</span>
            </div>
            <div className="metric-content">
              <DxcTypography fontSize="28px" fontWeight="font-weight-semibold" color="#1B75BB">
                {metrics.totalSubmissions}
              </DxcTypography>
              <DxcTypography fontSize="12px" color="#808285" fontWeight="font-weight-medium">
                Total Submissions
              </DxcTypography>
            </div>
          </div>

          {/* New Submissions */}
          <div className="metric-card">
            <div className="metric-icon-container" style={{ backgroundColor: '#FFF3E0' }}>
              <span className="material-icons" style={{ color: '#F6921E', fontSize: '24px' }}>fiber_new</span>
            </div>
            <div className="metric-content">
              <DxcTypography fontSize="28px" fontWeight="font-weight-semibold" color="#F6921E">
                {metrics.newSubmissions}
              </DxcTypography>
              <DxcTypography fontSize="12px" color="#808285" fontWeight="font-weight-medium">
                New Submissions
              </DxcTypography>
            </div>
          </div>

          {/* Quotes Required */}
          <div className="metric-card">
            <div className="metric-icon-container" style={{ backgroundColor: '#E8F5E9' }}>
              <span className="material-icons" style={{ color: '#37A526', fontSize: '24px' }}>request_quote</span>
            </div>
            <div className="metric-content">
              <DxcTypography fontSize="28px" fontWeight="font-weight-semibold" color="#37A526">
                {metrics.quotesRequired}
              </DxcTypography>
              <DxcTypography fontSize="12px" color="#808285" fontWeight="font-weight-medium">
                Quotes Required
              </DxcTypography>
            </div>
          </div>

          {/* Written Premium YTD */}
          <div className="metric-card-highlight">
            <div className="metric-icon-container" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <span className="material-icons" style={{ color: '#FFFFFF', fontSize: '24px' }}>trending_up</span>
            </div>
            <div className="metric-content">
              <DxcTypography fontSize="28px" fontWeight="font-weight-semibold" color="#FFFFFF">
                ${metrics.writtenPremiumYTD}M
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.9)" fontWeight="font-weight-medium">
                Written Premium YTD
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.75)">
                +18% vs last year
              </DxcTypography>
            </div>
          </div>

          {/* Pending Review */}
          <div className="metric-card-warning">
            <div className="metric-icon-container" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <span className="material-icons" style={{ color: '#FFFFFF', fontSize: '24px' }}>pending_actions</span>
            </div>
            <div className="metric-content">
              <DxcTypography fontSize="28px" fontWeight="font-weight-semibold" color="#FFFFFF">
                {metrics.pendingReview}
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.9)" fontWeight="font-weight-medium">
                Pending Review
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.75)">
                3 closing today
              </DxcTypography>
            </div>
          </div>

          {/* Approved This Month */}
          <div className="metric-card-success">
            <div className="metric-icon-container" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <span className="material-icons" style={{ color: '#FFFFFF', fontSize: '24px' }}>check_circle</span>
            </div>
            <div className="metric-content">
              <DxcTypography fontSize="28px" fontWeight="font-weight-semibold" color="#FFFFFF">
                {metrics.approvedThisMonth}
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.9)" fontWeight="font-weight-medium">
                Approved This Month
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.75)">
                {metrics.approvalRate}% approval rate
              </DxcTypography>
            </div>
          </div>

          {/* Declined This Month */}
          <div className="metric-card-error">
            <div className="metric-icon-container" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <span className="material-icons" style={{ color: '#FFFFFF', fontSize: '24px' }}>cancel</span>
            </div>
            <div className="metric-content">
              <DxcTypography fontSize="28px" fontWeight="font-weight-semibold" color="#FFFFFF">
                {metrics.declinedThisMonth}
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.9)" fontWeight="font-weight-medium">
                Declined This Month
              </DxcTypography>
              <DxcTypography fontSize="11px" color="rgba(255,255,255,0.75)">
                13% decline rate
              </DxcTypography>
            </div>
          </div>
        </DxcFlex>

        {/* Submissions Section - Card Container */}
        <div className="submissions-container">
          <DxcFlex direction="column" gap="var(--spacing-gap-l)">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcTypography
                fontSize="var(--font-scale-04, 1.25rem)"
                fontWeight="font-weight-semibold"
                color="#333333"
              >
                My Priorities
              </DxcTypography>
            </DxcFlex>

            {/* Tabs */}
            <DxcTabs iconPosition="left">
              <DxcTabs.Tab
                label="Submissions/New Business"
                icon="assignment"
                active={activeTabIndex === 0}
                onClick={() => setActiveTabIndex(0)}
              >
                <div />
              </DxcTabs.Tab>
              <DxcTabs.Tab
                label="Quotes"
                icon="request_quote"
                active={activeTabIndex === 1}
                onClick={() => setActiveTabIndex(1)}
              >
                <div />
              </DxcTabs.Tab>
              <DxcTabs.Tab
                label="Renewals"
                icon="event_repeat"
                active={activeTabIndex === 2}
                onClick={() => setActiveTabIndex(2)}
              >
                <div />
              </DxcTabs.Tab>
            </DxcTabs>

            {/* View Toggle and Column Selector */}
            <DxcFlex justifyContent="flex-end" alignItems="center" gap="var(--spacing-gap-m)">
              {/* Column Selector Button (only show in Grid View) */}
              {isGridView && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowColumnSelector(!showColumnSelector)}
                    className="column-selector-btn"
                  >
                    <DxcFlex alignItems="center" gap="var(--spacing-gap-xs)">
                      <span className="material-icons" style={{ fontSize: '18px' }}>view_column</span>
                      <span>Columns</span>
                    </DxcFlex>
                  </button>

                  {showColumnSelector && (
                    <div className="column-selector-popover">
                      <DxcFlex direction="column" gap="var(--spacing-gap-s)">
                        {Object.entries({
                          quotePolicy: 'Quote / Policy #',
                          dateSubmitted: 'Date Submitted',
                          dateReceived: 'Date Received',
                          effectiveDate: 'Effective Date',
                          lob: 'LOB',
                          symbol: 'Symbol',
                          primaryState: 'Primary State',
                          applicant: 'Applicant',
                          transactionStatus: 'Transaction Status',
                        }).map(([key, label]) => (
                          <label key={key} className="column-toggle-item">
                            <input
                              type="checkbox"
                              checked={visibleColumns[key]}
                              onChange={(e) => setVisibleColumns({
                                ...visibleColumns,
                                [key]: e.target.checked
                              })}
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </DxcFlex>
                    </div>
                  )}
                </div>
              )}

              {/* View Toggle Icons */}
              <div className="view-toggle-group">
                <button
                  onClick={() => setIsGridView(false)}
                  className={`view-toggle-icon-btn ${!isGridView ? 'active' : ''}`}
                  title="Card View"
                >
                  <span className="material-icons">view_agenda</span>
                </button>
                <button
                  onClick={() => setIsGridView(true)}
                  className={`view-toggle-icon-btn ${isGridView ? 'active' : ''}`}
                  title="Grid View"
                >
                  <span className="material-icons">view_list</span>
                </button>
              </div>
            </DxcFlex>

            {/* Submission Cards or Grid Table */}
            {!isGridView ? (
              // Card View
              <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                {paginatedSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="submission-card"
                    onClick={() => onSubmissionSelect(submission)}
                  >
                    <DxcFlex justifyContent="space-between" alignItems="center">
                      <DxcFlex direction="column" gap="var(--spacing-gap-xs)" grow={1}>
                        {/* Company Name and Status */}
                        <DxcFlex alignItems="center" gap="var(--spacing-gap-m)">
                          <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold">
                            {submission.applicantName}
                          </DxcTypography>
                          <DxcBadge
                            label={submission.status}
                            mode="contextual"
                            color={getStatusColor(submission.status)}
                            size="small"
                          />
                          {/* Routing & Priority Indicators */}
                          {submission.routing?.fastTrackEligible && (
                            <DxcBadge
                              label="Fast-Track"
                              mode="contextual"
                              color="success"
                              size="small"
                            />
                          )}
                          {submission.referral?.required && (
                            <DxcBadge
                              label="Referral Required"
                              mode="contextual"
                              color="warning"
                              size="small"
                            />
                          )}
                          {submission.daysInQueue > 0 && (
                            <DxcTypography fontSize="11px" color="#666666" style={{ fontStyle: 'italic' }}>
                              {submission.daysInQueue}d in queue
                            </DxcTypography>
                          )}
                        </DxcFlex>

                        {/* Routing Logic Display */}
                        {submission.routing && (
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: submission.routing.fastTrackEligible ? '#E8F5E9' : '#FFF3E0',
                            borderRadius: '4px',
                            borderLeft: submission.routing.fastTrackEligible ? '3px solid #37A526' : '3px solid #FFA500'
                          }}>
                            <DxcTypography fontSize="11px" color="#333333" fontWeight="font-weight-medium">
                              🤖 {submission.routing.decision} - {submission.routing.reason}
                            </DxcTypography>
                          </div>
                        )}

                        {/* Submission Details */}
                        <DxcFlex gap="var(--spacing-gap-l)" wrap="wrap">
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                            {submission.id}
                          </DxcTypography>
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                            LOB: {submission.lineOfBusiness}
                          </DxcTypography>
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                            Uploaded: {submission.submittedDate}
                          </DxcTypography>
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                            Saved: {submission.receivedDate}
                          </DxcTypography>
                          <DxcTypography fontSize="12px" color="var(--color-fg-neutral-dark)">
                            Effective Date: {submission.effectiveDate}
                          </DxcTypography>
                        </DxcFlex>
                      </DxcFlex>

                      {/* Action Icons */}
                      <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                        <button className="icon-btn" title="Share" onClick={(e) => e.stopPropagation()}>
                          <span className="material-icons">share</span>
                        </button>
                        <button className="icon-btn" title="Preview" onClick={(e) => e.stopPropagation()}>
                          <span className="material-icons">visibility</span>
                        </button>
                        <button className="icon-btn" title="Approve" onClick={(e) => e.stopPropagation()}>
                          <span className="material-icons">check</span>
                        </button>
                      </DxcFlex>
                    </DxcFlex>
                  </div>
                ))}
              </DxcFlex>
            ) : (
              // Grid View
              <table className="submissions-grid-table">
                <thead>
                  <tr>
                    {visibleColumns.quotePolicy && <th>Quote / Policy #</th>}
                    {visibleColumns.dateSubmitted && <th>Date Submitted</th>}
                    {visibleColumns.dateReceived && <th>Date Received</th>}
                    {visibleColumns.effectiveDate && <th>Effective Date</th>}
                    {visibleColumns.lob && <th>LOB</th>}
                    {visibleColumns.symbol && <th>Symbol</th>}
                    {visibleColumns.primaryState && <th>Primary State</th>}
                    {visibleColumns.applicant && <th>Applicant</th>}
                    {visibleColumns.transactionStatus && <th>Transaction Status</th>}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubmissions.map((submission) => (
                    <tr key={submission.id} onClick={() => onSubmissionSelect(submission)}>
                      {visibleColumns.quotePolicy && (
                        <td>
                          <a href="#" className="table-link" onClick={(e) => { e.stopPropagation(); onSubmissionSelect(submission); }}>
                            {submission.id}
                          </a>
                        </td>
                      )}
                      {visibleColumns.dateSubmitted && <td>{submission.submittedDate}</td>}
                      {visibleColumns.dateReceived && <td>{submission.receivedDate}</td>}
                      {visibleColumns.effectiveDate && <td>{submission.effectiveDate}</td>}
                      {visibleColumns.lob && <td>{submission.lineOfBusiness}</td>}
                      {visibleColumns.symbol && <td>{submission.lineOfBusiness}</td>}
                      {visibleColumns.primaryState && <td>SC</td>}
                      {visibleColumns.applicant && <td>{submission.applicantName}</td>}
                      {visibleColumns.transactionStatus && (
                        <td>
                          <DxcBadge
                            label={submission.status}
                            mode="contextual"
                            color={getStatusColor(submission.status)}
                            size="small"
                          />
                        </td>
                      )}
                      <td>
                        <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                          <button className="icon-btn-small" title="Approve" onClick={(e) => e.stopPropagation()}>
                            <span className="material-icons">check</span>
                          </button>
                          <button className="icon-btn-small" title="Decline" onClick={(e) => e.stopPropagation()}>
                            <span className="material-icons">cancel</span>
                          </button>
                          <button className="icon-btn-small" title="Share" onClick={(e) => e.stopPropagation()}>
                            <span className="material-icons">share</span>
                          </button>
                        </DxcFlex>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcTypography fontSize="14px">
                {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length}
              </DxcTypography>
              <DxcFlex alignItems="center" gap="var(--spacing-gap-m)">
                <DxcTypography fontSize="14px">Go to page:</DxcTypography>
                <DxcSelect
                  options={pageOptions}
                  value={`${currentPage}`}
                  onChange={(value) => setCurrentPage(parseInt(value))}
                  margin="none"
                  size="small"
                />
              </DxcFlex>
            </DxcFlex>
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
};

export default Dashboard;
