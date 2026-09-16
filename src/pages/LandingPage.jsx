import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HeartPulse, Sparkles, Building } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Debes aceptar los términos antes de ingresar.");
      return;
    }
    // Simulate SSO login and redirect to onboarding
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-pattern flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 z-10">
        
        {/* Left Column: B2B Value Proposition */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-border text-primary font-medium text-sm mb-2">
            <Building className="w-4 h-4" />
            <span>Solución B2B para Universidades</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-color leading-tight">
            Protege el bienestar de tus estudiantes y reduce la deserción.
          </h1>
          
          <p className="text-lg md:text-xl text-secondary-color max-w-xl mx-auto md:mx-0">
            Free Mind es una red de acompañamiento emocional entre pares. Contención anónima y prevención temprana para salvaguardar la salud mental de tu comunidad universitaria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <div className="flex items-center gap-2 text-secondary-color font-medium">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <span>Privacidad Garantizada</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-color font-medium">
              <HeartPulse className="w-5 h-5 text-secondary" />
              <span>Soporte 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-color font-medium">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>Impacto Medible</span>
            </div>
          </div>
        </div>

        {/* Right Column: Student Login Box */}
        <div className="w-full max-w-md">
          <div className="glass-panel card p-8 relative">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-color">Portal del Estudiante</h2>
              <p className="text-secondary-color mt-2">Ingresa a tu espacio seguro.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-color">Correo Institucional</label>
                <input 
                  type="email" 
                  required
                  placeholder="ej. alumno@cientifica.edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={!agreed || !email}
                className="btn btn-primary btn-block text-lg py-3"
              >
                Ingresar con SSO
              </button>

              <div className="flex items-start mt-4 pt-4 border-t border-border">
                <input 
                  type="checkbox" 
                  id="disclaimer" 
                  className="form-checkbox mt-0.5"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="disclaimer" className="label-text">
                  Al ingresar, acepto que este es un servicio de acompañamiento de pares voluntarios, <strong>no una intervención médica o clínica</strong>.
                </label>
              </div>

            </form>
          </div>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-sm text-secondary hover:underline font-medium"
            >
              Acceso Administrativo (Demo Universidad) →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
