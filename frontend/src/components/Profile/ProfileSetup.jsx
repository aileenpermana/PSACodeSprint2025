// Multi-step onboarding for new users
// Collects: Basic info, current role, skills, interests

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { getCurrentUser } from '../../services/supabaseClient';
import { getUserProfile, getCompleteUserProfile } from '../../services/dataService';
import { createUserProfile, addUserSkill, updateUserProfile } from '../../services/dataService';
import Layout from '../Shared/layout';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    first_name: '',
    last_name: '',
    employee_id: '',
    
    // Step 2: Role & Department
    user_role: '',
    department: '',
    hire_date: '',
    
    // Step 3: Skills
    selectedSkills: [],
    
    // Step 4: Interests
    interests: []
  });

  const [existingProfile, setExistingProfile] = useState(null);

  const totalSteps = 4;

  // Department options (divisions/continents in our maritime metaphor)
  const departments = [
    'Information Technology',
    'Operations',
    'Engineering',
    'Finance',
    'Human Resources',
    'Commercial',
    'Business Development',
    'Corporate Affairs',
    'Data & AI'
  ];

  // Sample skills by department
  const skillsByDepartment = {
    'Information Technology': [
      'Cloud Architecture',
      'Network Security',
      'Software Development',
      'Database Management',
      'IT Support'
    ],
    'Operations': [
      'Logistics Management',
      'Process Optimization',
      'Quality Control',
      'Supply Chain',
      'Terminal Operations'
    ],
    'Engineering': [
      'Automation Systems',
      'Mechanical Engineering',
      'Electrical Systems',
      'Project Management',
      'Technical Design'
    ],
    'Finance': [
      'Financial Analysis',
      'Budgeting',
      'Accounting',
      'Treasury Management',
      'Financial Reporting'
    ],
    'Human Resources': [
      'Talent Management',
      'Recruitment',
      'Training & Development',
      'Employee Relations',
      'Compensation & Benefits'
    ]
  };

  // Interest areas for mentor matching
  const interestAreas = [
    'Leadership Development',
    'Technical Skills',
    'Career Advancement',
    'Work-Life Balance',
    'Innovation & Technology',
    'Cross-Functional Collaboration',
    'Strategic Thinking',
    'Communication Skills'
  ];

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await getCompleteUserProfile(user.id);
      
      if (data && !error) {
        setExistingProfile(data);
        
        // Pre-fill form with existing data
        setFormData(prev => ({
          ...prev,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          employee_id: data.employee_id || '',
          user_role: data.user_role || '',
          department: data.department || '',
          hire_date: data.hire_date || '',
          selectedSkills: data.skills?.map(s => ({
            skill_name: s.skill_name,
            function_area: s.function_area || data.department,
            proficiency_level: s.proficiency_level || 3
          })) || [],
          interests: data.interests || []
        }));

        // Skip to first incomplete section
        const completionStatus = calculateMissingFields(data);
        if (completionStatus.missingFields.length > 0) {
          setCurrentStep(completionStatus.startStep);
        }
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  // Toggle interest selection
  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Toggle skill with proficiency
const toggleSkillWithProficiency = (skillName, department) => {
  setFormData(prev => {
    const isSelected = prev.selectedSkills.some(s => s.skill_name === skillName);
    
    if (isSelected) {
      // Remove skill
      return {
        ...prev,
        selectedSkills: prev.selectedSkills.filter(s => s.skill_name !== skillName)
      };
    } else {
      // Add skill with default proficiency
      return {
        ...prev,
        selectedSkills: [...prev.selectedSkills, {
          skill_name: skillName,
          function_area: department,
          proficiency_level: 3
        }]
      };
    }
  });
};

// Update skill proficiency
const updateSkillProficiency = (skillName, proficiency) => {
  setFormData(prev => ({
    ...prev,
    selectedSkills: prev.selectedSkills.map(skill =>
      skill.skill_name === skillName
        ? { ...skill, proficiency_level: proficiency }
        : skill
    )
  }));
};

  // Validate current step
  const validateStep = () => {
    switch(currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.employee_id;
      case 2:
        return formData.user_role && formData.department;
      case 3:
        return formData.selectedSkills.length > 0;
      case 4:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateMissingFields = (data) => {
    const missing = [];
    let startStep = 1;

    if (!data.first_name || !data.last_name || !data.employee_id) {
      missing.push('basic_info');
      startStep = 1;
    } else if (!data.user_role || !data.department) {
      missing.push('role');
      startStep = 2;
    } else if (!data.skills || data.skills.length === 0) {
      missing.push('skills');
      startStep = 3;
    } else if (!data.interests || data.interests.length === 0) {
      missing.push('interests');
      startStep = 4;
    }

    return { missingFields: missing, startStep };
  };

  // Submit profile
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      if (existingProfile) {
        // UPDATE existing profile
        const { error: updateError } = await updateUserProfile(user.id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          employee_id: formData.employee_id,
          user_role: formData.user_role,
          department: formData.department,
          hire_date: formData.hire_date || existingProfile.hire_date,
          interests: formData.interests
        });

        if (updateError) {
          console.error('Error updating profile:', updateError);
          alert('Failed to update profile');
          return;
        }

        // Update skills - add new ones
        for (const skill of formData.selectedSkills) {
          await addUserSkill(user.id, {
            function_area: skill.function_area,
            specialization: skill.function_area,
            skill_name: skill.skill_name,
            proficiency_level: skill.proficiency_level
          });
        }
      } else {
        // CREATE new profile
        const profileData = {
          email: user.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          employee_id: formData.employee_id,
          user_role: formData.user_role,
          department: formData.department,
          hire_date: formData.hire_date || new Date().toISOString(),
          interests: formData.interests
        };

        const { error: profileError } = await createUserProfile(user.id, profileData);
        if (profileError) {
          console.error('Error creating profile:', profileError);
          alert('Failed to create profile');
          return;
        }

        // Add selected skills
        for (const skill of formData.selectedSkills) {
          await addUserSkill(user.id, {
            function_area: skill.function_area,
            specialization: skill.function_area,
            skill_name: skill.skill_name,
            proficiency_level: skill.proficiency_level
          });
        }
      }

      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--psa-secondary)' }}>
              Welcome Aboard! 👋
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              Let's start by getting to know you
            </p>

            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your last name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Employee ID *</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., EMP-20001"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--psa-secondary)' }}>
              Your Current Port 🚢
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              Tell us about your current role at PSA
            </p>

            <div className="form-group">
              <label className="form-label">Current Role *</label>
              <input
                type="text"
                name="user_role"
                value={formData.user_role}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Software Engineer, Operations Manager"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department/Division *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="">Select your department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Hire Date (Optional)</label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--psa-secondary)' }}>
              Your Skills 🎯
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              Select skills from any department and rate your proficiency (1-5)
            </p>

            <div style={{ marginBottom: '2rem' }}>
              {Object.entries(skillsByDepartment).map(([dept, skills]) => (
                <div key={dept} style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '1rem',
                    color: 'var(--psa-secondary)',
                    fontWeight: '600'
                  }}>
                    {dept}
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {skills.map(skill => {
                      const selectedSkill = formData.selectedSkills.find(s => s.skill_name === skill);
                      const isSelected = !!selectedSkill;
                      const proficiency = selectedSkill?.proficiency_level || 3;

                      return (
                        <div
                          key={skill}
                          style={{
                            padding: '1rem',
                            background: isSelected 
                              ? 'var(--psa-secondary)' 
                              : 'var(--psa-accent)',
                            color: isSelected 
                              ? 'var(--psa-dark)' 
                              : 'var(--psa-white)',
                            border: `2px solid ${isSelected ? 'var(--psa-secondary)' : 'transparent'}`,
                            borderRadius: 'var(--radius-md)',
                            transition: 'all var(--transition-base)'
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: isSelected ? '0.75rem' : 0
                          }}>
                            <span style={{ fontWeight: '500' }}>{skill}</span>
                            <button
                              onClick={() => toggleSkillWithProficiency(skill, dept)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                color: 'inherit'
                              }}
                            >
                              {isSelected ? <Check size={20} /> : '+'}
                            </button>
                          </div>
                          
                          {isSelected && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <label style={{ 
                                fontSize: '0.85rem', 
                                display: 'block',
                                marginBottom: '0.5rem',
                                opacity: 0.9
                              }}>
                                Proficiency: {proficiency}/5
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={proficiency}
                                onChange={(e) => updateSkillProficiency(skill, parseInt(e.target.value))}
                                style={{
                                  width: '100%',
                                  cursor: 'pointer'
                                }}
                              />
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                marginTop: '0.25rem',
                                opacity: 0.7
                              }}>
                                <span>Beginner</span>
                                <span>Expert</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {formData.selectedSkills.length === 0 && (
              <p style={{ textAlign: 'center', padding: '1rem', opacity: 0.7 }}>
                Select at least one skill to continue
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--psa-secondary)' }}>
              Your Interests 🧭
            </h2>
            <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
              What areas are you interested in developing? This helps us match you with mentors
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {interestAreas.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: '1rem',
                    background: formData.interests.includes(interest) 
                      ? 'var(--psa-secondary)' 
                      : 'var(--psa-accent)',
                    color: formData.interests.includes(interest) 
                      ? 'var(--psa-dark)' 
                      : 'var(--psa-white)',
                    border: `2px solid ${formData.interests.includes(interest) ? 'var(--psa-secondary)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all var(--transition-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left'
                  }}
                >
                  <span>{interest}</span>
                  {formData.interests.includes(interest) && <Check size={18} />}
                </button>
              ))}
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'var(--psa-accent)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--psa-secondary)'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--psa-secondary)' }}>
                🎉 You're almost ready to set sail!
              </h4>
              <p style={{ margin: 0, opacity: 0.9 }}>
                Click "Complete Setup" to start your career journey with PSA Pathways
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout showNavigation={false}>
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          {/* Progress Steps Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            position: 'relative'
          }}>
            {/* Progress Line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '0',
              right: '0',
              height: '4px',
              background: 'var(--psa-accent)',
              zIndex: 0
            }}>
              <div style={{
                height: '100%',
                background: 'var(--psa-secondary)',
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                transition: 'width var(--transition-base)'
              }} />
            </div>

            {/* Step Circles */}
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 1
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step <= currentStep ? 'var(--psa-secondary)' : 'var(--psa-accent)',
                  color: step <= currentStep ? 'var(--psa-dark)' : 'var(--psa-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  border: `3px solid ${step <= currentStep ? 'var(--psa-secondary)' : 'var(--psa-dark)'}`,
                  transition: 'all var(--transition-base)'
                }}>
                  {step < currentStep ? <Check size={20} /> : step}
                </div>
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: step <= currentStep ? 'var(--psa-secondary)' : 'var(--psa-gray)',
                  fontWeight: step === currentStep ? '600' : '400'
                }}>
                  {['Basic Info', 'Current Role', 'Skills', 'Interests'][step - 1]}
                </div>
              </div>
            ))}
          </div>

          {/* Main Form Card */}
          <div className="card" style={{ padding: '2.5rem' }}>
            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(162, 150, 202, 0.2)',
              gap: '2rem'
            }}>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="btn btn-outline"
                style={{
                  visibility: currentStep === 1 ? 'hidden' : 'visible',
                  minWidth: '120px'
                }}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div style={{ 
                fontSize: '0.95rem', 
                color: 'var(--psa-secondary)',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1.5rem',
                background: 'rgba(162, 150, 202, 0.1)',
                borderRadius: '20px',
                whiteSpace: 'nowrap'
              }}>
                Step {currentStep} of {totalSteps}
              </div>

              <button
                onClick={handleNext}
                disabled={!validateStep() || loading}
                className="btn btn-primary"
                style={{ minWidth: '120px' }}
              >
                {loading ? (
                  'Saving...'
                ) : currentStep === totalSteps ? (
                  <>
                    Complete Setup
                    <Check size={20} />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Skip Option */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-ghost"
              style={{ fontSize: '0.9rem' }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSetup;