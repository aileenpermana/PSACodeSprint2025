// frontend/src/components/PSALogo.jsx
import React from 'react';
import logoImage from '../image (3).png';  // Import the image

const PSALogo = () => {
  return (
    <div className="psa-logo-container">
      <img 
        src={logoImage} 
        alt="PSA Logo" 
        style={{
          width: '180px',
          height: '180px',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default PSALogo;