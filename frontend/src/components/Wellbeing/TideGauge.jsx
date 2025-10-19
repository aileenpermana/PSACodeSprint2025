import React from 'react';
import { Waves } from 'lucide-react';

/**
 * Tide Gauge Component
 * Visual representation of wellbeing level using maritime tide metaphor
 * 
 * @param {number} currentLevel - Current tide level (1-5)
 */
const TideGauge = ({ currentLevel = 3 }) => {
  const tideLabels = [
    { level: 5, label: 'High Tide', emoji: '🌊', color: '#4ade80', desc: 'Excellent wellbeing' },
    { level: 4, label: 'Rising Tide', emoji: '🌅', color: '#60a5fa', desc: 'Good wellbeing' },
    { level: 3, label: 'Mid Tide', emoji: '⚓', color: '#fbbf24', desc: 'Moderate wellbeing' },
    { level: 2, label: 'Low Tide', emoji: '🏖️', color: '#fb923c', desc: 'Struggling' },
    { level: 1, label: 'Ebb Tide', emoji: '⚠️', color: '#f87171', desc: 'Need support' }
  ];

  const getCurrentTide = () => {
    return tideLabels.find(t => t.level === currentLevel) || tideLabels[2];
  };

  const current = getCurrentTide();

  return (
    <div style={{
      padding: '2rem',
      borderRadius: '12px',
      background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)'
    }}>
      {/* Current Level Display */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '0.5rem'
        }}>
          {current.emoji}
        </div>
        <div style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: current.color,
          marginBottom: '0.5rem'
        }}>
          {current.label}
        </div>
        <p style={{
          fontSize: '1rem',
          color: 'var(--psa-gray)',
          margin: 0
        }}>
          {current.desc}
        </p>
      </div>

      {/* Tide Gauge Visual */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto 2rem'
      }}>
        {/* Gauge Container */}
        <div style={{
          height: '300px',
          background: 'linear-gradient(180deg, #0ea5e9 0%, #06b6d4 50%, #0891b2 100%)',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid rgba(14, 165, 233, 0.3)'
        }}>
          {/* Water Level */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${(currentLevel / 5) * 100}%`,
            background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.6) 0%, rgba(14, 165, 233, 0.8) 100%)',
            transition: 'height 1s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Waves Animation */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: 0,
              right: 0,
              height: '40px',
              background: 'rgba(255, 255, 255, 0.3)',
              animation: 'wave 3s ease-in-out infinite'
            }} />
            <Waves
              size={48}
              color="rgba(255, 255, 255, 0.5)"
              style={{
                animation: 'float 2s ease-in-out infinite',
                zIndex: 1
              }}
            />
          </div>

          {/* Level Markers */}
          {[5, 4, 3, 2, 1].map((level) => (
            <div
              key={level}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${((level - 0.5) / 5) * 100}%`,
                height: '2px',
                background: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{
                position: 'absolute',
                right: '1rem',
                fontSize: '0.85rem',
                color: '#fff',
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Level {level}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tide Level Legend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        {tideLabels.map((tide) => (
          <div
            key={tide.level}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              background: currentLevel === tide.level
                ? `${tide.color}20`
                : 'var(--psa-accent)',
              border: `2px solid ${currentLevel === tide.level ? tide.color : 'transparent'}`,
              transition: 'all 0.3s ease',
              opacity: currentLevel === tide.level ? 1 : 0.6
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>{tide.emoji}</span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: tide.color
              }}>
                {tide.label}
              </span>
            </div>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--psa-gray)',
              margin: 0
            }}>
              {tide.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: translateX(-25%) translateY(0);
          }
          50% {
            transform: translateX(0) translateY(-10px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default TideGauge;