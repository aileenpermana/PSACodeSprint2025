import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader, MessageSquare, Bot } from 'lucide-react';
import { chatWithAI } from '../../services/openaiService';

/**
 * AI Chatbot Component
 * Conversational AI assistant for career guidance and support
 * 
 * @param {function} onClose - Function to close the chatbot
 * @param {object} userData - Current user's profile data
 */
const AIChatbot = ({ onClose, userData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userData?.first_name || 'there'}! 👋 I'm your AI career assistant. I can help you with:\n\n• Career planning and pathways\n• Skill development recommendations\n• Internal mobility opportunities\n• Mental wellbeing support\n• Course suggestions\n\nWhat would you like to explore today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Quick action suggestions
  const quickActions = [
    "Help me create a development plan",
    "What skills should I learn next?",
    "Show me internal opportunities",
    "I'm feeling stressed at work",
    "Career path recommendations",
    "Find me a mentor"
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call AI service
      const response = await chatWithAI(input, conversationHistory);

      // Add AI response
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to explore the platform manually.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100vh',
      maxWidth: '450px',
      backgroundColor: 'var(--psa-dark)',
      borderLeft: '2px solid var(--psa-secondary)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#fff'
            }}>
              AI Career Assistant
            </h3>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Always here to help
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          <X size={20} color="#fff" />
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <div style={{
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <div style={{
                padding: '0.875rem 1rem',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : msg.isError
                  ? 'rgba(255, 59, 48, 0.1)'
                  : 'var(--psa-accent)',
                color: msg.role === 'user' ? '#fff' : 'var(--psa-white)',
                border: msg.isError ? '1px solid rgba(255, 59, 48, 0.3)' : 'none',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.content}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--psa-gray)',
                textAlign: msg.role === 'user' ? 'right' : 'left',
                padding: '0 0.25rem'
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            <div style={{
              padding: '0.875rem 1rem',
              borderRadius: '16px 16px 16px 4px',
              background: 'var(--psa-accent)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.35rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--psa-secondary)',
                  animation: 'bounce 1.4s ease-in-out infinite'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--psa-secondary)',
                  animation: 'bounce 1.4s ease-in-out 0.2s infinite'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--psa-secondary)',
                  animation: 'bounce 1.4s ease-in-out 0.4s infinite'
                }}></div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--psa-gray)' }}>
                AI is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div style={{
          padding: '0 1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--psa-gray)',
            margin: 0,
            marginBottom: '0.25rem'
          }}>
            Quick actions:
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '20px',
                  background: 'var(--psa-accent)',
                  color: 'var(--psa-white)',
                  border: '1px solid var(--psa-secondary)',
                  cursor: isTyping ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isTyping ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isTyping) {
                    e.currentTarget.style.background = 'var(--psa-secondary)';
                    e.currentTarget.style.color = 'var(--psa-dark)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--psa-accent)';
                  e.currentTarget.style.color = 'var(--psa-white)';
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
        padding: '1.25rem',
        borderTop: '1px solid var(--psa-accent)',
        background: 'var(--psa-primary)'
      }}>
        {error && (
          <div style={{
            marginBottom: '0.75rem',
            padding: '0.75rem',
            background: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid rgba(255, 59, 48, 0.3)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#ff3b30'
          }}>
            {error}
          </div>
        )}
        
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your career..."
            disabled={isTyping}
            rows={1}
            style={{
              flex: 1,
              padding: '0.875rem',
              borderRadius: '12px',
              border: '2px solid var(--psa-accent)',
              background: 'var(--psa-dark)',
              color: 'var(--psa-white)',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              minHeight: '44px',
              maxHeight: '120px',
              opacity: isTyping ? 0.6 : 1
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--psa-secondary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--psa-accent)'}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              padding: '0.875rem',
              borderRadius: '12px',
              background: (!input.trim() || isTyping)
                ? 'var(--psa-accent)'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              color: '#fff',
              cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              minWidth: '44px',
              minHeight: '44px',
              opacity: (!input.trim() || isTyping) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isTyping) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isTyping ? (
              <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        
        <p style={{
          margin: '0.75rem 0 0 0',
          fontSize: '0.75rem',
          color: 'var(--psa-gray)',
          textAlign: 'center'
        }}>
          AI can make mistakes. Verify important information.
        </p>
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

        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AIChatbot;