import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Check } from 'lucide-react';
import { CAREERS } from '../utils/constants';

export default function CareerDropdown({ value, onChange, placeholder = "Selecciona tu carrera", variant = "default" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 'auto', bottom: 'auto', left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const filteredCareers = CAREERS.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

  // Function to calculate and update position relative to trigger button
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Default to opening downwards, but open upwards if not enough space below AND there is more space above
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPos({
          top: 'auto',
          bottom: window.innerHeight - rect.top + 6,
          left: rect.left,
          width: rect.width,
        });
      } else {
        setDropdownPos({
          top: rect.bottom + 6,
          bottom: 'auto',
          left: rect.left,
          width: rect.width,
        });
      }
    }
  }, []);

  // Recalculate position on open
  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        triggerRef.current && !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle page scrolling / resizing — DO NOT close when scrolling inside the dropdown list!
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (event) => {
      // Ignore scroll events originating from inside the dropdown container itself
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }
      // Re-anchor or update position on page scroll
      updatePosition();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  const handleSelect = (career) => {
    onChange(career);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getTriggerStyle = () => {
    if (variant === 'profile') {
      return {
        width: '100%',
        padding: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        backgroundColor: 'rgba(0,0,0,0.2)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      };
    }
    return {
      width: '100%',
      padding: '1rem',
      fontSize: '1rem',
      fontWeight: 600,
      backgroundColor: 'var(--bg-color)',
      color: value ? 'var(--text-main)' : 'var(--text-muted)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
    };
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Trigger button */}
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} style={getTriggerStyle()}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </div>

      {/* Dropdown portal-style: fixed position so it escapes overflow:hidden parents */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            bottom: dropdownPos.bottom,
            left: dropdownPos.left,
            width: dropdownPos.width,
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            zIndex: 9999,
            maxHeight: '280px',
            overflow: 'hidden',
          }}
          className="animate-slide-up"
        >
          {/* Search */}
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', flexShrink: 0 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Buscar carrera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none', outline: 'none',
                backgroundColor: 'transparent',
                width: '100%',
                fontSize: '0.875rem',
                color: 'var(--text-main)',
              }}
              autoFocus
            />
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', maxHeight: '250px', padding: '0.5rem' }} className="custom-styled-scrollbar">
            {filteredCareers.length > 0 ? (
              filteredCareers.map(c => (
                <div
                  key={c}
                  onClick={() => handleSelect(c)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: value === c ? 'var(--primary-light)' : 'transparent',
                    color: value === c ? 'var(--primary)' : 'var(--text-main)',
                    fontSize: '0.875rem',
                    fontWeight: value === c ? 700 : 500,
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { if (value !== c) e.currentTarget.style.backgroundColor = 'var(--bg-color)'; }}
                  onMouseLeave={(e) => { if (value !== c) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {c}
                  {value === c && <Check size={16} color="var(--primary)" />}
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No se encontró ninguna carrera.
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
