import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Users, Sparkles, Search } from 'lucide-react';
import PeruMap from '../components/PeruMap';
import MapTooltip from '../components/MapTooltip';
import ExpertProfileModal from '../components/ExpertProfileModal';

const REGIONS = [
  { id: 'PEAMA', name: 'Amazonas' },
  { id: 'PEANC', name: 'Ancash' },
  { id: 'PEAPU', name: 'Apurimac' },
  { id: 'PEARE', name: 'Arequipa' },
  { id: 'PEAYA', name: 'Ayacucho' },
  { id: 'PECAJ', name: 'Cajamarca' },
  { id: 'PECAL', name: 'Callao' },
  { id: 'PECUS', name: 'Cusco' },
  { id: 'PEHUV', name: 'Huancavelica' },
  { id: 'PEHUC', name: 'Huanuco' },
  { id: 'PEICA', name: 'Ica' },
  { id: 'PEJUN', name: 'Junin' },
  { id: 'PELAL', name: 'La Libertad' },
  { id: 'PELAM', name: 'Lambayeque' },
  { id: 'PELIM', name: 'Lima' },
  { id: 'PELOR', name: 'Loreto' },
  { id: 'PEMDD', name: 'Madre de Dios' },
  { id: 'PEMOQ', name: 'Moquegua' },
  { id: 'PEPAS', name: 'Pasco' },
  { id: 'PEPIU', name: 'Piura' },
  { id: 'PEPUN', name: 'Puno' },
  { id: 'PESAM', name: 'San Martin' },
  { id: 'PETAC', name: 'Tacna' },
  { id: 'PETUM', name: 'Tumbes' },
  { id: 'PEUCA', name: 'Ucayali' }
];

export default function Experts() {
  const { t } = useTranslation();
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [contactingExpert, setContactingExpert] = useState(null);

  const filteredRegions = REGIONS.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectFromSearch = (region) => {
    setSearchTerm('');
    setShowDropdown(false);
    // Mimic a map click to open the tooltip at the center
    setSelectedRegion(region);
    setHoveredRegion(region);
    setTooltipPos({ x: window.innerWidth / 2 - 140, y: window.innerHeight / 2 - 100 });
  };

  const handleRegionHover = (id, name, x, y) => {
    // Only update hover if we haven't clicked to lock a region
    if (!selectedRegion) {
      if (id) {
        setHoveredRegion({ id, name });
        setTooltipPos({ x, y });
      } else {
        setHoveredRegion(null);
      }
    }
  };

  const handleRegionClick = (id, name) => {
    if (selectedRegion && selectedRegion.id === id) {
      // Deselect if clicking the same region
      setSelectedRegion(null);
      setHoveredRegion(null);
    } else {
      setSelectedRegion({ id, name });
      setHoveredRegion({ id, name });
      
      // Update position to center of screen roughly for clicked items if needed
      // Or just keep it where it was clicked
      setTooltipPos({ x: window.innerWidth / 2 - 140, y: window.innerHeight / 2 - 100 });
    }
  };

  const handleContact = (expert) => {
    // Open the new Expert Profile Modal instead of an alert
    setContactingExpert(expert);
  };

  return (
    <div className="experts-page">
      
      <div className="experts-header animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', backgroundColor: 'var(--surface)', borderRadius: '9999px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.5px' }}>
            NUEVO
          </span>
        </div>
        
        <h1 className="experts-title">
          Conecta con un Experto
          <Users color="var(--primary)" size={36} className="title-icon" />
        </h1>
        
        <p className="experts-subtitle">
          Navega por nuestro mapa interactivo o busca tu departamento para encontrar profesionales de la salud mental disponibles en tu localidad.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '400px', margin: '1.5rem auto 0 auto', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '0.5rem 1rem', transition: 'border-color 0.3s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
            <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Ej. Lima, Cusco, Arequipa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem' }}
            />
          </div>
          
          {showDropdown && searchTerm && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', maxHeight: '200px', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleSelectFromSearch(region)}
                    style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', background: 'transparent', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 10%, transparent)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {region.name}
                  </button>
                ))
              ) : (
                <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No se encontraron departamentos.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="map-wrapper">
        <PeruMap 
          onRegionHover={handleRegionHover} 
          onRegionClick={handleRegionClick}
        />
        
        <MapTooltip 
          region={hoveredRegion || selectedRegion} 
          x={tooltipPos.x} 
          y={tooltipPos.y} 
          onClose={() => { setHoveredRegion(null); setSelectedRegion(null); }}
          onContact={handleContact}
        />
      </div>
      
      {/* Dynamic Profile and Contact Modal */}
      {contactingExpert && (
        <ExpertProfileModal 
          expert={contactingExpert} 
          onClose={() => setContactingExpert(null)} 
        />
      )}
    </div>
  );
}
