// frontend/src/components/Leadership/LeadershipPotential.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Star, Award, Target, BarChart3, CheckCircle, ArrowRight, Loader } from 'lucide-react';
import Layout from '../Shared/layout';
import { getCurrentUser } from '../../services/supabaseClient';
import { getOrCalculateLeadership } from '../../services/dataService';
import { normalizeLeadershipData, getScoreColor } from '../../utils/leadershipUtils';

const LeadershipPotential = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leadershipData, setLeadershipData] = useState(null);

  useEffect(() => {
    loadLeadershipData();
  }, []);

  const loadLeadershipData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const { data, error } = await getOrCalculateLeadership(user.id);
      
      if (error) {
        console.error('Leadership data error:', error);
        setLeadershipData(null);
        return;
      }

      // Normalize the data to handle both database and calculated formats
      const normalized = normalizeLeadershipData(data);
      console.log('Normalized leadership data:', normalized);
      setLeadershipData(normalized);
    } catch (error) {
      console.error('Error loading leadership data:', error);
      setLeadershipData(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 86) return 'Exceptional';
    if (score >= 76) return 'Strong';
    if (score >= 61) return 'Growing';
    if (score >= 41) return 'Emerging';
    return 'Developing';
  };

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Loader size={48} color="var(--psa-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--psa-secondary)' }}>Analyzing your leadership potential...</p>
        </div>
      </Layout>
    );
  }

  if (!leadershipData || !leadershipData.overall_score) {
    return (
      <Layout>
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--psa-gray)'
        }}>
          <TrendingUp size={64} color="var(--psa-secondary)" style={{ marginBottom: '1rem' }} />
          <h2>Leadership Assessment Unavailable</h2>
          <p>Complete your profile and engage more to unlock your leadership potential score.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const scoreColor = getScoreColor(leadershipData.overall_score);
  const scoreLabel = getScoreLabel(leadershipData.overall_score);

  return (
    <Layout>
      <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <TrendingUp size={40} color="var(--psa-secondary)" />
            Leadership Potential
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--psa-gray)'
          }}>
            Data-driven insights into your leadership readiness
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="card" style={{
          padding: '3rem',
          marginBottom: '2rem',
          background: `linear-gradient(135deg, ${scoreColor}20 0%, ${scoreColor}10 100%)`,
          border: `2px solid ${scoreColor}`
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: `conic-gradient(${scoreColor} ${leadershipData.overall_score * 3.6}deg, var(--psa-accent) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '170px',
                  height: '170px',
                  borderRadius: '50%',
                  background: 'var(--psa-dark)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '4rem',
                    fontWeight: '700',
                    color: scoreColor
                  }}>
                    {Math.round(leadershipData.overall_score)}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--psa-gray)'
                  }}>
                    out of 100
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: scoreColor,
                marginBottom: '1rem'
              }}>
                {scoreLabel} Leadership Potential
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: 'var(--psa-gray)',
                marginBottom: '1rem'
              }}>
                {leadershipData.interpretation || 'Your leadership journey is progressing well. Continue developing your skills and engaging with the platform.'}
              </p>
              <div style={{
                display: 'flex',
                gap: '2rem',
                marginTop: '1.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--psa-gray)', marginBottom: '0.25rem' }}>
                    Readiness
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    {leadershipData.readiness || 'In Progress'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--psa-gray)', marginBottom: '0.25rem' }}>
                    Timeline
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    {leadershipData.timeline || 'Varies'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Scores */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                Behavioral Score
              </h3>
              <BarChart3 size={24} color="#60a5fa" />
            </div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#60a5fa',
              marginBottom: '0.5rem'
            }}>
              {Math.round(leadershipData.behavioral_score)}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--psa-accent)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(leadershipData.behavioral_score, 100)}%`,
                height: '100%',
                background: '#60a5fa',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                Performance Score
              </h3>
              <Target size={24} color="#4ade80" />
            </div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#4ade80',
              marginBottom: '0.5rem'
            }}>
              {Math.round(leadershipData.performance_score)}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--psa-accent)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(leadershipData.performance_score, 100)}%`,
                height: '100%',
                background: '#4ade80',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                Engagement Score
              </h3>
              <Award size={24} color="#fbbf24" />
            </div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#fbbf24',
              marginBottom: '0.5rem'
            }}>
              {Math.round(leadershipData.engagement_score)}
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--psa-accent)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(leadershipData.engagement_score, 100)}%`,
                height: '100%',
                background: '#fbbf24',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Strengths and Development Areas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#4ade80'
            }}>
              <CheckCircle size={28} />
              Key Strengths
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {leadershipData.strengths && leadershipData.strengths.length > 0 ? (
                leadershipData.strengths.map((strength, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'rgba(74, 222, 128, 0.1)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #4ade80',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#4ade80',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '1rem' }}>{strength}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--psa-gray)', textAlign: 'center', padding: '2rem 0' }}>
                  Keep engaging with the platform to identify your strengths
                </p>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#fb923c'
            }}>
              <Target size={28} />
              Development Areas
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {leadershipData.development_areas && leadershipData.development_areas.length > 0 ? (
                leadershipData.development_areas.map((area, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'rgba(251, 146, 60, 0.1)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #fb923c',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#fb923c',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '1rem' }}>{area}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--psa-gray)', textAlign: 'center', padding: '2rem 0' }}>
                  Complete more activities to identify development opportunities
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Star size={28} color="var(--psa-secondary)" />
            Recommended Actions
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {leadershipData.recommendations && leadershipData.recommendations.length > 0 ? (
              leadershipData.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--psa-accent)',
                    borderRadius: '12px',
                    border: '1px solid rgba(162, 150, 202, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flex: 1
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--psa-secondary)',
                      color: 'var(--psa-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '1rem', lineHeight: '1.5' }}>{rec}</span>
                  </div>
                  <ArrowRight size={20} color="var(--psa-secondary)" style={{ flexShrink: 0 }} />
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--psa-gray)', textAlign: 'center', padding: '2rem 0' }}>
                Continue developing your profile to receive personalized recommendations
              </p>
            )}
          </div>

          <button
            onClick={() => navigate('/explore')}
            className="btn btn-primary"
            style={{
              marginTop: '2rem',
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            Explore Career Pathways
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default LeadershipPotential;