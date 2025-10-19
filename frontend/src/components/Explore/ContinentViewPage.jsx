// ============================================
// CONTINENT VIEW PAGE
// ============================================
// File: src/components/Explore/ContinentViewPage.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Map } from 'lucide-react';
import Layout from '../Shared/layout';
import ContinentView from './ContinentView';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile } from '../../services/dataService';

const ContinentViewPage = () => {
  const navigate = useNavigate();
  const { divisionId } = useParams(); // Get division from URL
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

  const handleBackToMap = () => {
    navigate('/explore');
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
            <Map size={48} color="var(--psa-secondary)" style={{
              animation: 'pulse 1.5s infinite'
            }} />
            <p style={{ marginTop: '1rem', color: 'var(--psa-secondary)' }}>
              Loading continent details...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem 0' }}>
        {/* Continent View Component */}
        <ContinentView
          division={divisionId}
          currentDepartment={userData?.department}
          userData={userData}
          onNavigate={handleBackToMap}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Layout>
  );
};

export default ContinentViewPage;