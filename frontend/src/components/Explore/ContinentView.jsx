// CONTINENT VIEW - FIXED WITH ROLE DETAIL MODAL

import React, { useState } from 'react';
import { Target, Map, Compass, TrendingUp, Ship, ArrowLeft, X, Loader, CheckCircle, AlertCircle, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeSkillGap, recommendCourses } from '../../services/openaiService';

const ContinentView = ({ division, currentDepartment, userData, onNavigate }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [developmentPlan, setDevelopmentPlan] = useState(null);

  const navigate = useNavigate();

  // Division data (same as before)
  const divisionData = {
    it: {
      name: 'Information Technology',
      icon: '💻',
      color: '#A296ca',
      description: 'Navigate the digital seas with cutting-edge technology and innovation',
      terrain: 'Mountain ranges of servers, valleys of code, and rivers of data',
      climate: 'Fast-paced, innovative, constantly evolving',
      roles: [
        {
          id: 'software-dev',
          title: 'Software Developer',
          level: 'Junior-Senior',
          icon: '👨‍💻',
          description: 'Build and maintain software applications that power PSA operations',
          keySkills: ['Programming', 'Problem Solving', 'Version Control', 'Testing'],
          growthPath: ['Junior Dev → Senior Dev → Tech Lead → Engineering Manager'],
          demand: 'High',
          avgSalary: '$60K-$120K'
        },
        {
          id: 'cloud-architect',
          title: 'Cloud Architect',
          level: 'Senior',
          icon: '☁️',
          description: 'Design and implement cloud infrastructure solutions',
          keySkills: ['Cloud Platforms', 'Architecture Design', 'Security', 'DevOps'],
          growthPath: ['Systems Engineer → Cloud Engineer → Cloud Architect → Principal Architect'],
          demand: 'Very High',
          avgSalary: '$100K-$180K'
        }
      ]
    },
    operations: {
      name: 'Operations',
      icon: '⚙️',
      color: '#FFA726',
      description: 'Orchestrate the heartbeat of PSA - where efficiency meets excellence',
      terrain: 'Plains of logistics, warehouses, and coordination networks',
      climate: 'Structured, dynamic, results-oriented',
      roles: [
        {
          id: 'operations-manager',
          title: 'Operations Manager',
          level: 'Mid-Senior',
          icon: '📋',
          description: 'Oversee daily terminal operations and team coordination',
          keySkills: ['Leadership', 'Process Optimization', 'Safety Management', 'Communication'],
          growthPath: ['Coordinator → Supervisor → Manager → Senior Manager'],
          demand: 'High',
          avgSalary: '$80K-$140K'
        },
        {
          id: 'logistics-coordinator',
          title: 'Logistics Coordinator',
          level: 'Entry-Mid',
          icon: '🚛',
          description: 'Coordinate vessel movements and cargo handling',
          keySkills: ['Planning', 'Coordination', 'Problem Solving', 'Systems'],
          growthPath: ['Junior Coordinator → Coordinator → Senior Coordinator → Planning Manager'],
          demand: 'Medium',
          avgSalary: '$45K-$80K'
        }
      ]
    }
  };

  const handleNavigateToRole = (role) => {
    setSelectedRole(role);
    setDevelopmentPlan(null); // Reset development plan when viewing new role
  };

  const handleCreateDevelopmentPlan = async () => {
    if (!selectedRole) return;

    try {
      setCreatingPlan(true);
      
      console.log('🎯 Creating development plan for:', selectedRole.title);
      
      // Call AI to analyze skill gap
      const analysis = await analyzeSkillGap(
        userData?.skills || [],
        selectedRole.title,
        selectedRole.keySkills
      );
      
      console.log('✅ Skill gap analysis:', analysis);

      // Get course recommendations
      const missingSkills = analysis.critical_gaps || analysis.priority_skills || [];
      const courses = await recommendCourses(
        userData?.skills || [],
        missingSkills,
        selectedRole.title
      );

      console.log('📚 Course recommendations:', courses);
      
      setDevelopmentPlan({
        targetRole: selectedRole.title,
        analysis: analysis,
        courses: courses
      });
      
    } catch (error) {
      console.error('❌ Error creating development plan:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setCreatingPlan(false);
    }
  };

  const currentDivision = divisionData[division] || divisionData.it;
  const isCurrentDivision = currentDivision.name === currentDepartment;

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: '12px',
      padding: '2rem',
      border: `2px solid ${currentDivision.color}`,
      minHeight: '700px'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${currentDivision.color}40 0%, transparent 100%)`,
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        border: `2px solid ${currentDivision.color}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          fontSize: '15rem',
          opacity: 0.1,
          lineHeight: 1
        }}>
          {currentDivision.icon}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>{currentDivision.icon}</div>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: currentDivision.color,
                margin: 0
              }}>
                {currentDivision.name}
              </h1>
              {isCurrentDivision && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: currentDivision.color,
                  color: '#000',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginTop: '0.5rem'
                }}>
                  <Ship size={16} />
                  YOUR CURRENT PORT
                </div>
              )}
            </div>
          </div>

          <p style={{
            fontSize: '1.2rem',
            color: '#fff',
            marginBottom: 0,
            maxWidth: '800px'
          }}>
            {currentDivision.description}
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--psa-secondary)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Compass size={24} />
          Available Roles in {currentDivision.name}
        </h3>

        <div style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
        }}>
          {currentDivision.roles.map((role) => {
            const isCurrentRole = userData?.user_role === role.title;
            
            return (
              <div
                key={role.id}
                style={{
                  background: isCurrentRole 
                    ? 'linear-gradient(135deg, rgba(162, 150, 202, 0.3) 0%, rgba(122, 111, 160, 0.2) 100%)'
                    : 'var(--psa-primary)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: isCurrentRole 
                    ? '3px solid var(--psa-secondary)'
                    : '2px solid rgba(162, 150, 202, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => !isCurrentRole && handleNavigateToRole(role)}
                onMouseEnter={(e) => {
                  if (!isCurrentRole) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(162, 150, 202, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {role.icon}
                </div>

                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  {role.title}
                </h4>

                <div style={{
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(162, 150, 202, 0.2)',
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  color: 'var(--psa-secondary)',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  {role.level}
                </div>

                <p style={{
                  fontSize: '0.9rem',
                  color: '#aaa',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {role.description}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {role.keySkills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.6rem',
                        background: 'rgba(162, 150, 202, 0.2)',
                        borderRadius: '6px',
                        color: '#A296ca'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Demand</div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: role.demand === 'Very High' || role.demand === 'High' ? '#4CAF50' : '#FFA726'
                    }}>
                      {role.demand}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Salary Range</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>
                      {role.avgSalary}
                    </div>
                  </div>
                </div>

                {isCurrentRole && (
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(162, 150, 202, 0.2)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'var(--psa-secondary)',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    ⭐ You are here
                  </div>
                )}

                {!isCurrentRole && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToRole(role);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, var(--psa-secondary) 0%, #7a6fa0 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Ship size={18} />
                    Navigate Here
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Back Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '3rem'
      }}>
        <button
          onClick={onNavigate}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #A296ca 0%, #7a6fa0 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 15px rgba(162, 150, 202, 0.3)'
          }}
        >
          <Map size={20} />
          Back to World Map
        </button>
      </div>

      {/* Role Detail Modal */}
      {selectedRole && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2b1d5a 0%, #1d161e 100%)',
            border: '3px solid var(--psa-secondary)',
            borderRadius: '16px',
            maxWidth: developmentPlan ? '1400px' : '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: developmentPlan ? 'row' : 'column',
            gap: developmentPlan ? '2rem' : '0'
          }}>
            {/* Role Details Section */}
            <div style={{
              flex: developmentPlan ? '1' : 'auto',
              padding: '2rem'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '2rem'
              }}>
                <div>
                  <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
                    {selectedRole.icon}
                  </div>
                  <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#fff',
                    margin: 0,
                    marginBottom: '0.5rem'
                  }}>
                    {selectedRole.title}
                  </h2>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(162, 150, 202, 0.2)',
                    borderRadius: '20px',
                    display: 'inline-block',
                    fontSize: '0.85rem',
                    color: 'var(--psa-secondary)',
                    fontWeight: '600'
                  }}>
                    {selectedRole.level}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setDevelopmentPlan(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '0.5rem'
                  }}
                >
                  <X size={28} />
                </button>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: 'var(--psa-secondary)',
                  marginBottom: '0.75rem'
                }}>
                  Role Overview
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#ddd',
                  lineHeight: '1.8'
                }}>
                  {selectedRole.description}
                </p>
              </div>

              {/* Key Skills */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: 'var(--psa-secondary)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Target size={18} />
                  Key Skills Required
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  {selectedRole.keySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.6rem 1rem',
                        background: 'rgba(162, 150, 202, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#fff',
                        border: '1px solid rgba(162, 150, 202, 0.4)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Path */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: 'var(--psa-secondary)',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <TrendingUp size={18} />
                  Career Growth Path
                </h3>
                {selectedRole.growthPath.map((path, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '0.9rem',
                      color: '#aaa',
                      lineHeight: '1.8',
                      paddingLeft: '1rem',
                      borderLeft: '2px solid var(--psa-secondary)'
                    }}
                  >
                    {path}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(162, 150, 202, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(162, 150, 202, 0.3)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>
                    Market Demand
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: selectedRole.demand === 'Very High' || selectedRole.demand === 'High' ? '#4CAF50' : '#FFA726'
                  }}>
                    {selectedRole.demand}
                  </div>
                </div>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(162, 150, 202, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(162, 150, 202, 0.3)'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>
                    Salary Range
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    {selectedRole.avgSalary}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setDevelopmentPlan(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'transparent',
                    border: '2px solid var(--psa-secondary)',
                    borderRadius: '8px',
                    color: 'var(--psa-secondary)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(162, 150, 202, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <ArrowLeft size={20} />
                  Back
                </button>

                <button
                  onClick={handleCreateDevelopmentPlan}
                  disabled={creatingPlan || developmentPlan}
                  style={{
                    flex: 2,
                    padding: '1rem',
                    background: creatingPlan || developmentPlan
                      ? 'rgba(162, 150, 202, 0.3)'
                      : 'linear-gradient(135deg, var(--psa-secondary) 0%, #9B59B6 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: creatingPlan || developmentPlan ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    opacity: creatingPlan || developmentPlan ? 0.7 : 1
                  }}
                >
                  {creatingPlan ? (
                    <>
                      <Loader className="spin" size={20} />
                      Creating Development Plan...
                    </>
                  ) : developmentPlan ? (
                    <>
                      <CheckCircle size={20} />
                      Plan Created
                    </>
                  ) : (
                    <>
                      <Target size={20} />
                      Create Development Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Development Plan Panel (appears after creation) */}
            {developmentPlan && (
              <div style={{
                flex: '1',
                padding: '2rem',
                background: 'rgba(162, 150, 202, 0.05)',
                borderLeft: '2px solid rgba(162, 150, 202, 0.3)',
                overflowY: 'auto'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'var(--psa-secondary)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Target size={24} />
                  Development Plan
                </h2>

                {/* Skill Gap Analysis */}
                {developmentPlan.analysis && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      color: '#fff',
                      marginBottom: '1rem'
                    }}>
                      Skill Gap Analysis
                    </h3>
                    
                    {developmentPlan.analysis.critical_gaps && developmentPlan.analysis.critical_gaps.length > 0 && (
                      <div style={{
                        padding: '1rem',
                        background: 'rgba(255, 193, 7, 0.1)',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        borderLeft: '4px solid #FFC107'
                      }}>
                        <p style={{
                          fontSize: '0.85rem',
                          color: '#FFC107',
                          marginBottom: '0.75rem',
                          fontWeight: '600'
                        }}>
                          Critical Skills to Develop:
                        </p>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          {developmentPlan.analysis.critical_gaps.map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.4rem 0.7rem',
                                background: 'rgba(255, 193, 7, 0.2)',
                                borderRadius: '6px',
                                color: '#FFC107'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {developmentPlan.analysis.strengths && developmentPlan.analysis.strengths.length > 0 && (
                      <div style={{
                        padding: '1rem',
                        background: 'rgba(76, 175, 80, 0.1)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #4CAF50'
                      }}>
                        <p style={{
                          fontSize: '0.85rem',
                          color: '#4CAF50',
                          marginBottom: '0.75rem',
                          fontWeight: '600'
                        }}>
                          Your Existing Strengths:
                        </p>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          {developmentPlan.analysis.strengths.map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.4rem 0.7rem',
                                background: 'rgba(76, 175, 80, 0.2)',
                                borderRadius: '6px',
                                color: '#4CAF50'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Course Recommendations */}
                {developmentPlan.courses && developmentPlan.courses.courses && developmentPlan.courses.courses.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      color: '#fff',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Book size={20} />
                      Recommended Courses
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      {developmentPlan.courses.courses.slice(0, 5).map((course, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '1rem',
                            background: 'rgba(162, 150, 202, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(162, 150, 202, 0.3)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '0.5rem'
                          }}>
                            <h4 style={{
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              color: '#fff',
                              margin: 0
                            }}>
                              {course.title}
                            </h4>
                            {course.priority && (
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '0.2rem 0.5rem',
                                background: 'var(--psa-secondary)',
                                color: '#fff',
                                borderRadius: '12px',
                                fontWeight: '600'
                              }}>
                                Priority {course.priority}
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#aaa',
                            margin: '0.25rem 0'
                          }}>
                            {course.provider} • {course.duration} • {course.difficulty}
                          </p>
                          {course.skills_gained && course.skills_gained.length > 0 && (
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.3rem',
                              marginTop: '0.5rem'
                            }}>
                              {course.skills_gained.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '0.2rem 0.4rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    color: '#ddd'
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ContinentView;