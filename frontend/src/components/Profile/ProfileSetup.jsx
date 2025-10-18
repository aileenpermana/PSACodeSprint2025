// Multi-step onboarding for new users
// Collects: Basic info, current role, skills, interests

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { getCurrentUser } from '../../services/supabaseClient';
import { createUserProfile, addUserSkill } from '../../services/dataService';
import Layout from '../Shared/layout';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
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

  // Submit profile
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Create user profile
      const profileData = {
        email: user.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        employee_id: formData.employee_id,
        user_role: formData.user_role,
        department: formData.department,
        hire_date: formData.hire_date || new Date().toISOString()
      };

      const { error: profileError } = await createUserProfile(user.id, profileData);
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return;
      }

      // Add selected skills
      for (const skill of formData.selectedSkills) {
        await addUserSkill(user.id, {
          function_area: formData.department,
          specialization: formData.department,
          skill_name: skill,
          proficiency_level: 3 // Default proficiency
        });
      }

      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error:', error);
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
              Select the skills you currently have (select at least 1)
            </p>

            {formData.department && skillsByDepartment[formData.department] ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {skillsByDepartment[formData.department].map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: '1rem',
                      background: formData.selectedSkills.includes(skill) 
                        ? 'var(--psa-secondary)' 
                        : 'var(--psa-accent)',
                      color: formData.selectedSkills.includes(skill) 
                        ? 'var(--psa-dark)' 
                        : 'var(--psa-white)',
                      border: `2px solid ${formData.selectedSkills.includes(skill) ? 'var(--psa-secondary)' : 'transparent'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      transition: 'all var(--transition-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{skill}</span>
                    {formData.selectedSkills.includes(skill) && <Check size={18} />}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.8 }}>
                Please select a department in the previous step
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
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(162, 150, 202, 0.2)'
            }}>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="btn btn-outline"
                style={{
                  visibility: currentStep === 1 ? 'hidden' : 'visible'
                }}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div style={{ 
                fontSize: '0.9rem', 
                color: 'var(--psa-gray)',
                display: 'flex',
                alignItems: 'center'
              }}>
                Step {currentStep} of {totalSteps}
              </div>

              <button
                onClick={handleNext}
                disabled={!validateStep() || loading}
                className="btn btn-primary"
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