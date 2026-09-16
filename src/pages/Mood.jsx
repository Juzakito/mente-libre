import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookHeart, Save, Calendar, Info, TrendingUp, Edit3, Trash2, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { trackEvent } from '../utils/tracker';
import { useGamification } from '../features/gamification/hooks/useGamification';
import AppleEmoji from '../components/ui/AppleEmoji';
import { useTranslation } from 'react-i18next';

const MOODS = [
  { emoji: '🤩', label: 'Increíble', color: 'var(--accent-emerald)' },
  { emoji: '😊', label: 'Bien', color: 'var(--primary)' },
  { emoji: '😐', label: 'Regular', color: 'var(--accent-amber)' },
  { emoji: '😢', label: 'Triste', color: 'var(--accent-blue)' },
  { emoji: '🤯', label: 'Abrumado', color: 'var(--accent-rose)' },
];

export default function Mood() {
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [savedToday, setSavedToday] = useState(false);
  const { showToast } = useOutletContext();
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [editMood, setEditMood] = useState(null);

  const { addFeathers, awardPoints, checkAndIncrementStreak, moods, addMood, updateMood, deleteMood } = useGamification();
  const safeMoods = Array.isArray(moods) ? moods : [];

  useEffect(() => {
    // Check if there is an entry for today
    const todayStr = new Date().toLocaleDateString();
    const hasToday = safeMoods.some(entry => new Date(entry.date).toLocaleDateString() === todayStr);
    setSavedToday(hasToday);
  }, [safeMoods]);

  const handleSave = () => {
    if (!selectedMood) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood,
      note: note.trim()
    };

    addMood(newEntry);
    setSavedToday(true);
    addFeathers(10);
    
    // Gamification
    const streakIncreased = checkAndIncrementStreak();
    awardPoints(15);
    showToast(streakIncreased ? '¡+15 pts y racha diaria aumentada! 🔥' : '¡+15 pts por registrar tu estado! 🌟');
    
    trackEvent('MOOD_LOGGED', { mood: selectedMood.label });
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    if (date.toLocaleDateString() === today.toLocaleDateString()) return `Hoy a las ${timeStr}`;
    if (date.toLocaleDateString() === yesterday.toLocaleDateString()) return `Ayer a las ${timeStr}`;
    
    return `${date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })} a las ${timeStr}`;
  };

  // Prepare chart data
  const chartData = [...safeMoods].reverse().slice(-14).map((entry, index, arr) => {
    const valueMap = { 'Increíble': 5, 'Bien': 4, 'Regular': 3, 'Triste': 2, 'Abrumado': 1 };
    const date = new Date(entry.date);
    const day = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    const sameDayCount = arr.filter(a => new Date(a.date).toLocaleDateString() === date.toLocaleDateString()).length;
    
    return {
      name: sameDayCount > 1 ? `${day} ${time}` : day,
      value: valueMap[entry.mood.label] || 3,
      label: entry.mood.label,
      time: time
    };
  });

  return (
    <div style={{ padding: '1rem', width: '100%', maxWidth: '720px', margin: '0 auto', paddingBottom: '6rem' }} className="animate-fade-in">
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookHeart size={28} color="var(--primary)" /> Mi Diario Emocional
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
          Un espacio 100% privado solo para ti. El Búho usará esto para darte mejores consejos en el chat.
        </p>
      </div>

      {!savedToday ? (
        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center', marginBottom: '1rem' }}>
              ¿Cómo te sientes hoy?
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '0.75rem' }}>
              {MOODS.map((mood) => {
                const isSelected = selectedMood?.label === mood.label;
                return (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem 0.5rem',
                      borderRadius: 'var(--radius-lg)',
                      border: `2px solid ${isSelected ? mood.color : 'var(--border-color)'}`,
                      backgroundColor: isSelected ? `${mood.color}20` : 'var(--surface)',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isSelected ? `0 0 20px ${mood.color}35` : 'var(--shadow-sm)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                  >
                    <AppleEmoji emoji={mood.emoji} size={36} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isSelected ? mood.color : 'var(--text-muted)' }}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
              ¿Quieres añadir algún apunte privado? (Opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej. Siento mucha presión por los parciales de anatomía..."
              style={{
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                fontSize: '0.9rem',
                resize: 'none',
                minHeight: '110px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!selectedMood}
            className="btn-primary"
            style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: selectedMood ? '0 4px 20px rgba(20, 184, 166, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Save size={20} /> {selectedMood ? t('moodMisc.saveDay') : 'Selecciona una emoción arriba'}
          </button>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--primary-light)', backgroundColor: 'var(--primary-light)', marginBottom: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-hover)', marginBottom: '0.5rem' }}>
            ¡Gracias por registrar tu día!
          </h3>
          <p style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>
            Vuelve mañana para seguir llenando tu diario emocional.
          </p>
        </div>
      )}

      {/* History Section */}
      <div>
        {safeMoods.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={20} color="var(--primary)" /> {t('moodMisc.weeklyEvolution')}
            </h3>
            <div style={{ height: '200px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} padding={{ left: 20, right: 20 }} />
                  <YAxis 
                    domain={[1, 5]} 
                    ticks={[1, 2, 3, 4, 5]}
                    tick={({ x, y, payload }) => {
                      const emojis = { 1: '😫', 2: '😢', 3: '😐', 4: '🙂', 5: '🤩' };
                      return (
                        <foreignObject x={x - 28} y={y - 10} width={24} height={20}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%' }}>
                            <AppleEmoji emoji={emojis[payload.value]} size={18} />
                          </div>
                        </foreignObject>
                      );
                    }}
                    width={35}
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', color: 'var(--text-main)' }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: 800 }}
                    formatter={(value, name, props) => [`${props.payload.label} (${props.payload.time})`, 'Estado']}
                  />
                  <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Calendar size={20} color="var(--text-muted)" /> Historial Completo
        </h3>
        
        {safeMoods.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('moodMisc.noRecords')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {safeMoods.slice(0, 7).map((entry) => (
              <div key={entry.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
                
                {editingId === entry.id ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {MOODS.map((m, index) => (
                        <button
                          key={index}
                          onClick={() => setEditMood(m)}
                          style={{
                            backgroundColor: editMood?.label === m.label ? m.color : 'var(--bg-color)',
                            color: editMood?.label === m.label ? 'white' : 'var(--text-main)',
                            border: `2px solid ${editMood?.label === m.label ? m.color : 'transparent'}`,
                            borderRadius: 'var(--radius-lg)', padding: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: '1 1 0', minWidth: '3.5rem', cursor: 'pointer', transition: 'all 0.2s', filter: editMood && editMood.label !== m.label ? 'grayscale(100%) opacity(0.5)' : 'none', transform: editMood?.label === m.label ? 'scale(1.05)' : 'scale(1)'
                          }}
                        >
                          <AppleEmoji emoji={m.emoji} size={24} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder={t('moodMisc.notePlaceholder')}
                      style={{
                        width: '100%', minHeight: '80px', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.875rem', resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => setEditingId(null)} style={{ padding: '0.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          updateMood(entry.id, editNote, editMood || entry.mood);
                          setEditingId(null);
                        }} 
                        style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Save size={16} /> Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                      {(!entry.date || (Date.now() - new Date(entry.date).getTime()) < 300000) && (
                        <button 
                          onClick={() => {
                            setEditingId(entry.id);
                            setEditNote(entry.note || '');
                            setEditMood(entry.mood);
                          }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                          title="Editar (solo los primeros 5 min)"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if(window.confirm('¿Eliminar este registro?')) deleteMood(entry.id);
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', backgroundColor: `color-mix(in srgb, ${entry.mood.color} 15%, transparent)`, borderRadius: '50%' }}>
                      <AppleEmoji emoji={entry.mood.emoji} size={32} />
                    </div>
                    <div style={{ flex: 1, paddingRight: '3rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, color: entry.mood.color }}>{entry.mood.label}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'capitalize' }}>
                          {getDayName(entry.date)}
                        </span>
                      </div>
                      {entry.note && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
