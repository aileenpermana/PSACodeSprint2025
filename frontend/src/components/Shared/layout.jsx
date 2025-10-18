// Main layout wrapper for authenticated pages

import React from 'react';
import Navigation from './Navigation';
import '../../styles/maritime-theme.css';

/**
 * Layout Component
 * Wraps all authenticated pages with consistent navigation and structure
 * 
 * @param {React.ReactNode} children - Page content to render
 * @param {boolean} showNavigation - Whether to show navigation (default: true)
 * @param {boolean} fullWidth - Use full width layout (default: false)
 */
const layout = ({ children, showNavigation = true, fullWidth = false }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--psa-dark)',
      color: 'var(--psa-white)'
    }}>
      {/* Navigation Bar - shown on all authenticated pages */}
      {showNavigation && <Navigation />}
      
      {/* Main Content Area */}
      <main style={{
        // Add top padding to account for fixed navigation
        paddingTop: showNavigation ? '80px' : '0',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Content Container - responsive width */}
        <div className={fullWidth ? 'container-fluid' : 'container'}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default layout;