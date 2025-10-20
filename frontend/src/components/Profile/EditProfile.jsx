import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Briefcase, Award, Target, Trash2, Edit2, X } from 'lucide-react';
import Layout from '../Shared/layout';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile, updateUserProfile, addUserSkill, deleteUserSkill, updateUserSkillProficiency } from '../../services/dataService';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState(null);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showEditSkillModal, setShowEditSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    employee_id: '',
    user_role: '',
    department: '',
    hire_date: '',
    interests: []
  });

  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    function_area: '',
    proficiency_level: 3
  });

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
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const { data, error } = await getCompleteUserProfile(user.id);
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setUserData(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        employee_id: data.employee_id || '',
        user_role: data.user_role || '',
        department: data.department || '',
        hire_date: data.hire_date?.split('T')[0] || '',
        interests: data.interests || []
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const user = await getCurrentUser();

      // Prepare update data - only include fields that exist in users table
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        employee_id: formData.employee_id,
        user_role: formData.user_role,
        department: formData.department,
        interests: formData.interests
      };

      // Only include hire_date if it's not empty
      if (formData.hire_date) {
        updateData.hire_date = formData.hire_date;
      }

      console.log('Saving profile data:', updateData);

      const { data, error } = await updateUserProfile(user.id, updateData);

      if (error) {
        console.error('Error details:', error);
        alert(`Failed to save changes: ${error}`);
        return;
      }

      console.log('Save successful:', data);
      //alert('Profile updated successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Catch error:', error);
      alert(`An error occurred: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    try {
      if (!newSkill.skill_name || !newSkill.function_area) {
        alert('Please fill in all fields');
        return;
      }

      const user = await getCurrentUser();
      const { error } = await addUserSkill(user.id, {
        function_area: newSkill.function_area,
        specialization: newSkill.function_area,
        skill_name: newSkill.skill_name,
        proficiency_level: newSkill.proficiency_level
      });

      if (error) {
        console.error('Error adding skill:', error);
        alert('Failed to add skill');
        return;
      }

      await loadUserData();
      setShowAddSkillModal(false);
      setNewSkill({ skill_name: '', function_area: '', proficiency_level: 3 });

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding skill');
    }
  };

  const handleEditSkill = async () => {
    try {
      if (!editingSkill) return;

      const user = await getCurrentUser();
      const { error } = await updateUserSkillProficiency(
        user.id,
        editingSkill.skill_name,
        editingSkill.proficiency_level
      );

      if (error) {
        console.error('Error updating skill:', error);
        alert('Failed to update skill');
        return;
      }

      await loadUserData();
      setShowEditSkillModal(false);
      setEditingSkill(null);

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating skill');
    }
  };

  const handleDeleteSkill = async (skillName) => {
    if (!window.confirm(`Delete skill "${skillName}"?`)) return;

    try {
      const user = await getCurrentUser();
      const { error } = await deleteUserSkill(user.id, skillName);

      if (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill');
        return;
      }

      await loadUserData();

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting skill');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Loading...
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'interests', label: 'Interests', icon: Target }
  ];

  return (
    <Layout>
      <div style={{ padding: '2rem 0', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'var(--psa-accent)',
                border: 'none',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--psa-white)'
              }}
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
              Edit Profile
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '2px solid var(--psa-accent)',
          paddingBottom: '0.5rem'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--psa-secondary)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--psa-dark)' : 'var(--psa-white)',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '2rem' }}>
          {activeTab === 'personal' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Personal Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="form-input"
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Employment Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    name="user_role"
                    value={formData.user_role}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Operations Manager"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input form-select"
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hire Date</label>
                  <input
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ fontSize: '1.5rem' }}>Skills & Expertise</h2>
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Award size={18} />
                  Add Skill
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {userData?.skills?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1rem',
                      background: 'var(--psa-accent)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                        {skill.skill_name}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        {skill.function_area}
                      </div>
                      <div style={{ 
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          background: 'var(--psa-dark)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(skill.proficiency_level / 5) * 100}%`,
                            height: '100%',
                            background: 'var(--psa-secondary)'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.85rem' }}>
                          {skill.proficiency_level}/5
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        onClick={() => {
                          setEditingSkill(skill);
                          setShowEditSkillModal(true);
                        }}
                        style={{
                          background: 'var(--psa-secondary)',
                          color: 'var(--psa-dark)',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.skill_name)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(!userData?.skills || userData.skills.length === 0) && (
                <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
                  No skills added yet. Click "Add Skill" to get started.
                </p>
              )}
            </div>
          )}

          {activeTab === 'interests' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Areas of Interest
              </h2>
              <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
                Select areas you're interested in developing (helps with mentor matching)
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
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Skill Modal */}
        {showAddSkillModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ 
              padding: '2rem', 
              maxWidth: '600px', 
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ fontSize: '1.5rem' }}>Add New Skill</h2>
                <button
                  onClick={() => {
                    setShowAddSkillModal(false);
                    setNewSkill({ skill_name: '', function_area: '', proficiency_level: 3 });
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--psa-white)'
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Department/Function Area</label>
                <select
                  value={newSkill.function_area}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, function_area: e.target.value, skill_name: '' }))}
                  className="form-input form-select"
                >
                  <option value="">Select a department</option>
                  {Object.keys(skillsByDepartment).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {newSkill.function_area && (
                <>
                  <div className="form-group">
                    <label className="form-label">Skill</label>
                    <select
                      value={newSkill.skill_name}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, skill_name: e.target.value }))}
                      className="form-input form-select"
                    >
                      <option value="">Select a skill</option>
                      {skillsByDepartment[newSkill.function_area].map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Proficiency Level: {newSkill.proficiency_level}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={newSkill.proficiency_level}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency_level: parseInt(e.target.value) }))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      marginTop: '0.5rem',
                      opacity: 0.7
                    }}>
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => {
                    setShowAddSkillModal(false);
                    setNewSkill({ skill_name: '', function_area: '', proficiency_level: 3 });
                  }}
                  className="btn"
                  style={{ flex: 1, background: 'var(--psa-accent)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSkill}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!newSkill.skill_name || !newSkill.function_area}
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Skill Modal */}
        {showEditSkillModal && editingSkill && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ 
              padding: '2rem', 
              maxWidth: '500px', 
              width: '90%'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ fontSize: '1.5rem' }}>Edit Skill</h2>
                <button
                  onClick={() => {
                    setShowEditSkillModal(false);
                    setEditingSkill(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--psa-white)'
                  }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {editingSkill.skill_name}
                </div>
                <div style={{ opacity: 0.7 }}>
                  {editingSkill.function_area}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Proficiency Level: {editingSkill.proficiency_level}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={editingSkill.proficiency_level}
                  onChange={(e) => setEditingSkill(prev => ({ ...prev, proficiency_level: parseInt(e.target.value) }))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem',
                  opacity: 0.7
                }}>
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => {
                    setShowEditSkillModal(false);
                    setEditingSkill(null);
                  }}
                  className="btn"
                  style={{ flex: 1, background: 'var(--psa-accent)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSkill}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditProfile;