import { useState } from 'react';
import {
  DxcHeading,
  DxcFlex,
  DxcTypography,
  DxcButton,
  DxcTextInput,
  DxcCheckbox,
} from '@dxc-technology/halstack-react';
import './Login.css';

const DEMO_USER = {
  userId: 'demo',
  name: 'Demo User',
  email: 'demo@bloom.com',
  role: 'Underwriter',
  domain: 'Commercial Lines',
  isDemo: true,
};

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sign in as demo — no ServiceNow auth required
    onLogin({
      ...DEMO_USER,
      userId: formData.userId || 'demo',
      name: formData.userId || 'Demo User',
    });
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here');
  };

  const handleCreateAccount = () => {
    alert('Account creation would be handled by ServiceNow admin');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <DxcFlex direction="column" gap="var(--spacing-gap-l)" alignItems="center">
          {/* Logo */}
          <div className="login-logo">
            <img
              src="/bloom-logo.jpg"
              alt="Bloom Insurance"
              style={{ height: '50px', width: 'auto' }}
            />
          </div>

          {/* Title */}
          <DxcHeading level={2} text="Sign in" />

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcTextInput
                label="User ID"
                placeholder="Enter your User ID"
                value={formData.userId}
                onChange={({ value }) => handleInputChange('userId', value)}
                size="fillParent"
              />

              <DxcTextInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={({ value }) => handleInputChange('password', value)}
                size="fillParent"
              />

              {/* Remember Me */}
              <DxcFlex justifyContent="flex-start" alignItems="center">
                <DxcCheckbox
                  label="Remember Me"
                  checked={formData.rememberMe}
                  onChange={(checked) => handleInputChange('rememberMe', checked)}
                />
              </DxcFlex>

              {/* Sign In Button */}
              <DxcButton
                label="Sign In"
                mode="primary"
                type="submit"
                size="fillParent"
              />

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-neutral-medium)' }} />
                <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-medium)">or</DxcTypography>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-neutral-medium)' }} />
              </div>

              {/* Continue with Demo */}
              <DxcButton
                label="Continue with Demo"
                mode="secondary"
                onClick={() => onLogin(DEMO_USER)}
                size="fillParent"
              />
            </DxcFlex>
          </form>
        </DxcFlex>
      </div>
    </div>
  );
};

export default Login;
