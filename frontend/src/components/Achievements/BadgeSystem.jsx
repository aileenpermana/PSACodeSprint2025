// frontend/src/components/Achievements/BadgeSystem.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Trophy, Star, Target, TrendingUp, Users, BookOpen, Heart, Zap, Shield, Anchor, Ship } from 'lucide-react';
import Layout from '../Shared/layout';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile } from '../../services/dataService';

const BadgeSystem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

      const { data } = await getCompleteUserProfile(user.id);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Badge definitions with maritime theme
  const allBadges = [
    // Learning Badges
    {
      id: 'first_voyage',
      name: 'First Voyage',
      description: 'Complete your first learning course',
      category: 'learning',
      icon: Ship,
      color: '#60a5fa',
      requirement: 'Complete 1 course',
      earned: userData?.achievements?.some(a => a.badge_name === 'First Voyage') || false
    },
    {
      id: 'seasoned_navigator',
      name: 'Seasoned Navigator',
      description: 'Complete 5 learning courses',
      category: 'learning',
      icon: Anchor,
      color: '#4ade80',
      requirement: 'Complete 5 courses',
      earned: userData?.achievements?.some(a => a.badge_name === 'Seasoned Navigator') || false
    },
    {
      id: 'master_explorer',
      name: 'Master Explorer',
      description: 'Complete 10 learning courses',
      category: 'learning',
      icon: Trophy,
      color: '#fbbf24',
      requirement: 'Complete 10 courses',
      earned: false
    },
    
    // Consistency Badges
    {
      id: 'steady_sailor',
      name: 'Steady Sailor',
      description: 'Maintain learning streak for 4 weeks',
      category: 'consistency',
      icon: Target,
      color: '#a78bfa',
      requirement: '4 week learning streak',
      earned: userData?.achievements?.some(a => a.badge_name === 'Steady Sailor') || false
    },
    {
      id: 'lighthouse_keeper',
      name: 'Lighthouse Keeper',
      description: 'Maintain learning streak for 12 weeks',
      category: 'consistency',
      icon: Zap,
      color: '#f59e0b',
      requirement: '12 week learning streak',
      earned: false
    },
    
    // Mentorship Badges
    {
      id: 'guiding_star',
      name: 'Guiding Star',
      description: 'Mentor your first crew member',
      category: 'mentorship',
      icon: Star,
      color: '#fbbf24',
      requirement: 'Mentor 1 person',
      earned: userData?.mentorships?.asMentor?.length > 0 || false
    },
    {
      id: 'fleet_captain',
      name: 'Fleet Captain',
      description: 'Successfully mentor 3 crew members',
      category: 'mentorship',
      icon: Users,
      color: '#ec4899',
      requirement: 'Mentor 3 people',
      earned: userData?.mentorships?.asMentor?.length >= 3 || false
    },
    {
      id: 'admiral',
      name: 'Admiral',
      description: 'Lead a mentorship fleet of 5+',
      category: 'mentorship',
      icon: Shield,
      color: '#8b5cf6',
      requirement: 'Mentor 5 people',
      earned: userData?.mentorships?.asMentor?.length >= 5 || false
    },
    
    // Leadership Badges
    {
      id: 'emerging_leader',
      name: 'Emerging Leader',
      description: 'Achieve leadership score above 40',
      category: 'leadership',
      icon: TrendingUp,
      color: '#3b82f6',
      requirement: 'Leadership score > 40',
      earned: false
    },
    {
      id: 'rising_tide',
      name: 'Rising Tide',
      description: 'Achieve leadership score above 70',
      category: 'leadership',
      icon: Award,
      color: '#06b6d4',
      requirement: 'Leadership score > 70',
      earned: false
    },
    {
      id: 'master_navigator',
      name: 'Master Navigator',
      description: 'Achieve leadership score above 85',
      category: 'leadership',
      icon: Trophy,
      color: '#f59e0b',
      requirement: 'Leadership score > 85',
      earned: false
    },
    
    // Wellbeing Badges
    {
      id: 'calm_waters',
      name: 'Calm Waters',
      description: 'Complete 5 wellbeing check-ins',
      category: 'wellbeing',
      icon: Heart,
      color: '#ef4444',
      requirement: 'Complete 5 check-ins',
      earned: false
    },
    {
      id: 'balanced_voyage',
      name: 'Balanced Voyage',
      description: 'Complete 20 wellbeing check-ins',
      category: 'wellbeing',
      icon: Heart,
      color: '#f43f5e',
      requirement: 'Complete 20 check-ins',
      earned: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Badges', icon: Award },
    { id: 'learning', name: 'Learning', icon: BookOpen },
    { id: 'consistency', name: 'Consistency', icon: Target },
    { id: 'mentorship', name: 'Mentorship', icon: Users },
    { id: 'leadership', name: 'Leadership', icon: TrendingUp },
    { id: 'wellbeing', name: 'Wellbeing', icon: Heart }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? allBadges 
    : allBadges.filter(b => b.category === selectedCategory);

  const earnedCount = allBadges.filter(b => b.earned).length;
  const totalCount = allBadges.length;
  const completionPercentage = Math.round((earnedCount / totalCount) * 100);

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <p style={{ color: 'var(--psa-secondary)' }}>Loading badges...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Trophy size={40} color="var(--psa-secondary)" />
            Achievement Badges
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--psa-gray)' }}>
            Earn badges as you navigate your career journey
          </p>
        </div>

        {/* Progress Overview */}
        <div className="card" style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(162, 150, 202, 0.1) 0%, rgba(162, 150, 202, 0.05) 100%)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `conic-gradient(var(--psa-secondary) ${completionPercentage * 3.6}deg, var(--psa-accent) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'var(--psa-dark)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--psa-secondary)' }}>
                  {completionPercentage}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--psa-gray)' }}>Complete</div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Collection Progress
              </h2>
              <p style={{ color: 'var(--psa-gray)', marginBottom: '1rem' }}>
                You've earned {earnedCount} out of {totalCount} available badges
              </p>
              <div style={{
                width: '100%',
                height: '12px',
                background: 'var(--psa-accent)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  background: 'var(--psa-secondary)',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Trophy size={48} color="var(--psa-secondary)" />
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginTop: '0.5rem' }}>
                {earnedCount}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--psa-gray)' }}>Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: selectedCategory === cat.id ? 'var(--psa-secondary)' : 'var(--psa-accent)',
                  color: selectedCategory === cat.id ? 'var(--psa-dark)' : 'var(--psa-white)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Badge Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredBadges.map(badge => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  opacity: badge.earned ? 1 : 0.5,
                  border: badge.earned ? `2px solid ${badge.color}` : '1px solid rgba(162, 150, 202, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {badge.earned && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: badge.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Award size={18} color="var(--psa-dark)" />
                  </div>
                )}

                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: badge.earned 
                    ? `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}AA 100%)`
                    : 'var(--psa-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: badge.earned ? `0 0 20px ${badge.color}66` : 'none'
                }}>
                  <Icon size={40} color={badge.earned ? 'var(--psa-dark)' : 'var(--psa-gray)'} />
                </div>

                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  color: badge.earned ? badge.color : 'var(--psa-gray)'
                }}>
                  {badge.name}
                </h3>

                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--psa-gray)',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  minHeight: '2.7rem'
                }}>
                  {badge.description}
                </p>

                <div style={{
                  padding: '0.5rem',
                  background: 'var(--psa-accent)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--psa-gray)'
                }}>
                  {badge.earned ? '✓ Earned' : badge.requirement}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default BadgeSystem;