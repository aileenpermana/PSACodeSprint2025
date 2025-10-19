import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Book, Briefcase, Star, Award, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { getCareerRecommendations, predictLeadershipPotential } from '../../services/openaiService';

/**
 * AI Recommendations Component
 * Displays personalized career pathways, skill gaps, upskilling plans, and leadership potential
 * 
 * @param {object} userData - User's profile data
 * @param {array} userSkills - User's current skills
 * @param {string} targetRole - Optional target role for focused recommendations
 */
const AIRecommendations = ({ userData, userSkills = [], targetRole = null }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData) {
      generateRecommendations();
    }
  }, [userData, targetRole]);

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call OpenAI service to get career recommendations
      const careerData = await getCareerRecommendations(userData, userSkills, targetRole);
      
      // Mock leadership data - you can replace with real performance data
      const mockPerformanceData = {
        rating: 4.2,
        projects_completed: 12,
        quality_score: 85
      };
      
      const mockBehavioralData = {
        collaboration: 4.5,
        initiative: 4.0,
        problem_solving: 4.3,
        communication: 4.2
      };
      
      const mockEngagementData = {
        score: 82,
        mentorship_active: true,
        learning_hours: 45
      };

      // Get leadership prediction
      const leadershipData = await predictLeadershipPotential(
        mockPerformanceData,
        mockBehavioralData,
        mockEngagementData
      );

      // Combine all recommendations
      setRecommendations({
        careerPaths: parseCareerPaths(careerData),
        skillGaps: parseSkillGaps(careerData),
        upskilling: parseUpskilling(careerData),
        internalOpportunities: generateInternalOpportunities(userData),
        leadershipPotential: parseLeadership(leadershipData)
      });
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Parse AI response into structured career paths
  const parseCareerPaths = (data) => {
    // If AI returns structured JSON
    if (data.careerPaths || data.career_pathways) {
      return data.careerPaths || data.career_pathways;
    }
    
    // Fallback: Create default recommendations
    return [
      {
        title: "Technical Leadership Track",
        match: 92,
        timeline: "18-24 months",
        roles: ["Senior Engineer", "Technical Lead", "Engineering Manager"],
        skills: ["System Architecture", "Team Leadership", "Strategic Planning"],
        reasoning: "Your technical expertise and growing experience position you well for leadership roles"
      },
      {
        title: "Specialist Expert Track",
        match: 85,
        timeline: "12-18 months",
        roles: ["Principal Engineer", "Subject Matter Expert", "Technical Architect"],
        skills: ["Advanced Technical Skills", "Mentorship", "Innovation"],
        reasoning: "Deep technical focus with opportunity to guide others"
      }
    ];
  };

  const parseSkillGaps = (data) => {
    if (data.skillGaps || data.skill_gaps) {
      return data.skillGaps || data.skill_gaps;
    }
    
    return [
      { skill: "Advanced Analytics", priority: "High", currentLevel: 2, targetLevel: 4 },
      { skill: "Strategic Leadership", priority: "High", currentLevel: 2, targetLevel: 5 },
      { skill: "Cloud Architecture", priority: "Medium", currentLevel: 3, targetLevel: 4 }
    ];
  };

  const parseUpskilling = (data) => {
    if (data.recommendedCourses || data.recommended_courses) {
      return data.recommendedCourses || data.recommended_courses;
    }
    
    return [
      {
        course: "Advanced Machine Learning Specialization",
        provider: "Coursera",
        duration: "3 months",
        priority: "High",
        skills: ["ML Algorithms", "Deep Learning", "Neural Networks"]
      },
      {
        course: "Strategic Leadership Program",
        provider: "LinkedIn Learning",
        duration: "6 weeks",
        priority: "High",
        skills: ["Executive Leadership", "Change Management", "Vision Setting"]
      }
    ];
  };

  const generateInternalOpportunities = (user) => {
    return [
      {
        role: `Lead ${user?.department || 'Operations'} Specialist`,
        department: user?.department || "Technology",
        match: 88,
        level: "Senior",
        skills: ["Leadership", "Domain Expertise", "Strategy"]
      },
      {
        role: "Innovation Manager",
        department: "Digital Transformation",
        match: 82,
        level: "Manager",
        skills: ["Project Management", "Innovation", "Cross-functional Leadership"]
      }
    ];
  };

  const parseLeadership = (data) => {
    if (data.leadership_score || data.leadershipScore) {
      return {
        score: data.leadership_score || data.leadershipScore,
        strengths: data.key_strengths || data.strengths || ["Strategic thinking", "Team collaboration"],
        development: data.development_areas || data.developmentAreas || ["Executive presence", "Financial acumen"]
      };
    }
    
    return {
      score: 85,
      strengths: ["Strategic thinking", "Team collaboration", "Technical expertise"],
      development: ["Executive presence", "Change management", "Financial acumen"]
    };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        minHeight: '400px'
      }}>
        <Loader size={48} color="var(--psa-secondary)" style={{
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '1rem', color: 'var(--psa-secondary)', fontSize: '1.1rem' }}>
          Analyzing your career trajectory...
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)', marginTop: '0.5rem' }}>
          Our AI is reviewing your skills, experience, and aspirations
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        minHeight: '400px',
        textAlign: 'center'
      }}>
        <AlertCircle size={48} color="#ff3b30" style={{ marginBottom: '1rem' }} />
        <p style={{ color: '#ff3b30', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{error}</p>
        <button
          onClick={generateRecommendations}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div style={{ padding: '0 0 2rem 0' }}>
      {/* Career Pathways */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={24} />
            Recommended Career Pathways
          </h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {recommendations.careerPaths.map((path, idx) => (
              <div key={idx} style={{
                padding: '1.5rem',
                background: 'var(--psa-accent)',
                borderRadius: '12px',
                border: '2px solid var(--psa-secondary)',
                transition: 'all 0.3s ease'
              }}
              className="hover-lift">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      color: 'var(--psa-white)',
                      marginBottom: '0.5rem'
                    }}>
                      {path.title}
                    </h4>
                    <p style={{
                      fontSize: '0.95rem',
                      color: 'var(--psa-gray)',
                      lineHeight: '1.6'
                    }}>
                      {path.reasoning}
                    </p>
                  </div>
                  <div style={{
                    background: 'var(--psa-secondary)',
                    color: 'var(--psa-dark)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    marginLeft: '1rem'
                  }}>
                    {path.match}% Match
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--psa-gray)', marginBottom: '0.25rem' }}>
                      Timeline
                    </p>
                    <p style={{ fontWeight: '600', color: 'var(--psa-secondary)' }}>
                      {path.timeline}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--psa-gray)', marginBottom: '0.25rem' }}>
                      Next Roles
                    </p>
                    <p style={{ fontWeight: '600', color: 'var(--psa-white)' }}>
                      {path.roles?.[0] || 'View Details'}
                    </p>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--psa-gray)', marginBottom: '0.5rem' }}>
                    Key Skills to Develop
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(path.skills || []).map((skill, i) => (
                      <span key={i} style={{
                        background: 'rgba(162, 150, 202, 0.2)',
                        color: 'var(--psa-secondary)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Potential */}
      <div className="card" style={{
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(162, 150, 202, 0.15) 0%, rgba(122, 111, 160, 0.15) 100%)',
        border: '2px solid var(--psa-secondary)'
      }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={24} />
            Leadership Potential Score
          </h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: '700',
              color: 'var(--psa-secondary)',
              marginRight: '2rem'
            }}>
              {recommendations.leadershipPotential.score}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                width: '100%',
                height: '12px',
                background: 'var(--psa-accent)',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: `${recommendations.leadershipPotential.score}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--psa-secondary) 0%, #9b88d4 100%)',
                  transition: 'width 1s ease'
                }}></div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)' }}>
                High leadership potential based on performance, engagement, and behavioral analysis
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <h4 style={{
                fontSize: '1rem',
                color: '#4ade80',
                marginBottom: '0.75rem',
                fontWeight: '600'
              }}>
                Key Strengths
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {recommendations.leadershipPotential.strengths.map((s, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#4ade80'
                    }}></div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{
                fontSize: '1rem',
                color: '#fb923c',
                marginBottom: '0.75rem',
                fontWeight: '600'
              }}>
                Development Areas
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {recommendations.leadershipPotential.development.map((d, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#fb923c'
                    }}></div>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={24} />
            Skill Gap Analysis
          </h3>
        </div>
        <div className="card-body">
          {recommendations.skillGaps.map((gap, idx) => (
            <div key={idx} style={{
              padding: '1rem',
              background: 'var(--psa-accent)',
              borderRadius: '8px',
              marginBottom: '1rem',
              borderLeft: '4px solid #fb923c'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                  {gap.skill}
                </h4>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: gap.priority === 'High' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(251, 146, 60, 0.2)',
                  color: gap.priority === 'High' ? '#ff3b30' : '#fb923c'
                }}>
                  {gap.priority} Priority
                </span>
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: 'var(--psa-gray)',
                  marginBottom: '0.5rem'
                }}>
                  <span>Current: Level {gap.currentLevel}</span>
                  <span>Target: Level {gap.targetLevel}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--psa-dark)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(gap.currentLevel / gap.targetLevel) * 100}%`,
                    height: '100%',
                    background: '#fb923c',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upskilling Recommendations */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Book size={24} />
            Personalized Upskilling Plan
          </h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: '1rem' }}>
            {recommendations.upskilling.map((course, idx) => (
              <div key={idx} style={{
                padding: '1.25rem',
                background: 'var(--psa-accent)',
                borderRadius: '8px',
                border: '1px solid rgba(162, 150, 202, 0.3)',
                transition: 'all 0.3s ease'
              }}
              className="hover-lift">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '0.75rem'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {course.course}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)' }}>
                      {course.provider}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    background: course.priority === 'High' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: course.priority === 'High' ? '#4ade80' : '#3b82f6',
                    whiteSpace: 'nowrap'
                  }}>
                    {course.priority}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)', marginBottom: '0.75rem' }}>
                  Duration: {course.duration}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {(course.skills || []).map((skill, i) => (
                    <span key={i} style={{
                      background: 'rgba(74, 222, 128, 0.15)',
                      color: '#4ade80',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
                <button
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    marginTop: '0.5rem'
                  }}
                >
                  Enroll Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Opportunities */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={24} />
            Internal Mobility Opportunities
          </h3>
        </div>
        <div className="card-body">
          {recommendations.internalOpportunities.map((opp, idx) => (
            <div key={idx} style={{
              padding: '1.25rem',
              background: 'var(--psa-accent)',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
            className="hover-lift">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {opp.role}
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--psa-gray)' }}>
                    {opp.department} • {opp.level} Level
                  </p>
                </div>
                <div style={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#6366f1',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: '700',
                  fontSize: '0.95rem'
                }}>
                  {opp.match}% Match
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {opp.skills.map((skill, i) => (
                  <span key={i} style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#6366f1',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
              <button
                className="btn btn-primary"
                style={{
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                View Details <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(162, 150, 202, 0.3);
          border-color: var(--psa-secondary);
        }
      `}</style>
    </div>
  );
};

export default AIRecommendations;