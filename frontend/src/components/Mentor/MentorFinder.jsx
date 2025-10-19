import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Briefcase, MapPin, Award, MessageSquare, Sparkles, Loader } from 'lucide-react';
import Layout from '../Shared/layout';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile, findMentors } from '../../services/dataService';
import { recommendMentors } from '../../services/openaiService';

const MentorFinder = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [aiMatching, setAiMatching] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);

  const departments = [
    'All Departments',
    'Information Technology',
    'Operations',
    'Engineering',
    'Finance',
    'Human Resources',
    'Business Development',
    'Sustainability'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchQuery, selectedDepartment, mentors]);

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

      const { data: mentorList } = await findMentors(user.id);
      setMentors(mentorList || []);
      setFilteredMentors(mentorList || []);

    } catch (error) {
      console.error('Error loading mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = [...mentors];

    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.user_role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(mentor =>
        mentor.department?.toLowerCase().includes(selectedDepartment.toLowerCase())
      );
    }

    setFilteredMentors(filtered);
  };

  const handleAIMatching = async () => {
    try {
      setAiMatching(true);
      const userInterests = userData?.interests || [];
      const recommendations = await recommendMentors(userData, userInterests, mentors);
      setAiRecommendations(recommendations);
      
      if (recommendations.matches) {
        const sortedMentors = [...mentors].sort((a, b) => {
          const matchA = recommendations.matches.find(m => 
            m.mentor_name.includes(a.first_name)
          )?.match_percentage || 0;
          const matchB = recommendations.matches.find(m => 
            m.mentor_name.includes(b.first_name)
          )?.match_percentage || 0;
          return matchB - matchA;
        });
        setFilteredMentors(sortedMentors);
      }
    } catch (error) {
      console.error('AI matching error:', error);
      alert('AI matching unavailable. Showing all mentors.');
    } finally {
      setAiMatching(false);
    }
  };

  const getMentorMatchScore = (mentor) => {
    if (!aiRecommendations?.matches) return null;
    const match = aiRecommendations.matches.find(m =>
      m.mentor_name.includes(mentor.first_name)
    );
    return match?.match_percentage;
  };

  const handleConnectMentor = (mentorId) => {
    navigate(`/mentor/${mentorId}`);
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
          <Loader size={48} color="var(--psa-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
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
            <Users size={40} color="var(--psa-secondary)" />
            Find Your Mentor
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--psa-gray)', marginBottom: '2rem' }}>
            Build your trading network with experienced guides
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} color="var(--psa-gray)" style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors by name, role, or department..."
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  borderRadius: '12px',
                  border: '2px solid var(--psa-accent)',
                  background: 'var(--psa-dark)',
                  color: 'var(--psa-white)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                border: '2px solid var(--psa-accent)',
                background: 'var(--psa-dark)',
                color: 'var(--psa-white)',
                fontSize: '1rem',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              <option value="all">All Departments</option>
              {departments.slice(1).map((dept, idx) => (
                <option key={idx} value={dept.toLowerCase()}>{dept}</option>
              ))}
            </select>

            <button
              onClick={handleAIMatching}
              disabled={aiMatching}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              {aiMatching ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Matching...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  AI Match
                </>
              )}
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--psa-accent)',
            borderRadius: '8px',
            border: '1px solid rgba(162, 150, 202, 0.3)'
          }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Found <strong>{filteredMentors.length}</strong> potential mentors
            </p>
            {aiRecommendations && (
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--psa-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Sparkles size={16} />
                AI-powered matching active
              </p>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredMentors.map((mentor, idx) => {
            const matchScore = getMentorMatchScore(mentor);
            
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => handleConnectMentor(mentor.user_id)}
              >
                {matchScore && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                    color: '#000',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    zIndex: 1
                  }}>
                    <Sparkles size={12} />
                    {matchScore}% Match
                  </div>
                )}

                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--psa-secondary) 0%, #9b88d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--psa-dark)',
                  marginBottom: '1rem',
                  border: '3px solid var(--psa-accent)'
                }}>
                  {mentor.first_name?.[0]}{mentor.last_name?.[0]}
                </div>

                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  {mentor.first_name} {mentor.last_name}
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    color: 'var(--psa-secondary)'
                  }}>
                    <Briefcase size={16} />
                    {mentor.user_role || 'Senior Professional'}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    color: 'var(--psa-gray)'
                  }}>
                    <MapPin size={16} />
                    {mentor.department || 'PSA Singapore'}
                  </div>

                  {mentor.years_at_company && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--psa-gray)'
                    }}>
                      <Award size={16} />
                      {mentor.years_at_company}+ years experience
                    </div>
                  )}
                </div>

                {mentor.skills && mentor.skills.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--psa-gray)',
                      marginBottom: '0.5rem'
                    }}>
                      Expertise:
                    </p>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {mentor.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '12px',
                            background: 'rgba(162, 150, 202, 0.2)',
                            color: 'var(--psa-secondary)'
                          }}
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                      {mentor.skills.length > 3 && (
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.3rem 0.6rem',
                          color: 'var(--psa-gray)'
                        }}>
                          +{mentor.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: 'auto'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectMentor(mentor.user_id);
                  }}
                >
                  <MessageSquare size={18} />
                  Connect
                </button>
              </div>
            );
          })}
        </div>

        {filteredMentors.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--psa-gray)'
          }}>
            <Users size={64} color="var(--psa-secondary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No mentors found</h3>
            <p>Try adjusting your search filters or use AI matching to find the perfect mentor.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(162, 150, 202, 0.3);
        }
      `}</style>
    </Layout>
  );
};

export default MentorFinder;