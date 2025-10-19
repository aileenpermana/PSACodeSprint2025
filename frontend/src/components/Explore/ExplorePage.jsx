// EXPLORE PAGE - COMPLETE WITH NAVIGATION

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, TrendingUp, Compass, Ship, Sparkles, Target, BookOpen, Award, ChevronRight } from 'lucide-react';
import Layout from '../Shared/layout';
import WorldMap from './WorldMap';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile } from '../../services/dataService';
import { getCareerRecommendations } from '../../services/openaiService';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

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
      const recommendations = await getCareerRecommendations(
        userData,
        userData.skills || [],
        selectedDivision ? departments.find(d => d.id === selectedDivision)?.name : null
      );
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setAiRecommendations({
        error: true,
        message: 'Unable to get recommendations. Please try again.'
      });
    } finally {
      setLoadingAI(false);
    }
  };

  // Navigate to continent detail view
  const handleContinentClick = (divisionId) => {
    navigate(`/explore/continent/${divisionId}`);
  };

  // Navigate to career lift
  const handleCareerLiftClick = () => {
    navigate('/explore/career-lift');
  };

  // Format AI recommendations for better display
  const formatRecommendations = (recs) => {
    if (!recs) return null;
    
    if (recs.error) {
      return (
        <div style={{
          padding: '1rem',
          background: 'rgba(244, 67, 54, 0.1)',
          borderRadius: '8px',
          border: '2px solid rgba(244, 67, 54, 0.3)',
          color: '#F44336',
          textAlign: 'center'
        }}>
          {recs.message}
        </div>
      );
    }

    if (typeof recs === 'string') {
      return (
        <div style={{
          fontSize: '0.9rem',
          lineHeight: '1.8',
          color: '#fff',
          whiteSpace: 'pre-wrap'
        }}>
          {recs}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recs.careerPaths && (
          <div>
            <h4 style={{
              fontSize: '1rem',
              color: 'var(--psa-secondary)',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Target size={18} />
              Recommended Career Paths
            </h4>
            {recs.careerPaths.map((path, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem',
                  background: 'rgba(162, 150, 202, 0.15)',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  borderLeft: '3px solid var(--psa-secondary)'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{path.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{path.description}</div>
              </div>
            ))}
          </div>
        )}

        {recs.skillsToLearn && (
          <div>
            <h4 style={{
              fontSize: '1rem',
              color: 'var(--psa-secondary)',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Award size={18} />
              Skills to Develop
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {recs.skillsToLearn.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'var(--psa-accent)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(162, 150, 202, 0.3)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {recs.nextSteps && (
          <div>
            <h4 style={{
              fontSize: '1rem',
              color: 'var(--psa-secondary)',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <BookOpen size={18} />
              Recommended Actions
            </h4>
            <ol style={{ paddingLeft: '1.5rem', margin: 0, lineHeight: '2' }}>
              {recs.nextSteps.map((step, idx) => (
                <li key={idx} style={{ fontSize: '0.9rem' }}>{step}</li>
              ))}
            </ol>
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
          minHeight: '60vh' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <Compass size={48} color="var(--psa-secondary)" className="sailing-icon" />
            <p style={{ marginTop: '1rem', color: 'var(--psa-secondary)' }}>
              Charting your course...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: 'var(--psa-white)'
          }}>
            <Map size={36} color="var(--psa-secondary)" />
            Explore Your Journey
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, color: 'var(--psa-gray)' }}>
            Navigate through PSA's career continents and discover new opportunities
          </p>
        </div>

        {/* Main Content Grid */}
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
            
            {/* Career Lift Button - Below Map */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, var(--psa-primary) 0%, #1a1a2e 100%)',
              borderRadius: '12px',
              border: '2px solid var(--psa-secondary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={handleCareerLiftClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(162, 150, 202, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--psa-secondary)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  🛗
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: 'var(--psa-secondary)',
                    margin: 0,
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <TrendingUp size={24} />
                    Career Lift - Vertical Progression
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)', margin: 0 }}>
                    Navigate through management levels and explore vertical career advancement
                  </p>
                </div>
                <ChevronRight size={32} color="var(--psa-secondary)" />
              </div>
            </div>
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
                  width: '100%',
                  padding: '0.75rem',
                  background: loadingAI 
                    ? 'rgba(162, 150, 202, 0.5)' 
                    : 'var(--psa-secondary)',
                  color: loadingAI ? '#fff' : 'var(--psa-dark)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: loadingAI ? 'not-allowed' : 'pointer',
                  opacity: loadingAI ? 0.7 : 1,
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {loadingAI ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTop: '3px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Get AI Navigation
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
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--psa-secondary)',
                  marginBottom: '1rem'
                }}>
                  🤖 AI Recommendations
                </h3>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {formatRecommendations(aiRecommendations)}
                </div>
              </div>
            )}
          </div>
        </div>
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