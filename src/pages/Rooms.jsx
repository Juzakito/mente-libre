import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Menu, ShieldCheck } from 'lucide-react';

const ROOMS_DATA = [
  {
    id: 'primer_ano',
    emoji: '🌱',
    name: 'Primeros Ciclos Universitarios',
    tag: '#PrimerAño',
    topic: 'Adaptación al campus, consejos sobre profesores, trámites y primeros parciales.',
    users: 38,
    accentColor: '#10b981',
    bgAlpha: 'rgba(16, 185, 129, 0.08)',
    borderAlpha: 'rgba(16, 185, 129, 0.22)'
  },
  {
    id: 'examenes',
    emoji: '📚',
    name: 'Preparación de Exámenes',
    tag: '#ExámenesFinales',
    topic: 'Grupos de estudio, sesiones Pomodoro de 50m y resúmenes compartidos.',
    users: 52,
    accentColor: '#3b82f6',
    bgAlpha: 'rgba(59, 130, 246, 0.08)',
    borderAlpha: 'rgba(59, 130, 246, 0.22)'
  },
  {
    id: 'salud_mental',
    emoji: '🧠',
    name: 'Manejo de la Ansiedad',
    tag: '#SaludMental',
    topic: 'Espacio de contención, pausas de respiración y apoyo guiado sin juicios.',
    users: 24,
    accentColor: '#8b5cf6',
    bgAlpha: 'rgba(139, 92, 246, 0.08)',
    borderAlpha: 'rgba(139, 92, 246, 0.22)'
  },
  {
    id: 'desahogo',
    emoji: '💬',
    name: 'Desahogo Libre 24/7',
    tag: '#DesahogoLibre',
    topic: 'Exprésate con total libertad y sin filtros, 100% anónimo entre compañeros.',
    users: 19,
    accentColor: '#f59e0b',
    bgAlpha: 'rgba(245, 158, 11, 0.08)',
    borderAlpha: 'rgba(245, 158, 11, 0.22)'
  }
];

export default function Rooms() {
  const navigate = useNavigate();
  const outletCtx = useOutletContext();

  const handleJoinRoom = (room) => {
    sessionStorage.setItem('active_chat_room', JSON.stringify(room));
    sessionStorage.removeItem('active_peer_match');
    outletCtx?.showToast?.(`Conectado a la sala ${room.name} ✨`);
    navigate('/app/chat', { state: { activeRoom: room, selectedRoom: room } });
  };

  return (
    <div className="tc-dashboard-wrapper">
      <section className="tc-feed-main" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
        
        {/* Mobile Header */}
        <div className="mobile-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 0.25rem',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => outletCtx.setMobileMenuOpen?.(true)}
              style={{
                backgroundColor: '#1b2022',
                border: '1px solid #283033',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <Menu size={18} />
            </button>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
              Salas
            </h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="desktop-header hide-on-mobile" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.04em' }}>Salas Comunitarias</h1>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>Encuentra tu tribu. 100% anónimo.</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '0 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          {/* Header Description */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              🏛️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                  Salas 24/7
                </h2>
                <span style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}>
                  ● 133 en vivo
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.35rem 0 0', lineHeight: 1.5 }}>
                Espacios anónimos de encuentro, grupos de estudio y desahogo en tiempo real entre estudiantes de campus.
              </p>
            </div>
          </div>

          {/* Rooms List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROOMS_DATA.map((room) => (
              <div
                key={room.id}
                className="tc-room-card"
                style={{
                  padding: '0.85rem 0.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
                onClick={() => handleJoinRoom(room)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem', marginTop: '0.1rem' }}>
                    {room.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {room.name}
                      </span>
                      <span style={{
                        color: room.accentColor,
                        backgroundColor: room.bgAlpha,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px'
                      }}>
                        ● {room.users}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                      {room.topic}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'var(--surface-hover)',
            borderRadius: '12px',
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Espacios 100% anónimos · Moderación activa
            </span>
          </div>

        </div>
      </section>
      
      {/* Right Sidebar Placeholder (hidden on mobile) */}
      <aside className="tc-feed-sidebar hide-on-mobile" style={{ width: '320px' }}>
      </aside>
    </div>
  );
}
