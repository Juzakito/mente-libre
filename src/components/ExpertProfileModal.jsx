import React, { useState } from 'react';
import { X, Star, MessageCircle, Calendar, Send, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { useGamification } from '../features/gamification/hooks/useGamification';
import './ExpertProfileModal.css';

export default function ExpertProfileModal({ expert, onClose }) {
  const { addAppointment } = useGamification();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'schedule'
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'expert', text: `Hola, soy ${expert.name}. ¿En qué te puedo ayudar hoy?`, time: 'Ahora' }
  ]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [scheduled, setScheduled] = useState(false);

  // Mock schedule dates (next 3 days)
  const today = new Date();
  const scheduleDates = [0, 1, 2].map(offset => {
    const d = new Date();
    d.setDate(today.getDate() + offset);
    return d;
  });

  const availableTimes = ['09:00 AM', '11:30 AM', '03:00 PM', '05:30 PM'];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: message, time: 'Ahora' }]);
    setMessage('');
    
    // Simulate auto-reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'expert', 
        text: 'He recibido tu mensaje. Por favor agenda una sesión para poder profundizar en tu caso y brindarte la mejor atención.', 
        time: 'Ahora' 
      }]);
    }, 1500);
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) return;
    
    // Save to global state
    addAppointment(expert, selectedDate, selectedTime);
    
    setScheduled(true);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="expert-modal-container animate-slide-up" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div className="expert-modal-header">
          <div className="expert-avatar-large">
            <img src={expert.photo} alt={expert.name} />
          </div>
          <div className="expert-modal-info">
            <h2>{expert.name}</h2>
            <p className="specialty-text">{expert.specialty}</p>
            <div className="expert-badges">
              <div className="badge badge-rating">
                <Star size={14} fill="currentColor" />
                <span>{expert.rating}</span>
              </div>
              <div className="badge badge-rate">
                <CreditCard size={14} />
                <span>{expert.rate} / sesión (45m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle size={18} /> Chat
          </button>
          <button 
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={18} /> Agendar Cita
          </button>
        </div>

        {/* Content Area */}
        <div className="modal-content-area">
          
          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="chat-interface">
              <div className="chat-messages">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'expert-wrapper'}`}>
                    {msg.sender === 'expert' && <img src={expert.photo} alt="expert" className="chat-mini-avatar" />}
                    <div className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-expert'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje..." 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button type="submit" disabled={!message.trim()} className="send-btn">
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="schedule-interface">
              {scheduled ? (
                <div className="success-state animate-fade-in">
                  <CheckCircle size={48} color="var(--primary)" />
                  <h3>¡Cita Confirmada!</h3>
                  <p>Tu cita con {expert.name} ha sido reservada con éxito.</p>
                  <div className="scheduled-details">
                    <p><Calendar size={16}/> {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p><Clock size={16}/> {selectedTime}</p>
                  </div>
                </div>
              ) : (
                <div className="schedule-form animate-fade-in">
                  <h4>Selecciona una fecha:</h4>
                  <div className="date-selector">
                    {scheduleDates.map((d, i) => (
                      <button 
                        key={i} 
                        className={`date-btn ${selectedDate === d ? 'active' : ''}`}
                        onClick={() => setSelectedDate(d)}
                      >
                        <span className="day-name">{d.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                        <span className="day-number">{d.getDate()}</span>
                      </button>
                    ))}
                  </div>

                  <h4>Selecciona una hora:</h4>
                  <div className="time-selector">
                    {availableTimes.map((time, i) => (
                      <button 
                        key={i} 
                        className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                        onClick={() => setSelectedTime(time)}
                        disabled={!selectedDate}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="confirm-schedule-btn"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleSchedule}
                  >
                    Confirmar Cita - {expert.rate}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
