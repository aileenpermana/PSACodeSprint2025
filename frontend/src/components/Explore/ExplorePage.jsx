// EXPLORE PAGE - COMPLETE WITH NAVIGATION

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, TrendingUp, Compass, Ship, Sparkles, Target, BookOpen, Award, Loader, AlertCircle} from 'lucide-react';
import Layout from '../Shared/layout';
import WorldMap from './WorldMap';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile } from '../../services/dataService';
import { getCareerRecommendations } from '../../services/openaiService';
import CareerLift from './CareerLift';


const ExplorePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [viewMode, setViewMode] = useState('world'); // 'world' or 'lift'

  // Departments as continents
  const departments = [
    {
      id: 'it',
      name: 'Information Technology',
      icon: '💻',
      roles: ['Software Developer', 'Cloud Architect', 'Security Analyst', 'DevOps Engineer', 'IT Support', 'Network Engineer', 'Database Admin']
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: '⚙️',
      roles: ['Operations Manager', 'Logistics Coordinator', 'Terminal Supervisor', 'Process Analyst', 'Quality Control', 'Supply Chain']
    },
    {
      id: 'engineering',
      name: 'Engineering',
      icon: '🔧',
      roles: ['Mechanical Engineer', 'Automation Engineer', 'Project Manager', 'Electrical Engineer', 'Civil Engineer']
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: '💰',
      roles: ['Financial Analyst', 'Accountant', 'Treasury Manager', 'Budget Analyst', 'Tax Specialist']
    },
    {
      id: 'hr',
      name: 'Human Resources',
      icon: '👥',
      roles: ['HR Business Partner', 'Recruiter', 'Training Manager', 'Compensation Analyst', 'Employee Relations', 'Talent Development']
    },
    {
      id: 'data',
      name: 'Data & AI',
      icon: '📊',
      roles: ['Data Scientist', 'Data Engineer', 'ML Engineer', 'Business Intelligence', 'Data Analyst', 'AI Researcher']
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const { data: profile } = await getCompleteUserProfile(user.id);
      setUserData(profile);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

const handleGetRecommendations = async () => {
    if (!userData) return;

    try {
      setLoadingAI(true);
      setAiRecommendations(null);

      console.log('🤖 Requesting AI recommendations for:', userData.first_name);

      const targetDepartment = selectedDivision 
        ? departments.find(d => d.id === selectedDivision)?.name 
        : null;

      const recommendations = await getCareerRecommendations(
        userData,
        userData.skills || [],
        targetDepartment
      );

      console.log('✅ AI Recommendations received:', recommendations);
      setAiRecommendations(recommendations);

    } catch (error) {
      console.error('❌ Error getting recommendations:', error);
      setAiRecommendations({
        error: true,
        message: `Unable to get recommendations: ${error.message}`
      });
    } finally {
      setLoadingAI(false);
    }
  };

  // Navigate to continent detail view
  const handleContinentClick = (divisionId) => {
    navigate(`/explore/continent/${divisionId}`);
  };

  // Format AI recommendations for better display
  const formatRecommendations = (recs) => {
    if (!recs) return null;
    
    if (recs.error) {
      return (
        <div style={{
          padding: '1.5rem',
          background: 'rgba(244, 67, 54, 0.1)',
          borderRadius: '8px',
          border: '2px solid rgba(244, 67, 54, 0.3)',
          color: '#F44336',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={20} />
          {recs.message}
        </div>
      );
    }

    // Handle different response formats
    const careerPaths = recs.career_pathways || recs.careerPaths || [];
    const summary = recs.summary || '';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Summary */}
        {summary && (
          <div style={{
            padding: '1rem',
            background: 'rgba(162, 150, 202, 0.1)',
            borderRadius: '8px',
            borderLeft: '4px solid var(--psa-secondary)',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: '#ddd'
          }}>
            {summary}
          </div>
        )}

        {/* Career Pathways */}
        {careerPaths.length > 0 && (
          <div>
            <h4 style={{
              fontSize: '1rem',
              color: 'var(--psa-secondary)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Target size={18} />
              Recommended Career Pathways
            </h4>
            {careerPaths.map((path, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  background: 'rgba(162, 150, 202, 0.15)',
                  borderRadius: '8px',
                  marginBottom: '0.75rem',
                  borderLeft: '3px solid var(--psa-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(162, 150, 202, 0.25)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(162, 150, 202, 0.15)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '0.5rem'
                }}>
                  <h5 style={{
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: 0
                  }}>
                    {path.title}
                  </h5>
                  {path.match_score && (
                    <span style={{
                      background: 'var(--psa-secondary)',
                      color: '#fff',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {path.match_score}% Match
                    </span>
                  )}
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#bbb',
                  margin: '0.5rem 0',
                  lineHeight: '1.5'
                }}>
                  Timeline: {path.timeline}
                </p>

                {path.target_roles && path.target_roles.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.25rem' }}>
                      <strong>Target Roles:</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {path.target_roles.map((role, i) => (
                        <span key={i} style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          color: '#ddd'
                        }}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {path.skill_gaps && path.skill_gaps.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.25rem' }}>
                      <strong>Skills to Develop:</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {path.skill_gaps.map((skill, i) => (
                        <span key={i} style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          background: 'rgba(255, 193, 7, 0.2)',
                          borderRadius: '4px',
                          color: '#FFC107'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {path.next_steps && path.next_steps.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.25rem' }}>
                      <strong>Next Steps:</strong>
                    </p>
                    <ul style={{
                      fontSize: '0.8rem',
                      color: '#ccc',
                      margin: 0,
                      paddingLeft: '1.25rem',
                      lineHeight: '1.6'
                    }}>
                      {path.next_steps.slice(0, 3).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* If no structured data, show raw response */}
        {careerPaths.length === 0 && typeof recs === 'string' && (
          <div style={{
            fontSize: '0.9rem',
            lineHeight: '1.8',
            color: '#ddd',
            whiteSpace: 'pre-wrap'
          }}>
            {recs}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}>
          <Loader className="spin" size={48} color="var(--psa-secondary)" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem 0' }}>
        {/* Header with View Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 2rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Compass size={32} />
            Career World
          </h1>
          <p style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Explore career pathways across divisions and levels
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(162, 150, 202, 0.1)',
          padding: '0.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(162, 150, 202, 0.3)'
        }}>
          <button
            onClick={() => setViewMode('world')}
            style={{
              padding: '0.75rem 1.5rem',
              background: viewMode === 'world' 
                ? 'linear-gradient(135deg, #A296ca 0%, #7a6fa0 100%)' 
                : 'transparent',
              color: viewMode === 'world' ? '#fff' : '#A296ca',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Map size={18} />
            World Map
          </button>
          <button
            onClick={() => setViewMode('lift')}
            style={{
              padding: '0.75rem 1.5rem',
              background: viewMode === 'lift' 
                ? 'linear-gradient(135deg, #A296ca 0%, #7a6fa0 100%)' 
                : 'transparent',
              color: viewMode === 'lift' ? '#fff' : '#A296ca',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <TrendingUp size={18} />
            Career Lift
          </button>
        </div>
      </div>

        {/* Main Content Grid */}
        {viewMode === 'world' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem'
        }}>
          {/* Left - World Map */}
          <div>
            <WorldMap
              departments={departments}
              currentDepartment={userData?.department}
              onSelectDivision={setSelectedDivision}
              selectedDivision={selectedDivision}
            />
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Current Position */}
            <div style={{
              background: 'var(--psa-primary)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '2px solid var(--psa-secondary)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--psa-secondary)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Ship size={20} />
                Your Current Port
              </h3>
              <div style={{
                padding: '1rem',
                background: 'var(--gradient-ocean)',
                borderRadius: '8px',
                border: '2px solid var(--psa-secondary)',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {userData?.user_role || 'Not Set'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--psa-secondary)' }}>
                  {userData?.department || 'Department Not Set'}
                </div>
              </div>
              <button
                onClick={handleGetRecommendations}
                disabled={loadingAI}
                style={{
                  padding: '1.25rem',
                  background: loadingAI
                    ? 'rgba(162, 150, 202, 0.5)'
                    : 'linear-gradient(135deg, var(--psa-secondary) 0%, #9B59B6 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: loadingAI ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: loadingAI ? 'none' : '0 4px 12px rgba(162, 150, 202, 0.4)',
                  transition: 'all 0.3s ease',
                  opacity: loadingAI ? 0.7 : 1
                }}
              >
                {loadingAI ? (
                  <>
                    <Loader className="spin" size={20} />
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Get AI Career Navigation
                  </>
                )}
              </button>
            </div>

            {/* Selected Division Info */}
            {selectedDivision && (
              <div style={{
                background: 'var(--psa-primary)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '2px solid var(--psa-secondary)'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--psa-secondary)',
                  marginBottom: '1rem'
                }}>
                  {departments.find(d => d.id === selectedDivision)?.icon}
                  {' '}Selected Continent
                </h3>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#fff'
                }}>
                  {departments.find(d => d.id === selectedDivision)?.name}
                </h4>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    color: 'var(--psa-secondary)'
                  }}>
                    Available Roles:
                  </div>
                  {departments.find(d => d.id === selectedDivision)?.roles.slice(0, 5).map((role, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--psa-accent)',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      {role}
                    </div>
                  ))}
                  {departments.find(d => d.id === selectedDivision)?.roles.length > 5 && (
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--psa-secondary)',
                      marginTop: '0.5rem'
                    }}>
                      +{departments.find(d => d.id === selectedDivision)?.roles.length - 5} more roles
                    </div>
                  )}
                </div>
                
                {/* Explore Continent Button */}
                <button
                  onClick={() => handleContinentClick(selectedDivision)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, var(--psa-secondary) 0%, #9b88d4 100%)',
                    color: 'var(--psa-dark)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(162, 150, 202, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Map size={18} />
                  Explore This Continent
                </button>
              </div>
            )}

            {/* AI Recommendations */}
              {aiRecommendations && (
                <div style={{
                  background: 'var(--psa-primary)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '2px solid var(--psa-secondary)',
                  maxHeight: '600px',
                  overflow: 'auto'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--psa-secondary)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Sparkles size={20} />
                    AI Career Recommendations
                  </h3>
                  {formatRecommendations(aiRecommendations)}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* NEW CAREER LIFT VIEW */
          <div style={{ padding: '0 2rem' }}>
            <CareerLift
              currentRole={userData?.user_role}
              currentLevel={userData?.job_level}
              department={userData?.department}
              userData={userData}
            />
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default ExplorePage;