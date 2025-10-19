// Reusable component for selecting interests -> Used in profile setup and mentor matching

import React from 'react';
import { Check } from 'lucide-react';

/**
 * InterestSelector Component
 * @param {Array} interests - Available interests to choose from
 * @param {Array} selectedInterests - Currently selected interests
 * @param {Function} onToggle - Callback when interest is toggled
 * @param {number} maxSelections - Maximum number of selections allowed (optional)
 */
const InterestSelector = ({ 
  interests, 
  selectedInterests = [], 
  onToggle,
  maxSelections = null 
}) => {
  
  const handleToggle = (interest) => {
    // Check if max selections reached
    if (maxSelections && 
        !selectedInterests.includes(interest) && 
        selectedInterests.length >= maxSelections) {
      return; // Don't allow more selections
    }
    
    onToggle(interest);
  };

  return (
    <div>
      {maxSelections && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: 'var(--psa-accent)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Select up to {maxSelections} interests</span>
          <span style={{
            fontWeight: '600',
            color: selectedInterests.length >= maxSelections 
              ? 'var(--psa-error)' 
              : 'var(--psa-secondary)'
          }}>
            {selectedInterests.length} / {maxSelections}
          </span>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {interests.map(interest => {
          const isSelected = selectedInterests.includes(interest);
          const isDisabled = maxSelections && 
                            !isSelected && 
                            selectedInterests.length >= maxSelections;

          return (
            <button
              key={interest}
              onClick={() => handleToggle(interest)}
              disabled={isDisabled}
              style={{
                padding: '1rem',
                background: isSelected 
                  ? 'var(--psa-secondary)' 
                  : 'var(--psa-accent)',
                color: isSelected 
                  ? 'var(--psa-dark)' 
                  : 'var(--psa-white)',
                border: `2px solid ${isSelected ? 'var(--psa-secondary)' : 'transparent'}`,
                borderRadius: 'var(--radius-md)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all var(--transition-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                opacity: isDisabled ? 0.5 : 1
              }}
            >
              <span>{interest}</span>
              {isSelected && (
                <Check 
                  size={18} 
                  style={{
                    flexShrink: 0,
                    marginLeft: '0.5rem'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestSelector;