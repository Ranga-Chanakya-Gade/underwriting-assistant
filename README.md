# Underwriting Assistant

A modern underwriting workbench portal built with React, Vite, and DXC Technology's Halstack design system.

## Features

- **Dashboard** - Overview metrics and submission queue with card/grid view toggle
- **Underwriting Workbench** - Detailed submission review with 7 comprehensive tabs
- **Document Management** - Upload, view, and manage submission documents with IDP integration
- **IDP (Intelligent Document Processing)** - Automated data extraction from applications, medical records, and financial statements
- **Risk Assessment** - AI-powered risk scoring with contributing factors analysis
- **Task & SLA Management** - Workflow tracking with SLA monitoring and breach warnings
- **Submission Intake** - Multi-step form for creating new underwriting submissions
- **Blue Theme** - Professional blue color scheme (#0095FF primary, #0077CC hover)
- **Halstack Components** - Enterprise-grade UI components following DXC design standards

## Tech Stack

- **React 18.3.1** - UI framework
- **Vite 7.2.4** - Build tool and dev server
- **Halstack React 16.0.0** - DXC Technology component library
- **Emotion** - CSS-in-JS styling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  components/
    Dashboard/                 # Main dashboard view
    UnderwritingWorkbench/     # Detailed submission review
    SubmissionIntake/          # Multi-step intake form
    shared/                    # Reusable components
      DocumentCard.jsx         # Document display card
      DocumentUpload.jsx       # File upload interface
      IDPResults.jsx           # IDP extraction viewer
      RiskScoreCard.jsx        # Risk score visualization
      ContributingFactors.jsx  # Risk drivers analysis
      TaskList.jsx             # Task management with SLA
      SLATimer.jsx             # SLA tracking component
  data/
    mockSubmissions.js         # Sample underwriting data
    mockDocuments.js           # Sample documents & IDP results
    mockRiskData.js            # Risk assessment data
    mockTasks.js               # Tasks and SLA data
  App.jsx                      # Main layout and routing
  main.jsx                     # Entry point
  index.css                    # Global styles
```

## Design Principles

- **Halstack Design Tokens** - All spacing, colors, and styling use Halstack variables
- **Open Sans Font** - Consistent with Halstack typography guidelines
- **Blue Color Scheme** - #0095FF primary, #0077CC hover, NO PURPLE
- **Tight Spacing** - Professional, compact layouts
- **Minimal Custom CSS** - Rely on Halstack components and tokens

## Key Metrics

The dashboard displays:
- Total Submissions
- New Today
- High Priority items
- Total Coverage amount
- Pending Review count
- Approved submissions
- Average Risk Score

## Components

### Dashboard
- Metrics cards with KPIs
- Tabbed view for filtering (All, Term Life, Whole Life, Universal Life)
- Search functionality
- Card/Grid view toggle
- Pagination

### Underwriting Workbench
- Summary cards (Status, Priority, Coverage, Risk Score, Assigned To)
- 7 comprehensive tabs: Overview, Requirements, Timeline, Notes, Documents, Risk Assessment, Tasks & SLA
- Requirement tracking with progress bar
- Activity timeline
- Notes section with history
- Document management with IDP extraction results
  - Upload documents with automatic classification
  - View extracted fields with confidence scores
  - Validation tracking (extracted, validated, flagged fields)
  - Support for Application Forms, Medical Records, Financial Statements
- Risk Assessment with AI-powered scoring
  - Overall risk score (0-100) with color-coded risk levels
  - 5 category breakdowns: Underwriting, Financial, Medical, Moral Hazard, Exposure
  - Contributing factors with positive/negative impact analysis
  - Third-party data integration (credit, MVR, prescriptions, sanctions)
  - Exposure analysis and portfolio concentration
  - Model metadata and confidence tracking
  - Automated decision recommendations
- Tasks & SLA Management
  - Complete task list with status, priority, and assignments
  - SLA tracking for Time to Decision, Time to Quote, Requirements
  - Color-coded SLA status (On Time, At Risk, Breached)
  - Task completion progress tracking
  - Routing and workflow information

### Submission Intake
- 4-step form wizard with progress bar
- Applicant Information
- Coverage Information
- Medical Information
- Additional Information
- Success confirmation with next steps

## License

© 2026 Insurance Company. All rights reserved.
