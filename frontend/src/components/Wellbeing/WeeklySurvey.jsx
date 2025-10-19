import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Layout from '../Shared/layout';
import { getCurrentUser } from '../../services/supabaseClient';
import { submitWellbeingSurvey } from '../../services/dataService';

const WeeklySurvey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tideLevel: null,
    stressFactors: [],
    sleepQuality: null,
    workload: null,
    support: null,
    additionalNotes: ''
  });

  const totalSteps = 4;

  const tideOptions = [
    { level: 5, label: 'High Tide', emoji: '🌊', desc: 'Feeling excellent' },
    { level: 4, label: 'Rising Tide', emoji: '🌅', desc: 'Feeling good' },
    { level: 3, label: 'Mid Tide', emoji: '⚓', desc: 'Feeling okay' },
    { level: 2, label: 'Low Tide', emoji: '🏖️', desc: 'Struggling a bit' },
    { level: 1, label: 'Ebb Tide', emoji: '⚠️', desc: 'Need support' }
  ];

  const stressFactorOptions = [
    'Heavy workload',
    'Tight deadlines',
    'Team conflicts',
    'Unclear expectations',
    'Work-life balance',
    'Personal issues',
    'Health concerns',
    'Career uncertainty'
  ];

  const handleTideSelect = (level) => {
    setFormData({ ...formData, tideLevel: level });
  };

  const toggleStressFactor = (factor) => {
    const current = formData.stressFactors;
    if (current.includes(factor)) {
      setFormData({ ...formData, stressFactors: current.filter(f => f !== factor) });
    } else {
      setFormData({ ...formData, stressFactors: [...current, factor] });
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 604800000);

      await submitWellbeingSurvey(user.id, {
        week_number: currentWeek,
        tide_level: formData.tideLevel,
        stress_factors: formData.stressFactors,
        responses: {
          sleep_quality: formData.sleepQuality,
          workload: formData.workload,
          support: formData.support,
          notes: formData.additionalNotes
        }
      });

      navigate('/wellbeing');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.tideLevel !== null;
      case 2:
        return true;
      case 3:
        return formData.sleepQuality !== null && formData.workload !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              How's your tide today?
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--psa-gray)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Select the level that best describes your current wellbeing
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {tideOptions.map((option) => (
                <button
                  key={option.level}
                  onClick={() => handleTideSelect(option.level)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: formData.tideLevel === option.level
                      ? '3px solid var(--psa-secondary)'
                      : '2px solid var(--psa-accent)',
                    background: formData.tideLevel === option.level
                      ? 'rgba(162, 150, 202, 0.2)'
                      : 'var(--psa-accent)',
                    color: 'var(--psa-white)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1rem',
                    alignItems: 'center',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>{option.emoji}</div>
                  <div>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {option.label}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--psa-gray)'
                    }}>
                      {option.desc}
                    </div>
                  </div>
                  {formData.tideLevel === option.level && (
                    <CheckCircle size={24} color="var(--psa-secondary)" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              What's affecting you?
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--psa-gray)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Select all stress factors that apply (optional)
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {stressFactorOptions.map((factor) => (
                <button
                  key={factor}
                  onClick={() => toggleStressFactor(factor)}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: formData.stressFactors.includes(factor)
                      ? '2px solid var(--psa-secondary)'
                      : '2px solid var(--psa-accent)',
                    background: formData.stressFactors.includes(factor)
                      ? 'rgba(162, 150, 202, 0.2)'
                      : 'var(--psa-accent)',
                    color: 'var(--psa-white)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {factor}
                  {formData.stressFactors.includes(factor) && (
                    <CheckCircle size={18} color="var(--psa-secondary)" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              A few more questions
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--psa-gray)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Help us understand your overall wellbeing
            </p>

            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  How's your sleep quality?
                </label>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center'
                }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setFormData({ ...formData, sleepQuality: value })}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: formData.sleepQuality === value
                          ? '3px solid var(--psa-secondary)'
                          : '2px solid var(--psa-accent)',
                        background: formData.sleepQuality === value
                          ? 'var(--psa-secondary)'
                          : 'var(--psa-accent)',
                        color: formData.sleepQuality === value ? 'var(--psa-dark)' : 'var(--psa-white)',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--psa-gray)'
                }}>
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  How manageable is your workload?
                </label>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center'
                }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setFormData({ ...formData, workload: value })}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: formData.workload === value
                          ? '3px solid var(--psa-secondary)'
                          : '2px solid var(--psa-accent)',
                        background: formData.workload === value
                          ? 'var(--psa-secondary)'
                          : 'var(--psa-accent)',
                        color: formData.workload === value ? 'var(--psa-dark)' : 'var(--psa-white)',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--psa-gray)'
                }}>
                  <span>Overwhelming</span>
                  <span>Very manageable</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Anything else to share?
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--psa-gray)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Optional notes for your wellbeing record
            </p>

            <div style={{
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Share any additional thoughts, concerns, or positive highlights from this week..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--psa-accent)',
                  background: 'var(--psa-dark)',
                  color: 'var(--psa-white)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />

              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                border: '2px solid rgba(99, 102, 241, 0.3)'
              }}>
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: 'var(--psa-gray)',
                  margin: 0
                }}>
                  💙 Your wellbeing matters. If you're experiencing persistent low tide levels, 
                  please reach out to your manager, HR, or our Employee Assistance Program for support.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div style={{
        padding: '2rem 0',
        maxWidth: '1000px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Heart size={32} color="var(--psa-secondary)" />
            Weekly Check-in
          </h1>
          <div style={{
            fontSize: '1rem',
            color: 'var(--psa-gray)'
          }}>
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <div style={{
          marginBottom: '2rem',
          height: '4px',
          background: 'var(--psa-accent)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(currentStep / totalSteps) * 100}%`,
            background: 'linear-gradient(90deg, var(--psa-secondary) 0%, #9b88d4 100%)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div className="card" style={{
          padding: '3rem 2rem',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1 }}>
            {renderStep()}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--psa-accent)'
          }}>
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="btn btn-outline"
              style={{
                visibility: currentStep === 1 ? 'hidden' : 'visible',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem'
              }}
            >
              <ArrowLeft size={20} />
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  fontSize: '1rem'
                }}
              >
                {submitting ? 'Submitting...' : (
                  <>
                    Submit Check-in
                    <CheckCircle size={20} />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem'
                }}
              >
                Next
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WeeklySurvey