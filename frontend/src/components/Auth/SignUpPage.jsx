import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PSALogo from '../PSALogo';
import './AuthPages.css';
import { signUp } from '../../services/supabaseClient';  

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email) {
      setError('Please enter your email');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      // Call backend function from supabaseClient.js
      const { data, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      );

      if (signUpError) {
        setError(signUpError);
        return;
      }

      // Success -> Redirect to profile setup
      console.log('Sign up successful:', data);
      navigate('/profile/setup');

    } catch (err) {
      console.error('Sign up error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up - note: ini di supabase blm enable google sign in jd confirm blm bs
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile/setup`
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error('Google sign up error:', err);
      setError('Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--psa-primary) 0%, var(--psa-accent) 50%, var(--psa-highlight) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '1200px',
        width: '100%',
        gap: '4rem',
        alignItems: 'center'
      }}>
        {/* Left Side - Logo & Branding */}
        <div>
          <PSALogo />
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginTop: '2rem',
            marginBottom: '1rem',
            color: 'var(--psa-white)'
          }}>
            PSA Pathways
          </h2>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            lineHeight: 1.6,
            color: 'var(--psa-white)'
          }}>
            Chart your course to success. Navigate your career journey with AI-powered guidance.
          </p>
        </div>

        {/* Right Side - Sign Up Form */}
        <div style={{
          background: 'var(--psa-primary)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--psa-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            color: 'var(--psa-white)'
          }}>
            Create an Account
          </h1>
          <p style={{
            marginBottom: '2rem',
            opacity: 0.8,
            color: 'var(--psa-white)'
          }}>
            Start your journey with PSA
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid var(--psa-error)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--psa-error)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your first name"
                disabled={loading}
                required
              />
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your last name"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@psa.com"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a password"
                  style={{ paddingRight: '3rem' }}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--psa-secondary)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  style={{ paddingRight: '3rem' }}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--psa-secondary)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Already have account link */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ color: 'var(--psa-gray)', fontSize: '0.9rem' }}>
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => navigate('/signin')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--psa-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
              >
                Sign In
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--psa-gray)' }} />
              <span style={{ color: 'var(--psa-gray)', fontSize: '0.9rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--psa-gray)' }} />
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="btn btn-outline"
              style={{ width: '100%' }}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Sign Up with Google
            </button>
          </form>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;