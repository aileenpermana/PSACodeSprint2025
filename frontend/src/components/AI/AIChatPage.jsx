import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Shared/layout';
import AIChatbot from './AIChatbot';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile } from '../../services/dataService';

/**
 * AI Chat Page
 * Full-page wrapper for the AI Chatbot
 */
const AIChatPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
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

  const handleClose = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}>
          <div style={{ color: 'var(--psa-secondary)' }}>Loading AI Assistant...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showNavigation={true}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <AIChatbot 
          userData={userData} 
          onClose={handleClose}
        />
      </div>
    </Layout>
  );
};

export default AIChatPage;