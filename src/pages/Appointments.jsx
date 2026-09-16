import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Video, MessageCircle, AlertCircle } from 'lucide-react';
import { useGamification } from '../features/gamification/hooks/useGamification';
import { Link } from 'react-router-dom';

export default function Appointments() {
  const { t } = useTranslation();
  const { appointments } = useGamification();

  return (
    <div className="page-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }} className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Calendar color="var(--primary)" size={32} />
          Mis Citas
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Tus sesiones programadas con profesionales de la salud mental.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="glass animate-slide-up" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', position: 'relative' }}>
              
              {/* Status Badge */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                Confirmada
              </div>

              {/* Expert Info */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '250px', flex: 1 }}>
                <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', border: '2px solid var(--primary)', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <img src={appointment.expert.photo} alt={appointment.expert.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, marginBottom: '0.25rem' }}>
                    {appointment.expert.name}
                  </h3>
                  <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {appointment.expert.specialty}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} /> {appointment.expert.location}
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '200px', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  <Calendar size={18} color="var(--primary)" />
                  <span style={{ textTransform: 'capitalize' }}>
                    {new Date(appointment.date).toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  <Clock size={18} color="var(--primary)" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <Video size={18} /> Entrar a Sesión
                </button>
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', backgroundColor: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <MessageCircle size={18} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="glass animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', flex: 1 }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Calendar size={40} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              No tienes citas programadas
            </h2>
            <p style={{ color: 'var(--text-light)', maxWidth: '400px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              Aún no has reservado ninguna sesión. Explora nuestro mapa interactivo para encontrar profesionales de la salud mental disponibles en tu localidad.
            </p>
            <Link to="/app/expertos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary)', color: 'white', padding: '0.85rem 1.5rem', borderRadius: '9999px', fontWeight: 800, textDecoration: 'none', transition: 'transform 0.2s' }}>
              <MapPin size={18} /> Explorar Expertos
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
