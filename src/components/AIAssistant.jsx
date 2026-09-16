import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, ExternalLink, Calendar, MessageSquare, EyeOff, Send, Map, Users, BookHeart, AlertTriangle, User } from 'lucide-react';
import Draggable from 'react-draggable';
import { trackEvent } from '../utils/tracker';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AIAssistant() {
  const { t } = useTranslation();
  const { showAIAssistant, toggleAIAssistant } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef(null);
  const navigate = useNavigate();

  const toggleChat = () => {
    if (!isOpen && messages.length === 0) {
      startConversation();
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      trackEvent('AI_ASSISTANT_OPENED');
    }
  };

  const startConversation = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{ sender: 'bot', text: '¡Hola! Soy tu asistente inteligente en Free Mind. Puedo guiarte por la plataforma. ¿Qué buscas hoy?' }]);
      setIsTyping(false);
    }, 1000);
  };

  // Intent parsing logic
  const processUserMessage = (text) => {
    setIsTyping(true);
    const lowerText = text.toLowerCase();
    
    setTimeout(() => {
      let botResponse = { sender: 'bot', text: 'No estoy muy seguro de entender eso. ¿Podrías intentar con palabras clave como "citas", "mapa", "foro" o "diario"?' };
      
      if (lowerText.match(/(cita|agendar|experto|psicólogo|psicologo|mapa)/)) {
        botResponse = {
          sender: 'bot',
          text: 'Entendido. Si buscas conectar con un experto de salud mental, tenemos un mapa interactivo por regiones para agendar citas. También puedes ver "Mis citas".',
          action: {
            label: 'Ir al Mapa de Expertos',
            icon: <Map size={16} />,
            path: '/app/expertos'
          }
        };
      } else if (lowerText.match(/(foro|comunidad|hablar|leer|post)/)) {
        botResponse = {
          sender: 'bot',
          text: 'Claro, la comunidad es un espacio seguro para expresarte de manera anónima y apoyarnos entre todos.',
          action: {
            label: 'Ir a la Comunidad',
            icon: <Users size={16} />,
            path: '/app/feed'
          }
        };
      } else if (lowerText.match(/(triste|feliz|diario|emoción|emocion|registro|animo)/)) {
        botResponse = {
          sender: 'bot',
          text: 'Registrar cómo te sientes es un gran paso. En tu diario emocional puedes hacer seguimiento de tu estado de ánimo diario.',
          action: {
            label: 'Ir a mi Diario',
            icon: <BookHeart size={16} />,
            path: '/app/mood'
          }
        };
      } else if (lowerText.match(/(ayuda|sos|peligro|urgente|crisis|suicidio|morir)/)) {
        botResponse = {
          sender: 'bot',
          text: 'Si te encuentras en una situación de crisis o peligro, por favor usa el botón de S.O.S inmediatamente para obtener ayuda profesional urgente.',
          action: {
            label: 'Activar S.O.S',
            icon: <AlertTriangle size={16} />,
            actionType: 'SOS'
          }
        };
      } else if (lowerText.match(/(perfil|donar|apoyo|configuracion|ajustes)/)) {
         botResponse = {
          sender: 'bot',
          text: 'Desde tu perfil puedes ajustar tus opciones. Opcionalmente puedes apoyar a la plataforma.',
          action: {
            label: 'Ver mi Perfil',
            icon: <User size={16} />,
            path: '/app/profile'
          }
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');
    processUserMessage(userMsg);
  };

  const sendQuickReply = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    processUserMessage(text);
  };

  const handleActionClick = (action) => {
    if (action.actionType === 'SOS') {
      navigate('/app/feed?sos=true');
    } else if (action.path) {
      navigate(action.path);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!showAIAssistant) return null;

  return (
    <Draggable bounds="body" cancel=".chat-body, .no-drag, a, input, button">
      <div className="ai-assistant-container">
      
      {isOpen && (
        <div className="glass ai-assistant-popup" style={{ display: 'flex', flexDirection: 'column', height: '400px', width: '320px' }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            padding: '1rem', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Bot size={20} />
              <span>{t('aiAssistant.title')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="no-drag" onClick={toggleAIAssistant} style={{ color: 'rgba(255,255,255,0.7)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }} title="Ocultar Asistente (Reactivalo en tu Perfil)">
                <EyeOff size={18} />
              </button>
              <button className="no-drag" onClick={toggleChat} style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Chat Body */}
          <div ref={chatRef} className="chat-body" style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--bg-color)' }}>
            
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{ 
                  backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface)',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '1rem',
                  borderBottomRightRadius: msg.sender === 'user' ? '0' : '1rem',
                  maxWidth: '85%',
                  fontSize: '0.9rem',
                  border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.text}
                </div>
                
                {msg.action && (
                  <button 
                    className="no-drag"
                    onClick={() => handleActionClick(msg.action)}
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: msg.action.actionType === 'SOS' ? 'var(--bg-danger)' : 'var(--surface-active)',
                      color: msg.action.actionType === 'SOS' ? 'var(--accent-rose)' : 'var(--primary)',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${msg.action.actionType === 'SOS' ? 'var(--border-danger)' : 'var(--primary)'}`,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s ease',
                      maxWidth: '85%'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {msg.action.icon}
                    {msg.action.label}
                  </button>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ 
                alignSelf: 'flex-start',
                backgroundColor: 'var(--surface)',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                borderBottomLeftRadius: '0',
                maxWidth: '85%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                gap: '0.25rem'
              }}>
                <span className="dot-typing" style={{ animationDelay: '0s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="dot-typing" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            )}
          </div>
          {/* Quick Replies */}
          <div className="no-drag" style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--surface)', display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', borderTop: '1px solid var(--border-color)' }}>
            {['Agendar cita', 'Ir a la comunidad', 'Registrar emoción', 'S.O.S'].map((chip) => (
              <button
                key={chip}
                onClick={() => sendQuickReply(chip)}
                style={{
                  padding: '0.4rem 0.75rem',
                  backgroundColor: chip === 'S.O.S' ? 'var(--bg-danger)' : 'var(--bg-color)',
                  color: chip === 'S.O.S' ? 'var(--accent-rose)' : 'var(--primary)',
                  border: `1px solid ${chip === 'S.O.S' ? 'var(--border-danger)' : 'var(--primary)'}`,
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {chip}
              </button>
            ))}
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="no-drag" style={{ padding: '0.75rem', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu consulta..."
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                backgroundColor: inputValue.trim() ? 'var(--primary)' : 'var(--border-color)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button Container */}
      <div style={{ position: 'relative', marginTop: isOpen ? '1rem' : '0' }}>
        <button 
          onClick={toggleChat}
          className="no-drag"
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
          {!isOpen && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--accent-rose)',
              borderRadius: '50%',
              border: '2px solid var(--surface)'
            }}></span>
          )}
        </button>

        {!isOpen && (
          <button
            className="no-drag"
            onClick={(e) => {
              e.stopPropagation();
              toggleAIAssistant();
            }}
            style={{
              position: 'absolute',
              top: '-5px',
              left: '-5px',
              width: '20px',
              height: '20px',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-light)',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            title="Ocultar Asistente"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes typing {
          0% { opacity: 0.3; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.3; transform: translateY(0px); }
        }
        .dot-typing {
          display: inline-block;
          font-weight: bold;
          font-size: 1rem;
          color: var(--text-light);
          animation: typing 1.4s infinite ease-in-out both;
        }
      `}</style>
    </div>
    </Draggable>
  );
}
