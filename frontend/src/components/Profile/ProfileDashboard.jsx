// Main dashboard showing user's "Home Port"
// Displays: Current role, skills, achievements, learning progress

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ship, 
  MapPin, 
  Briefcase, 
  Award, 
  TrendingUp, 
  BookOpen,
  Users,
  Heart,
  Edit,
  Plus,
  ChevronRight
} from 'lucide-react';
import Layout from '../Shared/layout';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile, addUserSkill } from '../../services/dataService';
import '../../styles/maritime-theme.css';

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    proficiency_level: 3,
    category: ''
  });

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current authenticated user
      const user = await getCurrentUser();
      
      if (!user) {
        navigate('/signin');
        return;
      }

      // Get complete profile with all related data
      const { data, error } = await getCompleteUserProfile(user.id);
      
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setUserData(data);
      
      // Calculate profile completion percentage
      const completion = calculateProfileCompletion(data);
      setProfileCompletion(completion);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate how complete the user's profile is
  const calculateProfileCompletion = (data) => {
    let completed = 0;
    let total = 4;

    if (data.first_name && data.last_name) completed++;
    if (data.user_role) completed++;
    if (data.department) completed++;
    if (data.skills && data.skills.length > 0) completed++;
    //if (data.achievements && data.achievements.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleAddSkill = async () => {
    try {
      const user = await getCurrentUser();
      
      const skillData = {
        function_area: userData?.department || 'General',
        specialization: newSkill.category || userData?.department,
        skill_name: newSkill.skill_name,
        proficiency_level: newSkill.proficiency_level
      };

      const { error } = await addUserSkill(user.id, skillData);
      
      if (error) {
        console.error('Error adding skill:', error);
        return;
      }

      // Reload profile
      await loadUserData();
      
      // Close modal and reset
      setShowAddSkillModal(false);
      setNewSkill({ skill_name: '', proficiency_level: 3, category: '' });
      
    } catch (error) {
      console.error('Error:', error);
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
          <div style={{ textAlign: 'center' }}>
            <Ship size={48} color="var(--psa-secondary)" className="sailing-icon" />
            <p style={{ marginTop: '1rem', color: 'var(--psa-secondary)' }}>
              Loading your voyage...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem 0' }}>
        {/* Welcome Header with Maritime Theme */}
        <div className="card card-gradient" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <Ship size={32} className="sailing-icon" />
                Welcome aboard, {userData?.first_name || 'Navigator'}!
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                Your journey continues at PSA
              </p>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <div style={{
            background: 'var(--psa-warning)',
            color: 'var(--psa-dark)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <strong>Complete your profile to unlock AI-powered recommendations</strong>
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.9rem' 
              }}>
                Profile {profileCompletion}% complete
              </div>
              <div className="progress-bar" style={{ marginTop: '0.5rem', maxWidth: '300px' }}>
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/setup')}
              className="btn btn-primary"
            >
              Complete Now
            </button>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
          {/* Left Column - Current Position & Stats */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Current Port (Role) Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={24} />
                  Your Home Port
                </h2>
              </div>
              <div className="card-body">
                <div className="port-indicator">
                  <div className="port-indicator-icon">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      {userData?.user_role || 'Not Set'}
                    </h3>
                    <p style={{ color: 'var(--psa-secondary)', fontSize: '1rem' }}>
                      {userData?.department || 'Department Not Set'}
                    </p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                      Sailing since {userData?.hire_date ? new Date(userData.hire_date).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '1rem',
                  marginTop: '1.5rem'
                }}>
                  <div style={{
                    background: 'var(--psa-accent)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--psa-secondary)' }}>
                      {userData?.skills?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Skills</div>
                  </div>
                  <div style={{
                    background: 'var(--psa-accent)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--psa-secondary)' }}>
                      {userData?.achievements?.length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Achievements</div>
                  </div>
                  <div style={{
                    background: 'var(--psa-accent)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--psa-secondary)' }}>
                      {userData?.learningProgress?.filter(p => p.progress_percentage === 100).length || 0}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Completed Courses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Skills */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={24} />
                  Your Skills
                </h2>
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Plus size={18} />
                  Add Skill
                </button>
              </div>
              <div className="card-body">
                {userData?.skills && userData.skills.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {userData.skills.slice(0, 5).map((skill, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: 'var(--psa-accent)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '500' }}>{skill.skill_name}</div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem' }}>
                            {skill.function_area}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '0.25rem'
                        }}>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              style={{
                                width: '8px',
                                height: '24px',
                                background: level <= (skill.proficiency_level || 3) 
                                  ? 'var(--psa-secondary)' 
                                  : 'var(--psa-dark)',
                                borderRadius: '2px'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    {userData.skills.length > 5 && (
                      <button
                        onClick={() => navigate('/profile/skills')}
                        className="btn btn-ghost"
                        style={{ marginTop: '0.5rem' }}
                      >
                        View all {userData.skills.length} skills
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.8 }}>
                    <TrendingUp size={48} color="var(--psa-secondary)" style={{ marginBottom: '1rem' }} />
                    <p>No skills added yet</p>
                    <button
                      onClick={() => navigate('/profile/skills/add')}
                      className="btn btn-primary"
                      style={{ marginTop: '1rem' }}
                    >
                      Add Your First Skill
                    </button>
                  </div>
                )}
              </div>
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
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div className="card" style={{ 
                  maxWidth: '500px', 
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}>
                  <div className="card-header">
                    <h2 className="card-title">Add New Skill</h2>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                          Skill Name
                        </label>
                        <input
                          type="text"
                          value={newSkill.skill_name}
                          onChange={(e) => setNewSkill(prev => ({
                            ...prev,
                            skill_name: e.target.value
                          }))}
                          className="input"
                          placeholder="e.g., JavaScript, Project Management"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                          Category
                        </label>
                        <select
                          value={newSkill.category}
                          onChange={(e) => setNewSkill(prev => ({
                            ...prev,
                            category: e.target.value
                          }))}
                          className="input"
                        >
                          <option value="">Select Category</option>
                          <option value="Technical">Technical</option>
                          <option value="Leadership">Leadership</option>
                          <option value="Communication">Communication</option>
                          <option value="Domain Knowledge">Domain Knowledge</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                          Proficiency Level: {newSkill.proficiency_level}/5
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={newSkill.proficiency_level}
                          onChange={(e) => setNewSkill(prev => ({
                            ...prev,
                            proficiency_level: parseInt(e.target.value)
                          }))}
                          style={{ width: '100%' }}
                        />
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: '0.8rem',
                          color: '#888',
                          marginTop: '0.25rem'
                        }}>
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(162, 150, 202, 0.2)'
                    }}>
                      <button
                        onClick={() => setShowAddSkillModal(false)}
                        className="btn btn-outline"
                        style={{ flex: 1 }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSkill}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        disabled={!newSkill.skill_name}
                      >
                        Add Skill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Learning Progress */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={24} />
                  Learning in Progress
                </h2>
              </div>
              <div className="card-body">
                {userData?.learningProgress && userData.learningProgress.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {userData.learningProgress
                      .filter(course => course.progress_percentage < 100)
                      .slice(0, 3)
                      .map((course, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '1rem',
                            background: 'var(--psa-accent)',
                            borderRadius: 'var(--radius-md)'
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{ fontWeight: '500' }}>{course.course_name}</div>
                            <div style={{ color: 'var(--psa-secondary)', fontWeight: '600' }}>
                              {course.progress_percentage}%
                            </div>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${course.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.8 }}>
                    <BookOpen size={48} color="var(--psa-secondary)" style={{ marginBottom: '1rem' }} />
                    <p>No courses in progress</p>
                    <button
                      onClick={() => navigate('/explore')}
                      className="btn btn-primary"
                      style={{ marginTop: '1rem' }}
                    >
                      Explore Learning Paths
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Recent Achievements */}
          <div>
            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => navigate('/explore')}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <MapPin size={18} />
                    Explore Pathways
                  </button>
                  <button
                    onClick={() => navigate('/mentors')}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <Users size={18} />
                    Find a Mentor
                  </button>
                  <button
                    onClick={() => navigate('/ai-chat')}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <Ship size={18} />
                    Ask AI Navigator
                  </button>
                  <button
                    onClick={() => navigate('/wellbeing')}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <Heart size={18} />
                    Check Tide Gauge
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} />
                  Recent Achievements
                </h3>
              </div>
              <div className="card-body">
                {userData?.achievements && userData.achievements.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {userData.achievements.slice(0, 5).map((achievement, index) => (
                      <div
                        key={index}
                        className="achievement-badge"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <Award size={24} color="var(--psa-secondary)" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                            {achievement.badge_name}
                          </div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate('/achievements')}
                      className="btn btn-ghost btn-sm"
                      style={{ marginTop: '0.5rem' }}
                    >
                      View All
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', opacity: 0.8 }}>
                    <Award size={40} color="var(--psa-secondary)" style={{ marginBottom: '0.75rem' }} />
                    <p style={{ fontSize: '0.9rem' }}>
                      Start learning to earn achievements!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileDashboard;