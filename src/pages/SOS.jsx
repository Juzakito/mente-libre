import React from 'react';
import SOSModal from '../components/SOSModal';
import { useNavigate } from 'react-router-dom';

export default function SOS() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
      <SOSModal reason="manual" onClose={() => navigate(-1)} />
    </div>
  );
}
