import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, TrendingUp, Calendar, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import Layout from '../Shared/layout';
import TideGauge from './TideGauge';
import { getCurrentUser } from '../../services/supabaseClient';
import { getWellbeingHistory } from '../../services/dataService';

const WellbeingDashboard = () => {
  const navigate = useNavigate();
  const [wellbeingData, setWellbeingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTideLevel, setCurrentTideLevel] = useState(3);

  useEffect(() => {
    loadWellbeingData();
  }, []);

  const loadWellbeingData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const { data } = await getWellbeingHistory(user.id, 12);
      setWellbeingData(data || []);
      
      if (data && data.length > 0) {
        setCurrentTideLevel(data[0].tide_level);
      }
    } catch (error) {
      console.error('Error loading wellbeing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTideStatus = (level) => {
    if (level >= 4) return { status: 'High Tide', color: '#4ade80', message: 'Feeling great!' };
    if (level === 3) return { status: 'Mid Tide', color: '#fbbf24', message: 'Doing okay' };
    return { status: 'Low Tide', color: '#f87171', message: 'Need support' };
  };

  const getWeekTrend = () => {
    if (wellbeingData.length < 2) return 0;
    const recent = wellbeingData.slice(0, 4);
    const avg = recent.reduce((sum, item) => sum + item.tide_level, 0) / recent.length;
    const previous = wellbeingData.slice(4, 8);
    const prevAvg = previous.length > 0 
      ? previous.reduce((sum, item) => sum + item.tide_level, 0) / previous.length 
      : avg;
    return avg - prevAvg;
  };

  const currentStatus = getTideStatus(currentTideLevel);
  const trend = getWeekTrend();

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <div style={{ color: 'var(--psa-secondary)' }}>Loading wellbeing data...</div>
        </div>
      </Layout>
    );
  }

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
            <Heart size={40} color="var(--psa-secondary)" />
            Your Tide Gauge
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--psa-gray)'
          }}>
            Track your mental wellbeing journey like the tides
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Current Status Card */}
          <div className="card" style={{
            padding: '1.5rem',
            background: `linear-gradient(135deg, ${currentStatus.color}20 0%, ${currentStatus.color}10 100%)`,
            border: `2px solid ${currentStatus.color}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Current Status</h3>
              <Heart size={24} color={currentStatus.color} />
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: currentStatus.color,
              marginBottom: '0.5rem'
            }}>
              {currentStatus.status}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)', margin: 0 }}>
              {currentStatus.message}
            </p>
          </div>

          {/* Weekly Trend Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>4-Week Trend</h3>
              <TrendingUp size={24} color={trend >= 0 ? '#4ade80' : '#f87171'} />
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: trend >= 0 ? '#4ade80' : '#f87171',
              marginBottom: '0.5rem'
            }}>
              {trend >= 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)', margin: 0 }}>
              {trend >= 0 ? 'Improving' : 'Needs attention'}
            </p>
          </div>

          {/* Survey Completion Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Check-ins</h3>
              <Calendar size={24} color="var(--psa-secondary)" />
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--psa-secondary)',
              marginBottom: '0.5rem'
            }}>
              {wellbeingData.length}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--psa-gray)', margin: 0 }}>
              Total surveys completed
            </p>
          </div>
        </div>

        {/* Tide Gauge Visualization */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            Your Tide Level
          </h2>
          <TideGauge currentLevel={currentTideLevel} />
          
          <button
            onClick={() => navigate('/wellbeing/survey')}
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
            <Activity size={20} />
            Take Weekly Check-in
          </button>
        </div>

        {/* Wellbeing History */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            Recent Check-ins
          </h2>

          {wellbeingData.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {wellbeingData.slice(0, 8).map((entry, idx) => {
                const status = getTideStatus(entry.tide_level);
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'var(--psa-accent)',
                      borderRadius: '8px',
                      border: `2px solid ${status.color}40`,
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '1rem',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: `${status.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: status.color
                    }}>
                      {entry.tide_level}
                    </div>

                    <div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: status.color,
                        marginBottom: '0.25rem'
                      }}>
                        {status.status}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--psa-gray)'
                      }}>
                        Week {entry.week_number} • {new Date(entry.submitted_at).toLocaleDateString()}
                      </div>
                      {entry.stress_factors && entry.stress_factors.length > 0 && (
                        <div style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          {entry.stress_factors.slice(0, 3).map((factor, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'var(--psa-gray)'
                              }}
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {entry.tide_level >= 4 ? (
                      <CheckCircle size={24} color="#4ade80" />
                    ) : entry.tide_level <= 2 ? (
                      <AlertCircle size={24} color="#f87171" />
                    ) : (
                      <div style={{ width: '24px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              color: 'var(--psa-gray)'
            }}>
              <Heart size={48} color="var(--psa-secondary)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No check-ins yet
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Take your first weekly check-in to start tracking your wellbeing
              </p>
            </div>
          )}
        </div>

        {/* Support Resources */}
        <div className="card" style={{
          padding: '1.5rem',
          marginTop: '2rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: '2px solid rgba(99, 102, 241, 0.3)'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Heart size={24} color="#3b82f6" />
            Need Support?
          </h3>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: 'var(--psa-gray)',
            marginBottom: '1rem'
          }}>
            If you're experiencing low tide levels, remember that help is available. 
            Talk to your manager, HR, or access our Employee Assistance Program.
          </p>
          <button
            onClick={() => navigate('/ai-chat')}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Activity size={18} />
            Talk to AI Counselor
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default WellbeingDashboard;