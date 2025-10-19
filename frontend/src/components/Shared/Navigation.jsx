// Top navigation bar

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Ship, 
  Map, 
  Users, 
  MessageSquare, 
  Award, 
  Heart, 
  TrendingUp,
  Menu,
  X,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { getCurrentUser, signOut } from '../../services/supabaseClient';
import PSALogo from '../PSALogo';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Load current user on component mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  // Navigation menu items with maritime icons
  const navItems = [
    {
      label: 'Home Port',
      path: '/dashboard',
      icon: Ship,
      description: 'Your dashboard'
    },
    {
      label: 'Explore',
      path: '/explore',
      icon: Map,
      description: 'Career pathways & opportunities'
    },
    {
      label: 'Mentors',
      path: '/mentors',
      icon: Users,
      description: 'Find your guide'
    },
    {
      label: 'AI Navigator',
      path: '/ai-chat',
      icon: MessageSquare,
      description: 'Get AI assistance'
    },
    {
      label: 'Achievements',
      path: '/achievements',
      icon: Award,
      description: 'Your badges & progress'
    },
    {
      label: 'Wellbeing',
      path: '/wellbeing',
      icon: Heart,
      description: 'Track your tide'
    },
    {
      label: 'Leadership',
      path: '/leadership',
      icon: TrendingUp,
      description: 'Potential insights'
    }
  ];

  // Check if current path is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'linear-gradient(135deg, var(--psa-primary) 0%, var(--psa-accent) 100%)',
      borderBottom: '2px solid var(--psa-secondary)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px',
          gap: '2rem'
        }}>
          {/* Logo */}
          <div 
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <PSALogo />
          </div>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: 1,
            justifyContent: 'center'
          }} className="desktop-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  title={item.description}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: active ? 'var(--psa-secondary)' : 'transparent',
                    color: active ? 'var(--psa-dark)' : 'var(--psa-white)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: active ? '600' : '500',
                    transition: 'all var(--transition-base)',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(162, 150, 202, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'var(--psa-accent)',
                color: 'var(--psa-white)',
                border: '2px solid var(--psa-secondary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all var(--transition-base)',
                fontFamily: 'inherit'
              }}
            >
              <User size={20} />
              <span>{user?.email?.split('@')[0] || 'User'}</span>
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                right: 0,
                background: 'var(--psa-primary)',
                border: '2px solid var(--psa-secondary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '200px',
                overflow: 'hidden',
                zIndex: 1001
              }}>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'transparent',
                    color: 'var(--psa-white)',
                    border: 'none',
                    borderBottom: '1px solid rgba(162, 150, 202, 0.2)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(162, 150, 202, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <User size={18} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'transparent',
                    color: 'var(--psa-error)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              background: 'transparent',
              color: 'var(--psa-white)',
              border: 'none',
              cursor: 'pointer'
            }}
            className="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div style={{
            display: 'none',
            padding: '1rem 0',
            borderTop: '1px solid rgba(162, 150, 202, 0.2)'
          }} className="mobile-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: active ? 'rgba(162, 150, 202, 0.2)' : 'transparent',
                    color: active ? 'var(--psa-secondary)' : 'var(--psa-white)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: active ? '600' : '400',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;