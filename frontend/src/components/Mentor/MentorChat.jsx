import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import Layout from '../Shared/layout';
import { getCurrentUser } from '../../services/supabaseClient';
import { getChatHistory, sendMessage, getCompleteUserProfile } from '../../services/dataService';

const MentorChat = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatData();
    const interval = setInterval(loadMessages, 3000); // Poll for new messages every 3 seconds
    return () => clearInterval(interval);
  }, [mentorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/signin');
        return;
      }
      setCurrentUser(user);

      const { data: mentorProfile } = await getCompleteUserProfile(mentorId);
      setMentor(mentorProfile);

      await loadMessages();
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { data } = await getChatHistory(user.id, mentorId);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const messageText = newMessage.trim();
      setNewMessage('');

      await sendMessage(currentUser.id, mentorId, messageText);
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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
          <div style={{ color: 'var(--psa-secondary)' }}>Loading chat...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        height: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--psa-accent)',
          borderBottom: '2px solid var(--psa-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/mentors')}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--psa-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ArrowLeft size={24} />
            </button>

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--psa-secondary) 0%, #9b88d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--psa-dark)'
            }}>
              {mentor?.first_name?.[0]}{mentor?.last_name?.[0]}
            </div>

            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                {mentor?.first_name} {mentor?.last_name}
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--psa-gray)'
              }}>
                {mentor?.user_role}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={{
                padding: '0.75rem',
                background: 'transparent',
                border: '2px solid var(--psa-secondary)',
                borderRadius: '8px',
                color: 'var(--psa-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Phone size={20} />
            </button>
            <button
              style={{
                padding: '0.75rem',
                background: 'transparent',
                border: '2px solid var(--psa-secondary)',
                borderRadius: '8px',
                color: 'var(--psa-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Video size={20} />
            </button>
            <button
              style={{
                padding: '0.75rem',
                background: 'transparent',
                border: '2px solid var(--psa-secondary)',
                borderRadius: '8px',
                color: 'var(--psa-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          background: 'var(--psa-dark)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--psa-gray)'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Start a conversation with {mentor?.first_name}
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Send a message to introduce yourself and share your goals
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isCurrentUser = msg.sender_id === currentUser.id;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    animation: 'fadeIn 0.3s ease'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{
                      padding: '0.875rem 1.125rem',
                      borderRadius: isCurrentUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isCurrentUser
                        ? 'linear-gradient(135deg, var(--psa-secondary) 0%, #9b88d4 100%)'
                        : 'var(--psa-accent)',
                      color: isCurrentUser ? 'var(--psa-dark)' : 'var(--psa-white)',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {msg.message_text}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--psa-gray)',
                      textAlign: isCurrentUser ? 'right' : 'left',
                      padding: '0 0.25rem'
                    }}>
                      {formatTime(msg.sent_at)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div style={{
          padding: '1.5rem',
          background: 'var(--psa-accent)',
          borderTop: '1px solid rgba(162, 150, 202, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end'
          }}>
            <button
              style={{
                padding: '0.875rem',
                background: 'transparent',
                border: '2px solid var(--psa-secondary)',
                borderRadius: '12px',
                color: 'var(--psa-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                minWidth: '48px',
                minHeight: '48px'
              }}
            >
              <Paperclip size={20} />
            </button>

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${mentor?.first_name}...`}
              disabled={sending}
              rows={1}
              style={{
                flex: 1,
                padding: '0.875rem 1rem',
                borderRadius: '12px',
                border: '2px solid var(--psa-secondary)',
                background: 'var(--psa-dark)',
                color: 'var(--psa-white)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                minHeight: '48px',
                maxHeight: '120px'
              }}
            />

            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              style={{
                padding: '0.875rem 1.5rem',
                background: (!newMessage.trim() || sending)
                  ? 'var(--psa-accent)'
                  : 'linear-gradient(135deg, var(--psa-secondary) 0%, #9b88d4 100%)',
                border: 'none',
                borderRadius: '12px',
                color: (!newMessage.trim() || sending) ? 'var(--psa-gray)' : 'var(--psa-dark)',
                cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                minWidth: '100px',
                minHeight: '48px',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {sending ? 'Sending...' : (
                <>
                  <Send size={18} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  );
};

export default MentorChat;