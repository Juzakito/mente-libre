import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const getNormalizedLang = (lng) => {
    if (!lng) return 'es';
    const clean = lng.toLowerCase().split('-')[0];
    if (['es', 'en', 'pt', 'qu'].includes(clean)) return clean;
    return 'es';
  };

  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('freemind-lang');
    return getNormalizedLang(saved || i18n.language);
  });

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLang(getNormalizedLang(lng));
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const languages = [
    { code: 'es', label: 'ES', title: 'Español' },
    { code: 'en', label: 'EN', title: 'English' },
    { code: 'pt', label: 'PT', title: 'Português' },
    { code: 'qu', label: 'QU', title: 'Runasimi (Quechua)' }
  ];

  const handleSelect = (code) => {
    setCurrentLang(code);
    localStorage.setItem('freemind-lang', code);
    localStorage.setItem('i18nextLng', code);
    i18n.changeLanguage(code);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '9999px',
      padding: '3px 4px',
      gap: '2px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
    }}>
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            style={{
              background: isActive ? '#00e676' : 'transparent',
              color: isActive ? '#082e30' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '9999px',
              padding: '4px 9px',
              fontSize: '0.74rem',
              fontWeight: 900,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isActive ? '0 2px 8px rgba(0, 230, 118, 0.35)' : 'none'
            }}
            title={`Cambiar idioma a ${lang.title}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
