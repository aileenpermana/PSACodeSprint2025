import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../services/supabaseClient';
import PSALogo from '../PSALogo';
import '../AuthPages.css';
//import '../../styles/maritime-theme.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
     // Add safety check
    if (!e || !e.target) {
      console.error('Event target is undefined');
      return;
    }
    const { name, value } = e.target;

    console.log('Field changed:', name, '=', value);

    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // Call backend - supabaseClient.js 
      const { data, error: signInError } = await signIn(
        formData.email,
        formData.password
      );

      if (signInError) {
        setError(signInError);
        return;
      }

      // Success -> Redirect to dashboard
      console.log('Sign in successful:', data);
      window.location.href = '/dashboard';

    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
