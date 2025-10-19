import React, { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, Award, Target, Lock, CheckCircle } from 'lucide-react';

const CareerLift = ({ currentRole, department, skills = [] }) => {
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Career levels (floors)
  const careerLevels = [
    {
      floor: 7,
      level: 'Executive',
      icon: '👑',
      title: 'Chief / Executive Director',
      yearsExperience: '15+',
      keySkills: ['Strategic Vision', 'Board Management', 'Corporate Governance'],
      salary: '$250K - $400K+',
      color: '#ffd700',
      unlocked: false
    },
    {
      floor: 6,
      level: 'Director',
      icon: '🎯',
      title: 'Senior Director / Director',
      yearsExperience: '12-15',
      keySkills: ['Business Strategy', 'P&L Management', 'Executive Leadership'],
      salary: '$180K - $250K',
      color: '#A296ca',
      unlocked: false
    },
    {
      floor: 5,
      level: 'Manager',
      icon: '📊',
      title: 'Senior Manager / Manager',
      yearsExperience: '8-12',
      keySkills: ['Team Leadership', 'Budget Management', 'Strategic Planning'],
      salary: '$120K - $180K',
      color: '#8b7fb8',
      unlocked: false
    },
    {
      floor: 4,
      level: 'Assistant Manager',
      icon: '🎖️',
      title: 'Assistant Manager / Team Lead',
      yearsExperience: '5-8',
      keySkills: ['Project Management', 'Team Coordination', 'Stakeholder Management'],
      salary: '$80K - $120K',
      color: '#7a6fa0',
      unlocked: true
    },
    {
      floor: 3,
      level: 'Senior',
      icon: '⭐',
      title: 'Senior Specialist / Senior Engineer',
      yearsExperience: '3-5',
      keySkills: ['Advanced Technical', 'Mentoring', 'Process Improvement'],
      salary: '$60K - $90K',
      color: '#695f88',
      unlocked: true
    },
    {
      floor: 2,
      level: 'Junior',
      icon: '💼',
      title: 'Specialist / Engineer',
      yearsExperience: '1-3',
      keySkills: ['Core Technical', 'Problem Solving', 'Collaboration'],
      salary: '$45K - $65K',
      color: '#584f70',
      unlocked: true
    },
    {
      floor: 1,
      level: 'Intern',
      icon: '🎓',
      title: 'Intern / Graduate Trainee',
      yearsExperience: '0-1',
      keySkills: ['Learning', 'Foundational Skills', 'Initiative'],
      salary: '$30K - $45K',
      color: '#473f58',
      unlocked: true
    }
  ];

  // Calculate skill match percentage
  const calculateSkillMatch = (levelSkills) => {
    if (!skills || skills.length === 0) return 0;
    const matchCount = levelSkills.filter(skill => 
      skills.some(userSkill => 
        userSkill.skill_name?.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.skill_name?.toLowerCase())
      )
    ).length;
    return Math.round((matchCount / levelSkills.length) * 100);
  };

  // Get current floor based on role
  const getCurrentFloor = () => {
    if (!currentRole) return 1;
    const roleLower = currentRole.toLowerCase();
    
    if (roleLower.includes('executive') || roleLower.includes('chief')) return 7;
    if (roleLower.includes('director')) return 6;
    if (roleLower.includes('manager') && !roleLower.includes('assistant')) return 5;
    if (roleLower.includes('assistant manager') || roleLower.includes('team lead')) return 4;
    if (roleLower.includes('senior')) return 3;
    if (roleLower.includes('intern') || roleLower.includes('graduate')) return 1;
    return 2; // Default to Junior
  };

  const currentFloor = getCurrentFloor();

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: '12px',
      padding: '2rem',
      border: '2px solid #A296ca',
      minHeight: '700px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#A296ca',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <TrendingUp size={32} />
          Career Lift
        </h2>
        <p style={{ fontSize: '1rem', color: '#aaa', margin: 0 }}>
          Navigate your vertical career progression at PSA
        </p>
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(162, 150, 202, 0.2)',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          <span style={{ color: '#A296ca', fontWeight: '600' }}>
            📍 Current Floor: {currentFloor} - {careerLevels.find(l => l.floor === currentFloor)?.level}
          </span>
        </div>
      </div>

      {/* Main Lift Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2rem' }}>
        {/* Left - Lift Shaft */}
        <div style={{
          background: 'linear-gradient(180deg, #0a0a1a 0%, #2b1d5a 100%)',
          borderRadius: '12px',
          padding: '1rem',
          border: '3px solid #A296ca',
          position: 'relative',
          boxShadow: 'inset 0 0 20px rgba(162, 150, 202, 0.3)'
        }}>
          {/* Lift Shaft Lines */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '5%',
            bottom: '5%',
            width: '2px',
            background: 'repeating-linear-gradient(to bottom, #A296ca 0px, #A296ca 10px, transparent 10px, transparent 20px)',
            opacity: 0.3
          }} />

          {/* Floor Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            {careerLevels.map((level) => {
              const isCurrentFloor = level.floor === currentFloor;
              const isUnlocked = level.floor <= currentFloor + 2;
              const isSelected = level.floor === selectedFloor;

              return (
                <div key={level.floor} style={{ position: 'relative' }}>
                  {/* Lift Car Indicator */}
                  {isCurrentFloor && (
                    <div style={{
                      position: 'absolute',
                      left: '-50px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '2rem',
                      animation: 'float 2s ease-in-out infinite'
                    }}>
                      🛗
                    </div>
                  )}

                  {/* Floor Button */}
                  <button
                    onClick={() => isUnlocked && setSelectedFloor(level.floor)}
                    disabled={!isUnlocked}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: isCurrentFloor 
                        ? `linear-gradient(135deg, ${level.color} 0%, #fff 100%)`
                        : isSelected
                        ? level.color
                        : isUnlocked
                        ? 'rgba(162, 150, 202, 0.2)'
                        : 'rgba(50, 50, 50, 0.3)',
                      border: isCurrentFloor || isSelected 
                        ? `3px solid #fff` 
                        : isUnlocked
                        ? '2px solid #A296ca'
                        : '2px solid #555',
                      borderRadius: '12px',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      color: isCurrentFloor ? '#000' : '#fff',
                      fontWeight: isCurrentFloor ? '700' : '600',
                      opacity: isUnlocked ? 1 : 0.4,
                      boxShadow: isCurrentFloor 
                        ? '0 0 20px rgba(162, 150, 202, 0.8)' 
                        : 'none'
                    }}
                  >
                    {!isUnlocked && (
                      <Lock size={16} style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: '#888'
                      }} />
                    )}
                    {isCurrentFloor && (
                      <CheckCircle size={16} style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: '#000'
                      }} />
                    )}
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                      {level.icon}
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                      Floor {level.floor}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '600' }}>
                      {level.level}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right - Floor Details */}
        <div>
          {selectedFloor ? (
            (() => {
              const level = careerLevels.find(l => l.floor === selectedFloor);
              const skillMatch = calculateSkillMatch(level.keySkills);
              const isCurrentFloor = level.floor === currentFloor;

              return (
                <div style={{
                  background: 'linear-gradient(135deg, #2b1d5a 0%, #1a1a2e 100%)',
                  borderRadius: '12px',
                  padding: '2rem',
                  border: `2px solid ${level.color}`,
                  boxShadow: `0 0 30px ${level.color}40`
                }}>
                  {/* Floor Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: `2px solid ${level.color}`
                  }}>
                    <div>
                      <div style={{
                        fontSize: '3rem',
                        marginBottom: '0.5rem'
                      }}>
                        {level.icon}
                      </div>
                      <h3 style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: level.color,
                        margin: 0
                      }}>
                        {level.title}
                      </h3>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#aaa',
                        marginTop: '0.25rem'
                      }}>
                        Floor {level.floor} • {level.yearsExperience} years experience
                      </div>
                    </div>
                    {isCurrentFloor && (
                      <div style={{
                        padding: '0.75rem 1.25rem',
                        background: level.color,
                        color: '#000',
                        borderRadius: '8px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <CheckCircle size={20} />
                        YOU ARE HERE
                      </div>
                    )}
                  </div>

                  {/* Salary Range */}
                  <div style={{
                    padding: '1.25rem',
                    background: 'rgba(162, 150, 202, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '2px solid rgba(162, 150, 202, 0.3)'
                  }}>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#A296ca',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      💰 SALARY RANGE
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: level.color
                    }}>
                      {level.salary}
                    </div>
                  </div>

                  {/* Key Skills Required */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#A296ca',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Target size={20} />
                      Key Skills Required
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.75rem'
                    }}>
                      {level.keySkills.map((skill, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(162, 150, 202, 0.2)',
                            borderRadius: '8px',
                            border: '2px solid rgba(162, 150, 202, 0.4)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Award size={16} color={level.color} />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill Match Indicator */}
                  <div style={{
                    padding: '1.25rem',
                    background: skillMatch >= 70 
                      ? 'rgba(76, 175, 80, 0.2)' 
                      : skillMatch >= 40
                      ? 'rgba(255, 152, 0, 0.2)'
                      : 'rgba(244, 67, 54, 0.2)',
                    borderRadius: '8px',
                    border: `2px solid ${
                      skillMatch >= 70 
                        ? 'rgba(76, 175, 80, 0.5)' 
                        : skillMatch >= 40
                        ? 'rgba(255, 152, 0, 0.5)'
                        : 'rgba(244, 67, 54, 0.5)'
                    }`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem'
                    }}>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#fff'
                      }}>
                        Your Skill Match
                      </span>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: skillMatch >= 70 ? '#4CAF50' : skillMatch >= 40 ? '#FF9800' : '#F44336'
                      }}>
                        {skillMatch}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${skillMatch}%`,
                        height: '100%',
                        background: skillMatch >= 70 
                          ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' 
                          : skillMatch >= 40
                          ? 'linear-gradient(90deg, #FF9800, #FFC107)'
                          : 'linear-gradient(90deg, #F44336, #FF5722)',
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  {!isCurrentFloor && (
                    <div style={{
                      marginTop: '1.5rem',
                      display: 'flex',
                      gap: '1rem'
                    }}>
                      <button style={{
                        flex: 1,
                        padding: '1rem',
                        background: level.color,
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        <TrendingUp size={20} />
                        Create Development Plan
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div style={{
              background: 'rgba(162, 150, 202, 0.1)',
              borderRadius: '12px',
              padding: '3rem',
              border: '2px dashed #A296ca',
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛗</div>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#A296ca',
                marginBottom: '1rem'
              }}>
                Select a Floor
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#aaa',
                maxWidth: '400px'
              }}>
                Click on any floor button to explore career opportunities and requirements at that level
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem',
        background: 'rgba(162, 150, 202, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={20} color="#A296ca" />
          <span style={{ fontSize: '0.85rem', color: '#fff' }}>Your Current Floor</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'rgba(162, 150, 202, 0.4)',
            borderRadius: '4px',
            border: '2px solid #A296ca'
          }} />
          <span style={{ fontSize: '0.85rem', color: '#fff' }}>Accessible Floors</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={20} color="#888" />
          <span style={{ fontSize: '0.85rem', color: '#fff' }}>Locked (Develop More)</span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-50%) translateX(-5px); }
        }
      `}</style>
    </div>
  );
};

export default CareerLift;