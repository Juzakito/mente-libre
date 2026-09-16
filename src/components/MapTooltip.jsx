import React from 'react';
import { MessageCircle, MapPin, X } from 'lucide-react';

export default function MapTooltip({ region, x, y, onClose, onContact }) {
  if (!region) return null;

  // Generate dynamic, unique mock experts based on the region string
  const getExpertsForRegion = (regionName) => {
    const specialties = ['Psicóloga Clínica', 'Psiquiatra', 'Terapeuta Familiar', 'Coach Ontológico', 'Psicóloga Infantil', 'Psicoterapeuta', 'Psicóloga Educativa', 'Coach de Vida', 'Terapia de Pareja', 'Neuropsicólogo'];
    const femaleNames = ['Ana Pérez', 'Carla Ruiz', 'Sofía Castro', 'María Elena', 'Patricia Vega', 'Carmen Rosa', 'Lucía Fernández', 'Valeria Gómez', 'Daniela Silva', 'Camila Torres', 'Rosa María', 'Juana Inés'];
    const maleNames = ['Luis Rojas', 'José Vargas', 'Carlos Mendoza', 'Fernando Ríos', 'Roberto Aliaga', 'Hugo Silva', 'Diego Ramírez', 'Martín Morales', 'Jorge Castillo', 'Andrés Paredes', 'Miguel Ángel', 'Javier Peña'];

    // Generate a deterministic hash based on the region name
    let hash = 0;
    for (let i = 0; i < regionName.length; i++) {
      hash = regionName.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const experts = [];
    // Decide if region gets 2 or 3 experts deterministically
    const numExperts = (hash % 2) + 2; 

    for (let i = 0; i < numExperts; i++) {
      const isFemale = (hash + i) % 2 === 0;
      const nameList = isFemale ? femaleNames : maleNames;
      const namePrefix = isFemale 
        ? ((hash + i) % 3 === 0 ? 'Dra.' : 'Lic.') 
        : ((hash + i) % 3 === 0 ? 'Dr.' : ((hash + i) % 3 === 1 ? 'Lic.' : 'Mg.'));
      
      // Use different multipliers for indices to avoid repeating combinations
      const name = `${namePrefix} ${nameList[(hash + i * 3) % nameList.length]}`;
      const specialty = specialties[(hash + i * 7) % specialties.length];
      
      // Select a photo ID from 1 to 90 (RandomUser API limits)
      const photoId = (hash + i * 13) % 90 + 1; 
      const photoGender = isFemale ? 'women' : 'men';
      const photo = `https://randomuser.me/api/portraits/${photoGender}/${photoId}.jpg`;

      // Determine rate between 50 and 150 Soles
      const rate = 50 + ((hash + i * 17) % 21) * 5; // e.g., 50, 55, ..., 150
      // Determine rating between 4.0 and 5.0
      const rating = (4.0 + ((hash + i * 23) % 11) / 10).toFixed(1); // e.g., 4.0, 4.1, ..., 5.0

      experts.push({ 
        id: `${regionName}-${i}`, 
        name, 
        specialty, 
        photo, 
        location: regionName,
        rate: `S/ ${rate}.00`,
        rating
      });
    }

    return experts;
  };

  const experts = getExpertsForRegion(region.name);

  // Keep tooltip within bounds
  const tooltipStyle = {
    position: 'fixed',
    left: Math.min(x + 15, window.innerWidth - 300) + 'px',
    top: Math.min(y + 15, window.innerHeight - (experts.length * 90 + 100)) + 'px',
    zIndex: 1000,
    width: '320px',
    pointerEvents: 'auto',
  };

  return (
    <div className="glass map-tooltip animate-scale-up" style={tooltipStyle}>
      <div style={{ padding: '1rem', position: 'relative' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
        >
          <X size={16} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <MapPin size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Expertos en {region.name}
          </span>
        </div>

        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {experts.map(expert => (
            <div key={expert.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'color-mix(in srgb, var(--surface) 80%, transparent)', border: '1px solid var(--border-color)' }}>
              
              {/* Photo */}
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary)', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <img src={expert.photo} alt={expert.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {expert.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  {expert.specialty}
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={(e) => { e.stopPropagation(); onContact(expert); }}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 5px rgba(13,148,136,0.3)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title="Contactar Experto"
              >
                <MessageCircle size={16} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
