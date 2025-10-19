// ============================================
// CAREER LIFT PAGE - COMPLETE
// ============================================
// File: src/components/Explore/CareerLiftPage.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Layout from '../Shared/layout';
import CareerLift from './CareerLift';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile } from '../../services/dataService';

const CareerLiftPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

      const { data: profile } = await getCompleteUserProfile(user.id);
      setUserData(profile);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
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
            <TrendingUp size={48} color="var(--psa-secondary)" style={{
              animation: 'bounce 1s infinite'
            }} />
            <p style={{ marginTop: '1rem', color: 'var(--psa-secondary)' }}>
              Loading career elevator...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem 0' }}>
        {/* Header with Back Button */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/explore')}
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(162, 150, 202, 0.2)',
              border: '2px solid var(--psa-secondary)',
              borderRadius: '8px',
              color: 'var(--psa-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={20} />
            Back to Map
          </button>
          
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--psa-white)',
              margin: 0
            }}>
              Career Progression Lift
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--psa-gray)', margin: '0.25rem 0 0 0' }}>
              Explore vertical career advancement opportunities
            </p>
          </div>
        </div>

        {/* Career Lift Component */}
        <CareerLift
          currentRole={userData?.user_role}
          department={userData?.department}
          skills={userData?.skills || []}
        />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </Layout>
  );
};

export default CareerLiftPage;