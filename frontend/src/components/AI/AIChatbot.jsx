import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader, Bot, User } from 'lucide-react';
import { chatWithAI } from '../../services/openaiService';

/**
 * AI Chatbot Component
 * Conversational AI assistant for career guidance and support
 */
const AIChatbot = ({ onClose, userData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userData?.first_name || 'there'}! 👋 I'm your AI career assistant at PSA Pathways.\n\nI can help you with:\n• Career planning and pathways\n• Skill development recommendations\n• Internal mobility opportunities\n• Mental wellbeing support\n• Course suggestions\n\nWhat would you like to explore today?`,
      timestamp: new Date()
    }
  ]);
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
    scrollToBottom();
  }, [messages]);

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
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add context about the user
      const contextMessage = {
        role: 'system',
        content: `User context: ${userData?.first_name || 'User'} is a ${userData?.user_role || 'employee'} in ${userData?.department || 'PSA'}.`
      };

      // Call AI service
      const response = await chatWithAI(textToSend, [contextMessage, ...conversationHistory]);

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
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. You can also explore the platform manually or contact HR support if you need immediate assistance.",
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

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '450px',
      height: '650px',
      background: 'linear-gradient(135deg, #2b1d5a 0%, #1d161e 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(162, 150, 202, 0.4)',
      border: '2px solid var(--psa-secondary)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--psa-secondary)',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid rgba(162, 150, 202, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #9B59B6 0%, #A296ca 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#fff',
              margin: 0
            }}>
              AI Career Assistant
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.5rem',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
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
                <User size={18} color="#fff" />
              ) : (
                <Bot size={18} color="#fff" />
              )}
            </div>

            {/* Message Bubble */}
            <div style={{
              maxWidth: '75%',
              padding: '0.875rem 1.125rem',
              borderRadius: '12px',
              background: msg.role === 'user'
                ? 'var(--psa-secondary)'
                : msg.isError
                ? 'rgba(244, 67, 54, 0.2)'
                : 'rgba(162, 150, 202, 0.15)',
              border: msg.isError ? '1px solid rgba(244, 67, 54, 0.4)' : 'none',
              color: '#fff',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {msg.content}
              <div style={{
                fontSize: '0.7rem',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '0.5rem',
                textAlign: msg.role === 'user' ? 'right' : 'left'
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
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--psa-secondary) 0%, #9B59B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={18} color="#fff" />
            </div>
            <div style={{
              padding: '0.875rem 1.125rem',
              borderRadius: '12px',
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

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div style={{
          padding: '0 1.5rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action)}
              disabled={isTyping}
              style={{
                padding: '0.5rem 0.75rem',
                background: 'rgba(162, 150, 202, 0.2)',
                border: '1px solid rgba(162, 150, 202, 0.4)',
                borderRadius: '20px',
                color: '#A296ca',
                fontSize: '0.75rem',
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
      )}

      {/* Input Area */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '2px solid rgba(162, 150, 202, 0.2)',
        background: 'rgba(162, 150, 202, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isTyping}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(162, 150, 202, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'none',
              minHeight: '44px',
              maxHeight: '100px',
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
              padding: '0.875rem 1.25rem',
              background: (!input.trim() || isTyping)
                ? 'rgba(162, 150, 202, 0.3)'
                : 'var(--psa-secondary)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              opacity: (!input.trim() || isTyping) ? 0.5 : 1
            }}
          >
            {isTyping ? (
              <Loader className="spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes typing-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          background: var(--psa-secondary);
          border-radius: 50%;
          animation: typing-pulse 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AIChatbot;