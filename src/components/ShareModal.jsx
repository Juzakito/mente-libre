import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { X, Copy, Check, Share2 } from 'lucide-react';

export default function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://freemind-app.vercel.app";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mente Libre',
          text: '¡Descubre Mente Libre, tu compañero de bienestar mental!',
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} className="animate-fade-in" onClick={onClose}>
      <div 
        style={{ width: '100%', maxWidth: '360px', backgroundColor: 'var(--surface)', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--bg-color)', border: 'none', borderRadius: '50%', padding: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={20} />
        </button>

        <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'var(--primary-light)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
          <Share2 size={28} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem', textAlign: 'center' }}>Compartir App</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>Escanea este código QR para abrir Mente Libre en otro dispositivo.</p>

        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <QRCode value={shareUrl} size={180} />
        </div>

        <button 
          onClick={handleNativeShare}
          style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(13,148,136,0.2)' }}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? '¡Enlace Copiado!' : 'Compartir enlace'}
        </button>
      </div>
    </div>
  );
}
