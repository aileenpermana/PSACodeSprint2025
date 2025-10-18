import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PSALogo from './PSALogo';
import './AuthPages.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in data:', formData);
    // TODO: Integrate with Firebase Authentication
  };

  return (
    <div className="auth-page">
      <div className="auth-logo-section">
        <PSALogo />
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-card">
            <h1 className="auth-title">Sign In to Continue</h1>
            
            <form className="auth-form space-y-5" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="auth-input"
                  placeholder="your.email@psa.com"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="auth-input password-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="auth-links-container">
                <button type="button" onClick={() => navigate('/reset-password')} className="auth-link">
                  Forgot Password?
                </button>
                <div className="auth-links-row">
                  <span className="auth-text-muted">Don't have an account? </span>
                  <button type="button" onClick={() => navigate('/signup')} className="auth-link">
                    Sign Up
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary mt-6">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
