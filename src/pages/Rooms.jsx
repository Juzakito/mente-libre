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
        


        {/* Desktop Header */}
        <div className="desktop-header hide-on-mobile" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.04em' }}>Salas Comunitarias</h1>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>Encuentra tu tribu. 100% anónimo.</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Header Description */}
          <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                Salas
              </h2>
              <span style={{
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}>
                133 en vivo
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              Espacios anónimos de encuentro, grupos de estudio y desahogo en tiempo real entre estudiantes de campus.
            </p>
          </div>

          {/* Rooms List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ROOMS_DATA.map((room) => (
              <div
                key={room.id}
                style={{
                  padding: '1rem 0.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleJoinRoom(room)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem' }}>
                    {room.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {room.name}
                      </span>
                      <span style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {room.users} personas
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
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
            marginTop: '1rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border-color)'
          }}>
            <ShieldCheck size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Espacios 100% anónimos. Moderación activa.
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
