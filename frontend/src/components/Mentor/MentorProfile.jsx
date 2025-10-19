import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Award, MessageSquare, Star, Calendar, CheckCircle } from 'lucide-react';
import Layout from '../Shared/layout';
import { getCompleteUserProfile, requestMentorship } from '../../services/dataService';

const MentorProfile = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMentorProfile();
  }, [mentorId]);

  const loadMentorProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getCompleteUserProfile(mentorId);
      setMentor(data);
    } catch (error) {
      console.error('Error loading mentor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async () => {
    try {
      setSending(true);
      await requestMentorship(mentorId);
      setRequestSent(true);
      setTimeout(() => {
        navigate('/mentors');
      }, 2000);
    } catch (error) {
      console.error('Error requesting mentorship:', error);
      alert('Failed to send mentorship request. Please try again.');
    } finally {
      setSending(false);
    }
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
          <div style={{ color: 'var(--psa-secondary)' }}>Loading mentor profile...</div>
        </div>
      </Layout>
    );
  }

  if (!mentor) {
    return (
      <Layout>
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--psa-gray)'
        }}>
          <h2>Mentor not found</h2>
          <button onClick={() => navigate('/mentors')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Mentors
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/mentors')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'var(--psa-accent)',
            border: '2px solid var(--psa-secondary)',
            borderRadius: '8px',
            color: 'var(--psa-white)',
            cursor: 'pointer',
            marginBottom: '2rem',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={20} />
          Back to Mentors
        </button>

        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: '2rem',
            alignItems: 'start',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--psa-secondary) 0%, #9b88d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: '700',
              color: 'var(--psa-dark)',
              border: '4px solid var(--psa-accent)'
            }}>
              {mentor.first_name?.[0]}{mentor.last_name?.[0]}
            </div>

            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                {mentor.first_name} {mentor.last_name}
              </h1>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '1.1rem',
                  color: 'var(--psa-secondary)',
                  fontWeight: '500'
                }}>
                  <Briefcase size={20} />
                  {mentor.user_role || 'Senior Professional'}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '1rem',
                  color: 'var(--psa-gray)'
                }}>
                  <MapPin size={18} />
                  {mentor.department || 'PSA Singapore'}
                </div>

                {mentor.years_at_company && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem',
                    color: 'var(--psa-gray)'
                  }}>
                    <Award size={18} />
                    {mentor.years_at_company}+ years at PSA
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleRequestMentorship}
              disabled={sending || requestSent}
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                whiteSpace: 'nowrap'
              }}
            >
              {requestSent ? (
                <>
                  <CheckCircle size={20} />
                  Request Sent!
                </>
              ) : sending ? (
                'Sending...'
              ) : (
                <>
                  <MessageSquare size={20} />
                  Request Mentorship
                </>
              )}
            </button>
          </div>

          <div style={{
            borderTop: '1px solid var(--psa-accent)',
            paddingTop: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              About
            </h2>
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.8',
              color: 'var(--psa-gray)',
              marginBottom: '2rem'
            }}>
              {mentor.bio || `${mentor.first_name} is an experienced professional at PSA with expertise in ${mentor.department}. They are passionate about mentoring and helping others grow in their careers.`}
            </p>

            {mentor.skills && mentor.skills.length > 0 && (
              <>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Areas of Expertise
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {mentor.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        background: 'var(--psa-accent)',
                        borderRadius: '8px',
                        border: '1px solid rgba(162, 150, 202, 0.3)'
                      }}
                    >
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--psa-gray)',
                        marginBottom: '0.25rem'
                      }}>
                        {skill.function_area}
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'var(--psa-white)'
                      }}>
                        {skill.skill_name}
                      </div>
                      <div style={{
                        marginTop: '0.5rem',
                        display: 'flex',
                        gap: '0.25rem'
                      }}>
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: i < (skill.proficiency_level || 3) ? 'var(--psa-secondary)' : 'var(--psa-dark)'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {mentor.projects && mentor.projects.length > 0 && (
              <>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Key Projects
                </h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {mentor.projects.slice(0, 3).map((project, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.5rem',
                        background: 'var(--psa-accent)',
                        borderRadius: '12px',
                        border: '1px solid rgba(162, 150, 202, 0.3)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <Star size={20} color="var(--psa-secondary)" />
                        <h3 style={{
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          margin: 0
                        }}>
                          {project.project_name}
                        </h3>
                      </div>
                      <p style={{
                        fontSize: '0.95rem',
                        color: 'var(--psa-gray)',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {project.description}
                      </p>
                      {project.period && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.75rem',
                          fontSize: '0.85rem',
                          color: 'var(--psa-gray)'
                        }}>
                          <Calendar size={16} />
                          {project.period.start} - {project.period.end || 'Present'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {requestSent && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            color: '#000',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(74, 222, 128, 0.4)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 1000
          }}>
            <CheckCircle size={24} />
            Mentorship request sent successfully!
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MentorProfile;