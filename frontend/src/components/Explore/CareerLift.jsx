import React, { useState } from 'react';
import { TrendingUp, Target, Loader, CheckCircle, AlertCircle, Book, Award } from 'lucide-react';
import { analyzeSkillGap, recommendCourses } from '../../services/openaiService';

const CareerLift = ({ currentRole, currentLevel, department, userData, skills = [] }) => {
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [developmentPlan, setDevelopmentPlan] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Career floors (levels)
  const careerFloors = [
    {
      level: 7,
      title: 'C-Suite Executive',
      roles: ['Chief Technology Officer', 'Chief Operations Officer', 'Chief Financial Officer'],
      keySkills: ['Strategic Vision', 'Executive Leadership', 'Board Relations', 'M&A'],
      yearsExp: '20+',
      description: 'Top executive leadership'
    },
    {
      level: 6,
      title: 'Director',
      roles: ['Director of Engineering', 'Director of Operations', 'Finance Director'],
      keySkills: ['Dept Management', 'Budget Planning', 'Strategic Planning', 'Cross-functional Leadership'],
      yearsExp: '15-20',
      description: 'Department-level leadership'
    },
    {
      level: 5,
      title: 'Senior Manager',
      roles: ['Senior Engineering Manager', 'Senior Operations Manager', 'Senior Program Manager'],
      keySkills: ['Team Leadership', 'Project Management', 'Stakeholder Management', 'Strategy'],
      yearsExp: '10-15',
      description: 'Leading multiple teams'
    },
    {
      level: 4,
      title: 'Manager / Team Lead',
      roles: ['Engineering Manager', 'Team Lead', 'Product Manager'],
      keySkills: ['People Management', 'Planning', 'Communication', 'Mentoring'],
      yearsExp: '7-10',
      description: 'Managing teams and projects'
    },
    {
      level: 3,
      title: 'Senior Professional',
      roles: ['Senior Engineer', 'Senior Analyst', 'Senior Specialist'],
      keySkills: ['Technical Expertise', 'Mentoring', 'Complex Projects', 'Problem Solving'],
      yearsExp: '5-7',
      description: 'Expert contributor level'
    },
    {
      level: 2,
      title: 'Mid-Level Professional',
      roles: ['Software Engineer', 'Business Analyst', 'Operations Specialist'],
      keySkills: ['Technical Skills', 'Collaboration', 'Initiative', 'Delivery'],
      yearsExp: '2-5',
      description: 'Independent contributor'
    },
    {
      level: 1,
      title: 'Junior / Entry Level',
      roles: ['Associate Engineer', 'Junior Analyst', 'Graduate Trainee'],
      keySkills: ['Learning', 'Foundations', 'Teamwork', 'Adaptability'],
      yearsExp: '0-2',
      description: 'Starting your career'
    }
  ];

  const getCurrentFloor = () => {
    if (!currentRole) return 1;
    const roleLower = currentRole.toLowerCase();
    
    if (roleLower.includes('chief') || roleLower.includes('cto') || roleLower.includes('cfo')) return 7;
    if (roleLower.includes('director')) return 6;
    if (roleLower.includes('senior manager')) return 5;
    if (roleLower.includes('manager') && !roleLower.includes('assistant')) return 4;
    if (roleLower.includes('senior')) return 3;
    if (roleLower.includes('intern') || roleLower.includes('graduate') || roleLower.includes('trainee')) return 1;
    return 2;
  };

  const handleCreateDevelopmentPlan = async (floorData) => {
    try {
      setCreatingPlan(true);
      setPlanError(null);
      setSelectedFloor(floorData);
      
      console.log('🎯 Creating development plan for:', floorData.title);
      
      // Call AI to analyze skill gap
      const analysis = await analyzeSkillGap(
        skills,
        floorData.title,
        floorData.keySkills
      );
      
      console.log('✅ Skill gap analysis:', analysis);

      // Get course recommendations based on missing skills
      const missingSkills = analysis.critical_gaps || analysis.priority_skills || [];
      const courses = await recommendCourses(
        skills,
        missingSkills,
        floorData.title
      );

      console.log('📚 Course recommendations:', courses);
      
      setDevelopmentPlan({
        targetRole: floorData.title,
        analysis: analysis,
        courses: courses,
        targetLevel: floorData.level
      });
      
    } catch (error) {
      console.error('❌ Error creating development plan:', error);
      setPlanError(error.message);
    } finally {
      setCreatingPlan(false);
    }
  };

  const currentFloor = getCurrentFloor();
  const completionPercentage = ((currentFloor - 1) / 6) * 100;

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
          background: 'rgba(162, 150, 202, 0.15)',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Target size={18} color="#A296ca" />
          <span style={{ color: '#fff', fontWeight: '600' }}>
            Current: Floor {currentFloor} - {careerFloors.find(f => f.level === currentFloor)?.title}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(162, 150, 202, 0.2)',
        borderRadius: '4px',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #A296ca 0%, #9B59B6 100%)',
          width: `${completionPercentage}%`,
          transition: 'width 0.5s ease'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: developmentPlan ? '1fr 1fr' : '1fr',
        gap: '2rem'
      }}>
        {/* Career Floors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {careerFloors.map((floor) => {
            const isCurrent = floor.level === currentFloor;
            const isPast = floor.level < currentFloor;
            const isFuture = floor.level > currentFloor;

            return (
              <div
                key={floor.level}
                style={{
                  padding: '1.5rem',
                  background: isCurrent
                    ? 'linear-gradient(135deg, rgba(162, 150, 202, 0.3) 0%, rgba(155, 89, 182, 0.2) 100%)'
                    : isPast
                    ? 'rgba(76, 175, 80, 0.1)'
                    : 'rgba(162, 150, 202, 0.05)',
                  borderRadius: '12px',
                  border: isCurrent
                    ? '3px solid #A296ca'
                    : isPast
                    ? '2px solid rgba(76, 175, 80, 0.3)'
                    : '2px solid rgba(162, 150, 202, 0.2)',
                  position: 'relative',
                  cursor: isFuture ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  opacity: isPast ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (isFuture) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = '#A296ca';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFuture) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(162, 150, 202, 0.2)';
                  }
                }}
              >
                {/* Floor Level Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  background: isCurrent ? '#A296ca' : isPast ? '#4CAF50' : '#666',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {isPast && <CheckCircle size={12} />}
                  Floor {floor.level}
                </div>

                {/* Title and Description */}
                <div style={{ marginTop: '0.5rem' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: isCurrent ? '#A296ca' : '#fff',
                    marginBottom: '0.5rem'
                  }}>
                    {floor.title}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#aaa',
                    marginBottom: '0.75rem'
                  }}>
                    {floor.description} • {floor.yearsExp} years experience
                  </p>
                </div>

                {/* Example Roles */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#888',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Example Roles:
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {floor.roles.map((role, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.3rem 0.6rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          color: '#ddd'
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Skills */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#888',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Key Skills:
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {floor.keySkills.map((skill, idx) => (
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
                </div>

                {/* Action Button */}
                {isFuture && (
                  <button
                    onClick={() => handleCreateDevelopmentPlan(floor)}
                    disabled={creatingPlan}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: creatingPlan
                        ? 'rgba(162, 150, 202, 0.3)'
                        : 'var(--psa-secondary)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: creatingPlan ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {creatingPlan ? (
                      <>
                        <Loader className="spin" size={16} />
                        Creating Plan...
                      </>
                    ) : (
                      <>
                        <Target size={16} />
                        Create Development Plan
                      </>
                    )}
                  </button>
                )}

                {isCurrent && (
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(162, 150, 202, 0.2)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#A296ca',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    ⭐ You are here
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Development Plan Panel */}
        {developmentPlan && (
          <div style={{
            position: 'sticky',
            top: '20px',
            height: 'fit-content'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2b1d5a 0%, #1d161e 100%)',
              padding: '2rem',
              borderRadius: '12px',
              border: '3px solid #A296ca'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#A296ca',
                    marginBottom: '0.5rem'
                  }}>
                    Development Plan
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>
                    Path to: {developmentPlan.targetRole}
                  </p>
                </div>
                <button
                  onClick={() => setDevelopmentPlan(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#aaa',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                  }}
                >
                  ×
                </button>
              </div>

              {planError && (
                <div style={{
                  padding: '1rem',
                  background: 'rgba(244, 67, 54, 0.1)',
                  borderRadius: '8px',
                  border: '2px solid rgba(244, 67, 54, 0.3)',
                  color: '#F44336',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={18} />
                  {planError}
                </div>
              )}

              {/* Skill Gap Analysis */}
              {developmentPlan.analysis && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    color: '#fff',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Target size={18} />
                    Skill Gap Analysis
                  </h4>
                  
                  {developmentPlan.analysis.critical_gaps && (
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255, 193, 7, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '0.75rem',
                      borderLeft: '4px solid #FFC107'
                    }}>
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#FFC107',
                        marginBottom: '0.5rem',
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

                  {developmentPlan.analysis.strengths && (
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(76, 175, 80, 0.1)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #4CAF50'
                    }}>
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#4CAF50',
                        marginBottom: '0.5rem',
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
              {developmentPlan.courses && developmentPlan.courses.courses && (
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    color: '#fff',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Book size={18} />
                    Recommended Courses
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
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
                          <h5 style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#fff',
                            margin: 0
                          }}>
                            {course.title}
                          </h5>
                          {course.priority && (
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.5rem',
                              background: '#A296ca',
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
                        {course.skills_gained && (
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
          </div>
        )}
      </div>

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

export default CareerLift;