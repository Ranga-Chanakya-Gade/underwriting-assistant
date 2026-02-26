import { useState } from 'react';
import {
  DxcHeading,
  DxcFlex,
  DxcTypography,
  DxcButton,
  DxcTextInput,
  DxcCheckbox,
  DxcInset,
} from '@dxc-technology/halstack-react';
import { loginWithPassword, fetchCurrentUser } from '../../services/servicenow';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.password) {
      setError('Please enter both User ID and Password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Authenticate against ServiceNow using OAuth password grant
      await loginWithPassword(formData.userId, formData.password);

      // Fetch the user's profile from ServiceNow
      let snUser = null;
      try {
        snUser = await fetchCurrentUser(formData.userId);
      } catch {
        // Non-fatal: fall back to username if profile fetch fails
      }

      const userData = {
        userId: formData.userId,
        name: snUser?.name || formData.userId,
        email: snUser?.email || '',
        role: snUser?.title || 'Underwriter',
        domain: snUser?.department || 'Commercial Lines',
      };

      onLogin(userData);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <DxcTypography fontSize="font-scale-02" color="#D02E2E">
                {error}
              </DxcTypography>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <DxcFlex direction="column" gap="var(--spacing-gap-m)">
              <DxcTextInput
                label="User ID"
                placeholder="Enter your ServiceNow User ID"
                value={formData.userId}
                onChange={({ value }) => handleInputChange('userId', value)}
                size="fillParent"
                disabled={loading}
              />

              <DxcTextInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={({ value }) => handleInputChange('password', value)}
                size="fillParent"
                disabled={loading}
              />

              {/* Remember Me and Forgot Password */}
              <DxcFlex justifyContent="space-between" alignItems="center">
                <DxcCheckbox
                  label="Remember Me"
                  checked={formData.rememberMe}
                  onChange={(checked) => handleInputChange('rememberMe', checked)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="forgot-password-link"
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </DxcFlex>

              {/* Sign In Button */}
              <DxcButton
                label={loading ? 'Signing in...' : 'Sign In'}
                mode="primary"
                type="submit"
                size="fillParent"
                disabled={loading}
              />

              {/* Create Account Button */}
              <DxcButton
                label="Create Account"
                mode="secondary"
                onClick={handleCreateAccount}
                size="fillParent"
                disabled={loading}
              />
            </DxcFlex>
          </form>
        </DxcFlex>
      </div>
    </div>
  );
};

export default Login;
