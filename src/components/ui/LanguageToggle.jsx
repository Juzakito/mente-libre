import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.4rem 0.8rem',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '2rem',
        color: 'var(--text-main)',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-color)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface)';
      }}
    >
      <span style={{ marginRight: '0.3rem', opacity: i18n.language === 'es' ? 1 : 0.5 }}>ES</span>
      <span style={{ margin: '0 0.2rem', opacity: 0.5 }}>|</span>
      <span style={{ marginLeft: '0.3rem', opacity: i18n.language === 'en' ? 1 : 0.5 }}>EN</span>
    </button>
  );
}
