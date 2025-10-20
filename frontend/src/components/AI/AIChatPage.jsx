import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Sparkles, Loader, Bot, User, ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '../../services/supabaseClient';
import { getCompleteUserProfile } from '../../services/dataService';
import { chatWithAI } from '../../services/openaiService';

/**
 * AI Chat Page - Full Screen Chatbot Experience
 * No Layout wrapper - takes up entire screen
 */
const AIChatPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    "Help me create a development plan",
    "What skills should I learn next?",
    "Show me career advancement tips",
    "I need work-life balance advice",
    "Recommend courses for me"
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userData && messages.length === 0) {
      // Add welcome message after user data loads
      setMessages([
        {
          role: 'assistant',
          content: `Hi ${userData.first_name}! 👋 I'm your AI career assistant at PSA Pathways.\n\nI can help you with:\n• Career planning and pathways\n• Skill development recommendations\n• Internal mobility opportunities\n• Mental wellbeing support\n• Course suggestions\n\nWhat would you like to explore today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [userData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isTyping) return;

    const userMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare conversation history - extract only role and content
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call AI service - pass message and history separately
      const response = await chatWithAI(textToSend, conversationHistory);

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      
      const errorMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2b1d5a 0%, #1d161e 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Loader className="spin" size={48} color="var(--psa-secondary)" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2b1d5a 0%, #1d161e 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(162, 150, 202, 0.1)',
        borderBottom: '2px solid rgba(162, 150, 202, 0.3)',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: '2px solid var(--psa-secondary)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: 'var(--psa-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--psa-secondary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--psa-secondary)';
            }}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #9B59B6 0%, #A296ca 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={28} color="#fff" />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#fff',
                margin: 0
              }}>
                AI Career Assistant
              </h1>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                {isTyping ? 'Typing...' : 'Online • Ready to help'}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(162, 150, 202, 0.2)',
            borderRadius: '8px',
            border: '1px solid rgba(162, 150, 202, 0.4)'
          }}>
            Logged in as: {userData?.first_name} {userData?.last_name}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #4c1c46 0%, #2b1d5a 100%)'
                  : 'linear-gradient(135deg, var(--psa-secondary) 0%, #9B59B6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? (
                  <User size={22} color="#fff" />
                ) : (
                  <Bot size={22} color="#fff" />
                )}
              </div>

              {/* Message Bubble */}
              <div style={{
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  background: msg.role === 'user'
                    ? 'var(--psa-secondary)'
                    : msg.isError
                    ? 'rgba(244, 67, 54, 0.2)'
                    : 'rgba(162, 150, 202, 0.15)',
                  border: msg.isError ? '1px solid rgba(244, 67, 54, 0.4)' : 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {msg.content}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  padding: '0 0.5rem'
                }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--psa-secondary) 0%, #9B59B6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={22} color="#fff" />
              </div>
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                background: 'rgba(162, 150, 202, 0.15)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <div className="typing-dot" style={{ animationDelay: '0s' }} />
                <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div style={{
          padding: '1rem 2rem',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto'
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '0.75rem'
          }}>
            Quick actions to get started:
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                disabled={isTyping}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(162, 150, 202, 0.2)',
                  border: '2px solid rgba(162, 150, 202, 0.4)',
                  borderRadius: '24px',
                  color: '#A296ca',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: isTyping ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isTyping ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isTyping) {
                    e.currentTarget.style.background = 'var(--psa-secondary)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(162, 150, 202, 0.2)';
                  e.currentTarget.style.color = '#A296ca';
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={{
        padding: '1.5rem 2rem 2rem',
        borderTop: '2px solid rgba(162, 150, 202, 0.2)',
        background: 'rgba(162, 150, 202, 0.05)',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isTyping}
            style={{
              flex: 1,
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(162, 150, 202, 0.3)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'none',
              minHeight: '56px',
              maxHeight: '150px',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--psa-secondary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(162, 150, 202, 0.3)'}
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            style={{
              padding: '1rem 2rem',
              background: (!input.trim() || isTyping)
                ? 'rgba(162, 150, 202, 0.3)'
                : 'linear-gradient(135deg, var(--psa-secondary) 0%, #9B59B6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              opacity: (!input.trim() || isTyping) ? 0.5 : 1,
              minWidth: '120px'
            }}
          >
            {isTyping ? (
              <>
                <Loader className="spin" size={20} />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send
              </>
            )}
          </button>
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
        
        @keyframes typing-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .typing-dot {
          width: 10px;
          height: 10px;
          background: var(--psa-secondary);
          borderRadius: 50%;
          animation: typing-pulse 1.4s ease-in-out infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIChatPage;