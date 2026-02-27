import { useState } from 'react';
import { DxcApplicationLayout, DxcFlex, DxcTypography, DxcButton, DxcTextInput } from '@dxc-technology/halstack-react';
import Dashboard from './components/Dashboard/Dashboard';
import UnderwritingWorkbench from './components/UnderwritingWorkbench/UnderwritingWorkbench';
import SubmissionIntake from './components/SubmissionIntake/SubmissionIntake';
import Login from './components/Login/Login';
import { isConnected, clearToken, loginWithPassword, fetchCurrentUser } from './services/servicenow';
import './App.css';

const USER_KEY = 'sn_user_profile';

function restoreUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function App() {
  // If a demo user is cached with no SN token, still restore them
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const u = restoreUser();
    if (!u) return false;
    if (u.isDemo) return true;          // demo user never needs a token
    return isConnected();               // real user needs a valid token
  });
  const [user, setUser] = useState(() => restoreUser());
  const [snConnected, setSnConnected] = useState(() => isConnected());
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [sidenavExpanded, setSidenavExpanded] = useState(true);

  // ── SN Connect dialog ──────────────────────────────────────────
  const [showSnDialog, setShowSnDialog]         = useState(false);
  const [snForm, setSnForm]                     = useState({ userId: '', password: '' });
  const [snConnectError, setSnConnectError]     = useState('');
  const [snConnectLoading, setSnConnectLoading] = useState(false);

  const handleSnLogin = async (e) => {
    e.preventDefault();
    if (!snForm.userId || !snForm.password) {
      setSnConnectError('Please enter both User ID and Password');
      return;
    }
    setSnConnectLoading(true);
    setSnConnectError('');
    try {
      await loginWithPassword(snForm.userId, snForm.password);
      let snUser = null;
      try { snUser = await fetchCurrentUser(snForm.userId); } catch { /* non-fatal */ }
      const snUserData = {
        userId: snForm.userId,
        name:   snUser?.name       || snForm.userId,
        email:  snUser?.email      || '',
        role:   snUser?.title      || 'Underwriter',
        domain: snUser?.department || 'Commercial Lines',
      };
      setShowSnDialog(false);
      setSnForm({ userId: '', password: '' });
      handleSnConnect(snUserData);
    } catch (err) {
      setSnConnectError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSnConnectLoading(false);
    }
  };

  const handleLogin = (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    if (!userData.isDemo) setSnConnected(true);
  };

  // Called from Dashboard when user connects to SN from demo mode
  const handleSnConnect = (snUserData) => {
    const updated = { ...user, ...snUserData, isDemo: false };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
    setSnConnected(true);
  };

  const _handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    clearToken();
    setUser(null);
    setSnConnected(false);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedSubmission(null);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
    setCurrentView('workbench');
  };

  const handleNavigationClick = (view) => {
    setCurrentView(view);
    if (view !== 'workbench') {
      setSelectedSubmission(null);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onSubmissionSelect={handleSubmissionSelect} snConnected={snConnected} />;
      case 'submissions':
        return <Dashboard onSubmissionSelect={handleSubmissionSelect} snConnected={snConnected} />;
      case 'workbench':
        return <UnderwritingWorkbench submission={selectedSubmission} />;
      case 'intake':
        return <SubmissionIntake />;
      default:
        return <Dashboard onSubmissionSelect={handleSubmissionSelect} />;
    }
  };

  const sidenavItems = [
    {
      label: "Dashboard",
      icon: "dashboard",
      selected: currentView === 'dashboard',
      onClick: () => handleNavigationClick('dashboard')
    },
    {
      label: "Submissions",
      icon: "assignment",
      selected: currentView === 'submissions',
      onClick: () => handleNavigationClick('submissions')
    },
    {
      label: "New Submission",
      icon: "note_add",
      selected: currentView === 'intake',
      onClick: () => handleNavigationClick('intake')
    },
    {
      label: "Quotes",
      icon: "request_quote",
      selected: currentView === 'quotes',
      onClick: () => handleNavigationClick('dashboard')
    },
    {
      label: "Renewals",
      icon: "event_repeat",
      selected: currentView === 'renewals',
      onClick: () => handleNavigationClick('dashboard')
    },
  ];

  return (
    <DxcApplicationLayout
      header={(
        <div className="app-header">
          <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
            {/* Bloom Insurance Logo */}
            <img
              src="/bloom-logo.jpg"
              alt="Bloom Insurance"
              style={{ height: '40px', width: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div style={{ width: '1px', height: '28px', backgroundColor: '#e0e0e0' }} />
            <DxcTypography fontSize="font-scale-03" fontWeight="font-weight-semibold" color="#333333">
              Underwriter Assistant
            </DxcTypography>
          </DxcFlex>

          <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
            {/* Connect with ServiceNow — visible only in demo mode */}
            {!snConnected && (
              <button
                onClick={() => { setShowSnDialog(true); setSnConnectError(''); }}
                className="header-icon-btn"
                title="Connect with ServiceNow"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px',
                  border: '1px solid #1B75BB',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#1B75BB',
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>link</span>
                Connect to ServiceNow
              </button>
            )}

            {/* Search Icon */}
            <button
              onClick={() => alert('Search functionality would open here')}
              className="header-icon-btn"
              title="Search"
            >
              <span className="material-icons" style={{ fontSize: '22px', color: '#666666' }}>
                search
              </span>
            </button>

            {/* Assure Answers Chat Icon */}
            <button
              onClick={() => alert('Assure Answers chat would open here')}
              className="header-icon-btn"
              title="Assure Answers - AI Assistant"
            >
              <img
                src="/ai-icon.png"
                alt="Assure Answers"
                style={{ width: '24px', height: '24px', borderRadius: '50%' }}
              />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '28px', backgroundColor: '#e0e0e0' }} />

            <div className="header-user-text">
              <DxcTypography fontWeight="font-weight-semibold" fontSize="font-scale-02">{user.name}</DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-medium)">
                {user.role}
              </DxcTypography>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#1B75BB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          </DxcFlex>
        </div>
      )}
      sidenav={
        <DxcApplicationLayout.Sidenav
          navItems={sidenavItems}
          expanded={sidenavExpanded}
          onExpandedChange={setSidenavExpanded}
        />
      }
      footer={
        <div className="app-footer">
          <DxcFlex justifyContent="space-between" alignItems="center" style={{ width: '100%', padding: '0 24px' }}>
            <DxcTypography fontSize="font-scale-01" color="#808285">
              &copy; 2026 Bloom Insurance. All rights reserved.
            </DxcTypography>
            <DxcFlex gap="var(--spacing-gap-l)" alignItems="center">
              <DxcTypography fontSize="font-scale-01" color="#808285">
                Privacy Policy
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="#808285">
                Terms of Service
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="#808285">
                Contact Support
              </DxcTypography>
            </DxcFlex>
          </DxcFlex>
        </div>
      }
    >
      <DxcApplicationLayout.Main>
        {renderContent()}
      </DxcApplicationLayout.Main>
    </DxcApplicationLayout>

    {/* ── Connect to ServiceNow Dialog ───────────────────────── */}
    {showSnDialog && (
      <div
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowSnDialog(false); }}
      >
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '32px',
          width: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}>
          <DxcFlex direction="column" gap="var(--spacing-gap-m)">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-semibold">
                Connect with ServiceNow
              </DxcTypography>
              <button
                onClick={() => setShowSnDialog(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <span className="material-icons" style={{ color: '#666', fontSize: '22px' }}>close</span>
              </button>
            </DxcFlex>

            {snConnectError && (
              <div style={{ padding: '10px 14px', backgroundColor: '#FFEBEE', borderRadius: '6px', border: '1px solid #EF9A9A' }}>
                <DxcTypography fontSize="font-scale-02" color="#C62828">{snConnectError}</DxcTypography>
              </div>
            )}

            <form onSubmit={handleSnLogin}>
              <DxcFlex direction="column" gap="var(--spacing-gap-m)">
                <DxcTextInput
                  label="User ID"
                  placeholder="Enter your ServiceNow User ID"
                  value={snForm.userId}
                  onChange={({ value }) => setSnForm(f => ({ ...f, userId: value }))}
                  size="fillParent"
                  disabled={snConnectLoading}
                />
                <DxcTextInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={snForm.password}
                  onChange={({ value }) => setSnForm(f => ({ ...f, password: value }))}
                  size="fillParent"
                  disabled={snConnectLoading}
                />
                <DxcButton
                  label={snConnectLoading ? 'Connecting...' : 'Connect'}
                  mode="primary"
                  type="submit"
                  size="fillParent"
                  disabled={snConnectLoading}
                />
              </DxcFlex>
            </form>
          </DxcFlex>
        </div>
      </div>
    )}
  );
}

export default App;
