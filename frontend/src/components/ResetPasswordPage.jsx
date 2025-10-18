import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PSALogo from './PSALogo';
import './AuthPages.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password for:', email);
    // TODO: Integrate with Firebase password reset
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-section">
        <PSALogo />
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-card">
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a link to reset your password
            </p>
            
            <form className="auth-form space-y-5" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="your.email@psa.com"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Send Reset Link
              </button>

              <div className="auth-links-container">
                <button type="button" onClick={() => navigate('/signin')} className="auth-link">
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
