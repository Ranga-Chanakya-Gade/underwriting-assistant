import { useState, useEffect } from 'react';
import { DxcApplicationLayout, DxcFlex, DxcTypography } from '@dxc-technology/halstack-react';
import Dashboard from './components/Dashboard/Dashboard';
import UnderwritingWorkbench from './components/UnderwritingWorkbench/UnderwritingWorkbench';
import SubmissionIntake from './components/SubmissionIntake/SubmissionIntake';
import Login from './components/Login/Login';
import { isConnected, clearToken, fetchCurrentUser, connect, handleOAuthCallback } from './services/servicenow';
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

  // ── Actions dropdown ─────────────────────────────────────────────
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // ── OAuth authorization_code callback handler ─────────────────────
  // Runs once on mount — picks up ?code=&state= from ServiceNow redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code  = params.get('code');
    const state = params.get('state');
    if (!code || !state) return;

    // Clean the code/state from the URL immediately
    window.history.replaceState({}, '', window.location.pathname);

    handleOAuthCallback(code, state)
      .then(async () => {
        const username = import.meta.env.VITE_SN_USERNAME || 'integration_user';
        let snUser = null;
        try { snUser = await fetchCurrentUser(username); } catch { /* non-fatal */ }
        const userData = {
          userId: username,
          name:   snUser?.name       || username,
          email:  snUser?.email      || '',
          role:   snUser?.title      || 'Underwriter',
          domain: snUser?.department || 'Commercial Lines',
        };
        // If already in demo mode update SN connection; otherwise do a full login
        if (isAuthenticated) {
          handleSnConnect(userData);
        } else {
          handleLogin({ ...userData, isDemo: false });
        }
      })
      .catch(err => console.error('[OAuth callback] Failed:', err.message));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Clicking "Connect to ServiceNow" → redirect to ServiceNow OAuth login page
  const handleSnConnect_auto = () => {
    setShowActionsMenu(false);
    connect(); // uses VITE_SN_CLIENT_ID + VITE_SN_REDIRECT_URI from env
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
    <>
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
            {/* Actions dropdown — visible only in demo mode */}
            {!snConnected && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowActionsMenu(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#1B75BB',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Actions
                  <span className="material-icons" style={{ fontSize: '18px' }}>
                    {showActionsMenu ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {showActionsMenu && (
                  <div
                    style={{
                      position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      minWidth: '220px',
                      zIndex: 500,
                      padding: '8px 0',
                    }}
                  >
                    <button
                      onClick={handleSnConnect_auto}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', padding: '10px 16px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '14px', color: '#1B75BB', fontWeight: '500',
                        textAlign: 'left',
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '18px' }}>link</span>
                      Connect to ServiceNow
                    </button>
                  </div>
                )}
              </div>
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

    </>
  );
}

export default App;
