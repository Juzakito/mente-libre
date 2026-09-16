import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ComposePostModal({ onClose, onPublish }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--surface)', zIndex: 50, display: 'flex', flexDirection: 'column' }} className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <button onClick={onClose} style={{ padding: '0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '50%', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{t('student.feed.composeTitle')}</span>
        <button 
          onClick={() => onPublish(text, ['General'])} 
          disabled={!text.trim()} 
          style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: text.trim() ? 'pointer' : 'default', opacity: text.trim() ? 1 : 0.5 }}
        >
          {t('student.feed.composeBtn')}
        </button>
      </div>
      <div style={{ padding: '1.25rem', flex: 1 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('student.feed.composePlaceholder')}
          style={{ width: '100%', height: '100%', resize: 'none', border: 'none', outline: 'none', fontSize: '1.125rem', color: 'var(--text-main)', backgroundColor: 'transparent' }}
          autoFocus
        />
      </div>
    </div>
  );
}
