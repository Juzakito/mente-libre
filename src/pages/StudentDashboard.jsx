import React, { useState } from 'react';
import { Shield, MessageCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { id: 'great', icon: '😊', label: 'Muy Bien' },
    { id: 'okay', icon: '😐', label: 'Regular' },
    { id: 'stressed', icon: '😰', label: 'Estresado' },
    { id: 'bad', icon: '😔', label: 'Mal' }
  ];

  const triggers = [
    'Carga académica',
    'Exámenes parciales',
    'Soledad / Lejanía',
    'Problemas de adaptación',
    'Presión familiar',
    'Problemas económicos',
    'Ansiedad social',
    'Otro'
  ];

  const toggleTrigger = (trigger) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleConnect = () => {
    if (!selectedMood) {
      alert("Por favor, indícanos cómo te sientes hoy.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate webhook connection delay (Wizard of Oz model)
    // In a real scenario, this would post to a Google Sheets webhook URL
    setTimeout(() => {
      console.log("Enviando a Webhook de Google Sheets:", {
        timestamp: new Date().toISOString(),
        mood: selectedMood,
        triggers: selectedTriggers,
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 text-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary-color">Conectando...</h2>
          <p className="text-secondary-color">
            Hemos recibido tu solicitud. Un Orientador Par se pondrá en contacto contigo de forma anónima y segura en breve.
          </p>

          {/* AI Assistant Integration */}
          <div className="bg-primary/5 rounded-xl p-6 mt-6 border border-primary/10">
            <h3 className="text-lg font-bold text-primary-color mb-2">¿Prefieres agendar tu cita ahora?</h3>
            <p className="text-sm text-secondary-color mb-4">
              Nuestro Asistente de IA te ayudará a elegir el mejor horario estructurado con un clic.
            </p>
            <a 
              href="https://calendly.com/jmgonzalez-contact/30min?month=2026-08"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block text-base py-3 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Asistente de IA: Agendar Cita
            </a>
          </div>

          <div className="pt-6 border-t border-border">
            <p className="text-sm text-text-tertiary">
              Si sientes que estás en una crisis aguda o emergencia, por favor comunícate a las líneas de ayuda nacionales de inmediato.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Mobile-first Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-primary-color">Free Mind</span>
          </div>
          <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Modo Anónimo
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-color mb-2">Hola, este es un espacio seguro.</h1>
          <p className="text-secondary-color text-lg">Estamos aquí para escucharte, sin juzgar.</p>
        </div>

        <div className="card p-6 md:p-8 mb-6">
          <h2 className="text-xl font-semibold mb-2">¿Cómo te sientes hoy?</h2>
          <p className="text-sm text-secondary-color">Selecciona el estado que mejor te represente.</p>
          
          <div className="mood-selector">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`mood-btn ${selectedMood === mood.id ? 'active' : ''}`}
              >
                <span className="mood-icon">{mood.icon}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold mb-2">¿Qué está causando tu estrés?</h2>
          <p className="text-sm text-secondary-color">Puedes seleccionar varias opciones (opcional).</p>
          
          <div className="stress-pills">
            {triggers.map((trigger) => (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={`stress-pill ${selectedTriggers.includes(trigger) ? 'active' : ''}`}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>

        <div className="sticky bottom-4 z-20">
          <button 
            onClick={handleConnect}
            disabled={isSubmitting}
            className="btn btn-primary btn-block text-lg py-4 shadow-lg flex items-center gap-2 justify-center"
          >
            {isSubmitting ? (
              'Enviando solicitud...'
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Conectar con un Orientador Par ahora
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
