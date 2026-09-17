import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useOutletContext, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppleEmoji from '../components/ui/AppleEmoji';
import { safeJSONParse } from '../utils/helpers';

const checkRiskWords = (text) => {
  const riskWords = /morir|matarme|desaparecer|suicidio|acabar con todo|ya no quiero vivir/i;
  return riskWords.test(text);
};

import { config } from '../config/env';

const GEMINI_API_KEY = config.ai.geminiApiKey;
const SYSTEM_PROMPT = "Eres un estudiante universitario empático y solidario hablando de forma anónima con otro compañero en una plataforma de apoyo emocional llamada Free Mind. Tu nombre de usuario es BuhoNocturno. Tu objetivo es escuchar, validar sus sentimientos, ofrecer consejos amables y mantener una charla humana y natural, como si fuera WhatsApp. REGLA CRÍTICA 1: Tus respuestas deben ser MUY BREVES y CONCISAS (máximo 1 o 2 oraciones cortas). REGLA CRÍTICA 2: En lugar de hacer preguntas abiertas o caer en un bucle de 'cuéntame más', asume un rol PROACTIVO: propón soluciones concretas, pequeños retos accionables o da perspectivas resolutivas basadas en lo que te cuentan, manteniendo siempre el apoyo emocional. Si te preguntan cosas fuera de contexto, responde de forma amigable intentando volver al tema de cómo se sienten. Usa emojis ocasionalmente.";

const quickReplies = ['Me siento mal 😞', 'Estoy estresado 😫', 'Necesito hablar', 'Hola 👋'];

export default function Chat() {
  const { t } = useTranslation();
  const location = useLocation();

  const [activeRoom, setActiveRoom] = useState(() => {
    if (location.state?.activeRoom) return location.state.activeRoom;
    if (location.state?.selectedRoom) return location.state.selectedRoom;
    return safeJSONParse(sessionStorage.getItem('active_chat_room'), null);
  });

  const [connected, setConnected] = useState(() => {
    const savedRoom = safeJSONParse(sessionStorage.getItem('active_chat_room'), null);
    return Boolean(location.state?.activeRoom || location.state?.selectedRoom || savedRoom || sessionStorage.getItem('chat_connected') === 'true');
  });

  const [searching, setSearching] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chat_messages');
    return safeJSONParse(saved, []);
  });
  const [inputText, setInputText] = useState('');
  const [peerTyping, setPeerTyping] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = sessionStorage.getItem('chat_history');
    return safeJSONParse(saved, []);
  });
  const [searchProgress, setSearchProgress] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const room = location.state?.selectedRoom || safeJSONParse(sessionStorage.getItem('active_chat_room'), null);
    if (room) {
      setActiveRoom(room);
      setConnected(true);
      setMessages([
        { id: 1, sender: 'system', text: `🔒 Conectado a la Sala Comunitaria: ${room.name} (${room.tag})` },
        { id: 2, sender: 'system', text: `🟢 ${room.users} estudiantes compartiendo en vivo.` },
        { id: 3, sender: 'peer', author: 'FlyingJay_99', avatar: '🦊', text: '¡Hola a todos en la sala! 👋 ¿Cómo van con sus avances de esta semana?', time: 'hace 2m' },
        { id: 4, sender: 'peer', author: 'Búho_Científica', avatar: '🦉', text: '¡Buenas! Con bastante carga académica pero aquí nos apoyamos entre todos 💪', time: 'hace 1m' }
      ]);
    }
  }, [location.state]);

  useEffect(() => {
    sessionStorage.setItem('chat_connected', connected);
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));
    sessionStorage.setItem('chat_history', JSON.stringify(history));
  }, [connected, messages, history]);

  const leaveRoom = () => {
    sessionStorage.removeItem('active_chat_room');
    setActiveRoom(null);
    setConnected(false);
    setMessages([]);
    setHistory([]);
  };

  const { handleSOS } = useOutletContext();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerTyping]);

  const startSearch = () => {
    setSearching(true);
    setSearchProgress(0);
    
    // Animate search progress
    const interval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setSearchProgress(100);
      setSearching(false);
      setConnected(true);
      setMessages([
        { id: 1, sender: 'system', text: '🔒 Conexión segura y anónima establecida.' },
        { id: 2, sender: 'system', text: 'Estás hablando con BuhoNocturno 🦉' }
      ]);
      setPeerTyping(true);
      
      setTimeout(() => {
        setPeerTyping(false);
        setMessages(prev => [...prev, { id: 3, sender: 'peer', text: t('student.chat.emptyState'), time: new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'}) }]);
      }, 1800);
      
    }, 2000);
  };

  // ─── Sistema de respuestas locales: dinámicas, personalizadas, sin repetición ───
  const usedResponsesRef = useRef(new Set());

  const getLocalFallbackResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const originalMsg = userMessage.trim();
    
    // ─── Extraer contexto del diario emocional ───
    let moodContext = null;
    try {
      const saved = localStorage.getItem('mente_libre_moods');
      if (saved) {
        const moods = safeJSONParse(saved, []);
        if (moods?.length > 0) {
          const latest = moods[0];
          moodContext = { label: latest.mood?.label, emoji: latest.mood?.emoji, note: latest.note, date: latest.date };
        }
      }
    } catch {}

    // ─── Detectar emociones y temas ───
    const detected = [];
    const emotionMap = {
      soledad: ['solo', 'soledad', 'nadie me', 'sin amigos', 'me ignoran', 'me dejan', 'abandonar', 'dejaron de lado', 'aislado'],
      tristeza: ['triste', 'tristeza', 'llorar', 'lloro', 'deprimido', 'depresion', 'horrible', 'fatal', 'no puedo mas', 'destrozado'],
      estres: ['estres', 'estresado', 'agobiado', 'presion', 'examen', 'tarea', 'universidad', 'trabajo', 'abrumado', 'saturado'],
      ansiedad: ['ansioso', 'ansiedad', 'nervios', 'panico', 'miedo', 'angustia', 'preocupado', 'ataques'],
      enojo: ['enojado', 'rabia', 'furioso', 'odio', 'injusto', 'coraje', 'enojo', 'harto', 'frustrado'],
      relaciones: ['amigos', 'pareja', 'novio', 'novia', 'familia', 'papa', 'mama', 'hermano', 'relacion', 'pelea'],
      autoestima: ['feo', 'inutil', 'no sirvo', 'fracaso', 'tonto', 'no valgo', 'inseguro', 'inseguridad'],
      saludo: ['hola', 'hey', 'buenas', 'que tal', 'como estas', 'hi', 'holaaaa'],
      gratitud: ['gracias', 'thanks', 'te agradezco', 'genial gracias'],
      positivo: ['bien', 'genial', 'feliz', 'contento', 'mejor', 'increible', 'perfecto'],
      mal_general: ['mal', 'pesimo', 'no se que hacer', 'ayuda', 'necesito hablar', 'no aguanto']
    };

    for (const [emotion, keywords] of Object.entries(emotionMap)) {
      if (keywords.some(kw => msg.includes(kw))) {
        detected.push(emotion);
      }
    }

    // ─── Extraer fragmento del usuario para reflejar ───
    const extractFragment = () => {
      // Tomar una parte significativa del mensaje del usuario
      const words = originalMsg.split(/\s+/);
      if (words.length <= 4) return originalMsg.toLowerCase();
      // Tomar las últimas 4-6 palabras significativas
      const meaningful = words.filter(w => w.length > 2).slice(-5).join(' ').toLowerCase();
      return meaningful || originalMsg.toLowerCase();
    };

    // ─── Bloques de construcción de respuestas ───
    const blocks = {
      openers: {
        soledad: ['Oye, lo que describes suena a una soledad real', 'Sentirse solo es una de las cosas más difíciles', 'La soledad que sientes es completamente válida'],
        tristeza: ['Lo que estás sintiendo importa mucho', 'Esa tristeza que cargas no es poca cosa', 'Puedo sentir que esto te pesa mucho'],
        estres: ['Uf, suena a que llevas demasiado encima', 'El peso que describes es real', 'Veo que estás cargando con mucho ahora'],
        ansiedad: ['Esa sensación de ansiedad es agotadora', 'Lo que describes suena a una ansiedad intensa', 'Puedo imaginar lo difícil que es sentir eso'],
        enojo: ['Tu enojo tiene todo el sentido', 'Esa frustración que sientes es completamente válida', 'Es normal sentir rabia ante eso'],
        relaciones: ['Las relaciones pueden ser complicadas', 'Los problemas con personas cercanas duelen diferente', 'Entiendo que eso con las personas que quieres duele mucho'],
        autoestima: ['Oye, sé que a veces la mente nos dice cosas feas', 'Esos pensamientos sobre ti mismo no son la realidad', 'Lo que sientes no define quién eres'],
        mal_general: ['Puedo notar que no la estás pasando bien', 'Lo que sientes es válido, no tienes que justificarlo', 'A veces todo se junta y es demasiado'],
        saludo: ['¡Hey, qué bueno verte por aquí! 🦉', 'Hola! Me alegra que hayas venido 😊', '¡Buenas! Estoy por aquí para lo que necesites'],
        gratitud: ['No tienes nada que agradecer', 'Para eso estamos, en serio', 'Me alegra que te sirva hablar'],
        positivo: ['¡Eso me encanta escuchar!', '¡Qué bueno! Me alegra mucho por ti', 'Oye, qué bien se siente eso']
      },
      reflections: [
        `cuando dices "${extractFragment()}", te escucho de verdad`,
        `eso que mencionas me parece importante`,
        `lo que describes dice mucho de lo que estás viviendo`,
        `puedo sentir que esto es algo que te afecta profundamente`,
        `noto que esto es algo que te pesa de verdad`
      ],
      validations: [
        'y quiero que sepas que está bien sentirse así',
        'no tienes que pretender que estás bien',
        'tus sentimientos son 100% válidos',
        'no estás exagerando, lo que sientes es real',
        'cualquiera en tu lugar se sentiría así',
        'que tengas el valor de decirlo ya es mucho'
      ],
      questions: {
        soledad: ['¿Hay algo en particular que te hizo sentir así últimamente?', '¿Cuándo empezaste a sentirte así?', '¿Quieres contarme más sobre lo que pasó?'],
        tristeza: ['¿Qué fue lo que desencadenó esto?', '¿Hay algo que normalmente te ayuda cuando te sientes así?', '¿Quieres desahogarte un poco más?'],
        estres: ['¿Cuál es la cosa que más te está presionando?', '¿Quieres que pensemos juntos en cómo priorizar?', '¿Desde cuándo te sientes así de agobiado?'],
        ansiedad: ['¿Estás en un lugar seguro ahora?', '¿Puedes intentar la técnica 4-4-4? (inhala 4s, mantén 4s, exhala 4s)', '¿Qué es lo que más te preocupa en este momento?'],
        enojo: ['¿Qué fue lo que pasó?', '¿Cómo te hizo sentir eso exactamente?', '¿Necesitas desahogarte o quieres que pensemos en qué hacer?'],
        relaciones: ['¿Qué pasó entre ustedes?', '¿Esto viene de algo reciente o ya lleva tiempo?', '¿Cómo te hace sentir esa situación?'],
        autoestima: ['¿Qué te llevó a pensar eso de ti?', '¿Desde cuándo te sientes así contigo mismo?', '¿Hay algo que te gustaría cambiar?'],
        mal_general: ['¿Quieres contarme qué está pasando?', '¿Hay algo específico que te tiene así?', 'Cuéntame lo que necesites, sin filtros 🤗'],
        saludo: ['¿Cómo estás hoy? Cuéntame lo que sea 💙', '¿Cómo va tu día?', '¿Qué te trae por aquí hoy?'],
        gratitud: ['¿Hay algo más en lo que pueda ayudarte?', 'Siempre voy a estar aquí para ti 💙', '¿Cómo te sientes ahora?'],
        positivo: ['¿Qué te tiene de buen humor? 😊', '¿Qué fue lo bueno que pasó?', 'Cuéntame, quiero saber qué te hizo sentir así 🎉']
      },
      advice: {
        soledad: ['A veces ayuda recordar que la soledad es temporal, aunque no se sienta así', 'Conectar con una sola persona puede hacer toda la diferencia'],
        tristeza: ['Llorar no es debilidad, es tu cuerpo procesando lo que siente', 'A veces escribir lo que sientes ayuda a sacarlo'],
        estres: ['Intenta hacer una cosa a la vez, no todo al mismo tiempo', 'Prueba los 5 minutos: trabaja solo 5 min en algo y ve si puedes seguir'],
        ansiedad: ['Enfócate en algo que puedas tocar o ver ahora mismo, eso te ancla al presente', 'Recuerda: la ansiedad miente, tú puedes más que ella'],
        enojo: ['A veces ayuda escribir lo que sientes antes de hablar con la persona', 'El enojo es energía, a veces se puede canalizar en algo productivo'],
        relaciones: ['Dar espacio a veces es la mejor forma de cuidar una relación', 'Comunicar cómo te sientes (sin atacar) puede cambiar todo'],
        autoestima: ['Trata de hablarte como le hablarías a tu mejor amigo', 'Eres mucho más que tus errores o lo que otros digan'],
      },
      emojis: ['💙', '🤗', '😊', '🦉', '💪', '✨', '🫂', '🌟', '❤️‍🩹']
    };

    // ─── Construir respuesta dinámica ───
    const primaryEmotion = detected[0] || 'mal_general';
    const emoji = blocks.emojis[Math.floor(Math.random() * blocks.emojis.length)];

    // Elegir componentes sin repetir
    const pick = (arr) => {
      const available = arr.filter(r => !usedResponsesRef.current.has(r));
      const pool = available.length > 0 ? available : arr; // Si todos usados, resetear
      const choice = pool[Math.floor(Math.random() * pool.length)];
      usedResponsesRef.current.add(choice);
      // Limitar memoria a 30 respuestas
      if (usedResponsesRef.current.size > 30) {
        const arr = [...usedResponsesRef.current];
        usedResponsesRef.current = new Set(arr.slice(-15));
      }
      return choice;
    };

    // ─── Estrategias de respuesta (varía la estructura) ───
    const messageCount = messages.length;
    const strategy = messageCount % 5;

    let response = '';
    
    if (['saludo', 'gratitud', 'positivo'].includes(primaryEmotion)) {
      // Respuestas cortas para saludos/gratitud/positivo
      const opener = pick(blocks.openers[primaryEmotion] || blocks.openers.mal_general);
      const question = pick(blocks.questions[primaryEmotion] || blocks.questions.mal_general);
      response = `${opener} ${emoji}. ${question}`;
    } else if (strategy === 0) {
      // Estrategia: Opener + Reflexión + Pregunta
      const opener = pick(blocks.openers[primaryEmotion] || blocks.openers.mal_general);
      const reflection = pick(blocks.reflections);
      const question = pick(blocks.questions[primaryEmotion] || blocks.questions.mal_general);
      response = `${opener}, ${reflection} ${emoji}. ${question}`;
    } else if (strategy === 1) {
      // Estrategia: Validación directa + Pregunta
      const validation = pick(blocks.validations);
      const question = pick(blocks.questions[primaryEmotion] || blocks.questions.mal_general);
      response = `Oye, ${validation} ${emoji}. ${question}`;
    } else if (strategy === 2) {
      // Estrategia: Opener + Consejo suave
      const opener = pick(blocks.openers[primaryEmotion] || blocks.openers.mal_general);
      const adviceArr = blocks.advice[primaryEmotion];
      if (adviceArr) {
        const advice = pick(adviceArr);
        response = `${opener} ${emoji}. ${advice}. ¿Cómo te suena eso?`;
      } else {
        const question = pick(blocks.questions[primaryEmotion] || blocks.questions.mal_general);
        response = `${opener} ${emoji}. ${question}`;
      }
    } else if (strategy === 3) {
      // Estrategia: Reflexión personal + Validación
      const reflection = pick(blocks.reflections);
      const validation = pick(blocks.validations);
      response = `Sabes, ${reflection}, y ${validation} ${emoji}. Estoy aquí para ti.`;
    } else {
      // Estrategia: Contexto del diario + Pregunta
      if (moodContext) {
        const dayName = new Date(moodContext.date).toLocaleDateString('es-ES', { weekday: 'long' });
        const question = pick(blocks.questions[primaryEmotion] || blocks.questions.mal_general);
        response = `Me acuerdo que el ${dayName} te sentías ${moodContext.label} ${moodContext.emoji}. ${question}`;
      } else {
        const opener = pick(blocks.openers[primaryEmotion] || blocks.openers.mal_general);
        const question = pick(blocks.questions[primaryEmotion] || blocks.questions.mal_general);
        response = `${opener} ${emoji}. ${question}`;
      }
    }

    // Detectar emociones secundarias y agregar mención si hay más de una
    if (detected.length > 1 && !['saludo', 'gratitud', 'positivo'].includes(primaryEmotion)) {
      const secondary = detected[1];
      const additions = {
        soledad: ' Y si también te sientes solo en esto, aquí estoy.',
        estres: ' Además parece que el estrés no ayuda nada.',
        ansiedad: ' Si sientes ansiedad, intenta respirar hondo.',
        tristeza: ' Sé que la tristeza pesa, pero no la cargues solo.',
        enojo: ' Es normal que eso también te dé coraje.',
        relaciones: ' Los temas con personas cercanas complican todo más.',
      };
      if (additions[secondary]) {
        response += additions[secondary];
      }
    }

    return response;
  };

  // ─── Fetch con timeout (evita esperas infinitas) ───
  const fetchWithTimeout = async (url, options, timeoutMs = 10000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      return response;
    } finally {
      clearTimeout(timer);
    }
  };

  // ─── Generador de respuesta IA con reintentos y fallback local ───
  const generateRealAIResponse = async (userMessage) => {
    // Si no hay API key, usar fallback local directamente
    if (!GEMINI_API_KEY) {
      const fallback = getLocalFallbackResponse(userMessage);
      setHistory(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }, { role: 'model', parts: [{ text: fallback }] }]);
      return fallback;
    }

    const newHistory = [...history, { role: 'user', parts: [{ text: userMessage }] }];
    const modelsToTry = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
    let lastError = null;

    // Construir system prompt con contexto emocional
    let dynamicSystemPrompt = SYSTEM_PROMPT;
    try {
      const savedMoods = localStorage.getItem('mente_libre_moods');
      if (savedMoods) {
        const moodHistory = safeJSONParse(savedMoods, []);
        if (moodHistory && moodHistory.length > 0) {
          const recent = moodHistory.slice(0, 7).map(entry => {
            const date = new Date(entry.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
            return `- ${date}: Se sintió ${entry.mood.label} ${entry.mood.emoji}. ${entry.note ? `Nota: "${entry.note}"` : ''}`;
          }).join('\n');
          dynamicSystemPrompt += `\n\nCONTEXTO PRIVADO DEL USUARIO (DIARIO EMOCIONAL RECIENTE):\n${recent}\n\nUsa este contexto de manera muy sutil y empática para entender su situación actual, demostrando que recuerdas cómo le ha ido en la semana. No digas literalmente "leí tu diario", sino cosas como "Me contaste que el martes estabas estresado...".`;
        }
      }
    } catch (e) {
      console.error("Error reading moods for context", e);
    }

    // Intentar cada modelo con hasta 2 reintentos y backoff exponencial
    for (const model of modelsToTry) {
      const maxRetries = 2;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          // Backoff exponencial: 0ms, 1000ms, 3000ms
          if (attempt > 0) {
            await new Promise(r => setTimeout(r, attempt * 1500));
          }

          const response = await fetchWithTimeout(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: dynamicSystemPrompt }] },
                contents: newHistory,
                generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
              })
            },
            12000 // 12 segundos timeout
          );

          if (response.ok) {
            const data = await response.json();
            const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiReply) {
              setHistory([...newHistory, { role: 'model', parts: [{ text: aiReply }] }]);
              return aiReply;
            }
          }

          const errorData = await response.json().catch(() => ({}));
          lastError = new Error(`HTTP ${response.status}: ${errorData?.error?.message || 'Error'}`);

          // 429 (cuota) o 400 (bad request): no reintentar este modelo
          if ([429, 400, 401, 403].includes(response.status)) break;
          
          // 503 (overloaded): reintentar con backoff
          if (response.status === 503) continue;
          
          // 404 (modelo no encontrado): probar siguiente modelo
          if (response.status === 404) break;

          // Otros errores: reintentar
          continue;

        } catch (err) {
          lastError = err;
          // Si fue timeout (AbortError), reintentar
          if (err.name === 'AbortError') continue;
          // Error de red: reintentar
          continue;
        }
      }
    }

    // ─── FALLBACK LOCAL: si la API falló, responder con empatía local ───
    console.warn('API unavailable, using local fallback. Last error:', lastError?.message);
    const fallbackReply = getLocalFallbackResponse(userMessage);
    setHistory([...newHistory, { role: 'model', parts: [{ text: fallbackReply }] }]);
    return fallbackReply;
  };

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if(!inputText.trim()) return;

    if (checkRiskWords(inputText)) {
      handleSOS();
      setInputText('');
      return;
    }

    const currentInput = inputText;
    const newUserMsg = { id: Date.now(), sender: 'me', text: currentInput, time: new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    
    // Random delay to feel more human
    const typingDelay = 800 + Math.random() * 2000;
    setPeerTyping(true);
    
    const reply = await generateRealAIResponse(currentInput);
    
    // Ensure minimum typing time
    await new Promise(r => setTimeout(r, Math.max(0, typingDelay - 500)));
    
    setPeerTyping(false);
    setMessages(prev => [...prev, { 
      id: Date.now() + 1, 
      sender: 'peer', 
      text: reply,
      time: new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})
    }]);
  };

  const handleQuickReply = async (text) => {
    // Send immediately
    if (checkRiskWords(text)) {
      handleSOS();
      return;
    }

    const newUserMsg = { id: Date.now(), sender: 'me', text, time: new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    
    const typingDelay = 800 + Math.random() * 2000;
    setPeerTyping(true);
    
    const reply = await generateRealAIResponse(text);
    
    await new Promise(r => setTimeout(r, Math.max(0, typingDelay - 500)));
    
    setPeerTyping(false);
    setMessages(prev => [...prev, { 
      id: Date.now() + 1, 
      sender: 'peer', 
      text: reply,
      time: new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})
    }]);
  };

  if (!connected) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ 
          width: '6rem', height: '6rem', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #0f766e 100%)', 
          borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', 
          color: 'white', marginBottom: '1.5rem', 
          boxShadow: '0 0 30px rgba(13, 148, 136, 0.4)',
          animation: searching ? 'pulse-soft 1.5s infinite' : 'none'
        }}>
          <MessageCircle size={32} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('student.chat.headerTitle')}</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '280px' }}>
          {t('student.chat.headerSubtitle')}
        </p>
        
        {!GEMINI_API_KEY && (
           <div style={{ backgroundColor: 'var(--bg-danger)', color: 'var(--accent-rose)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border-danger)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
             <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
             <span>{t('chatMisc.botUnavailable')}</span>
           </div>
        )}

        {searching && (
          <div style={{ width: '200px', marginBottom: '1.5rem' }}>
            <div style={{ height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: 'var(--primary)', borderRadius: '2px', width: `${Math.min(searchProgress, 100)}%`, transition: 'width 0.2s ease' }}></div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>{t('chatMisc.searchingPeer')}</p>
          </div>
        )}

        <button className="btn-primary" onClick={startSearch} disabled={searching} style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
          {searching ? '🔍 Conectando...' : '💬 Buscar Compañero'}
        </button>

        {/* Features */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { emoji: '🔒', text: 'Anónimo' },
            { emoji: '🤖', text: 'IA Empática' },
            { emoji: '🛡️', text: 'Seguro' }
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <AppleEmoji emoji={f.emoji} size={16} /> {f.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--surface)' }} className="animate-fade-in">
      {/* Chat Header */}
      <div style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-color)', padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={leaveRoom} style={{ color: 'var(--text-light)', padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          
          {activeRoom ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'rgba(0, 230, 118, 0.12)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                🚪
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  {activeRoom.name}
                </h2>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00e676', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🟢 {activeRoom.users} en vivo</span>
                  <span>·</span>
                  <span style={{ color: 'var(--text-muted)' }}>{activeRoom.tag}</span>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/app/u/BuhoNocturno" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }} className="author-link">
              <div style={{ backgroundColor: 'var(--bg-color)', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-owl-blink">
                  <AppleEmoji emoji="🦉" size={24} />
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }} className="author-name">BuhoNocturno 🦉</h2>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: peerTyping ? 'var(--primary)' : 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {peerTyping ? t('chatMisc.typing') : <><span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', display: 'inline-block' }}></span> {t('chatMisc.online')}</>}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--bg-color)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : msg.sender === 'system' ? 'center' : 'flex-start', marginBottom: '0.25rem' }} className="animate-slide-up">
            {msg.sender === 'system' ? (
              <div style={{ backgroundColor: 'var(--surface-hover, #e2e8f0)', color: 'var(--text-muted)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>
                {msg.text}
              </div>
            ) : (
              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  padding: '0.75rem 1rem', fontSize: '0.875rem', lineHeight: 1.5,
                  background: msg.sender === 'me' ? 'linear-gradient(135deg, var(--primary) 0%, #0f766e 100%)' : 'var(--surface)',
                  color: msg.sender === 'me' ? 'white' : 'var(--text-main)',
                  borderRadius: '1.25rem',
                  borderBottomRightRadius: msg.sender === 'me' ? '0.25rem' : '1.25rem',
                  borderBottomLeftRadius: msg.sender === 'peer' ? '0.25rem' : '1.25rem',
                  fontWeight: 500,
                  border: msg.sender === 'peer' ? '1px solid var(--border-color)' : 'none',
                  boxShadow: msg.sender === 'me' ? '0 4px 10px rgba(13,148,136,0.3)' : 'var(--shadow-sm)'
                }}>
                  {msg.text}
                </div>
                {msg.time && (
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-light)', marginTop: '0.25rem', textAlign: msg.sender === 'me' ? 'right' : 'left', padding: '0 0.25rem' }}>
                    {msg.time}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {peerTyping && (
           <div style={{ display: 'flex', justifyContent: 'flex-start' }} className="animate-slide-up">
             <div style={{ backgroundColor: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '1.25rem', borderBottomLeftRadius: '0.25rem', border: '1px solid var(--border-color)', display: 'flex', gap: '4px', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
               <span className="typing-dot"></span>
               <span className="typing-dot"></span>
               <span className="typing-dot"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 3 && !peerTyping && (
        <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }} className="no-scrollbar">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(qr)}
              style={{ whiteSpace: 'nowrap', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-color)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', padding: '0.25rem 0.25rem 0.25rem 1rem' }}>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder={t('student.chat.inputPlaceholder')}
              style={{ flex: 1, backgroundColor: 'transparent', padding: '0.5rem 0', border: 'none', outline: 'none', fontSize: '0.875rem', color: 'var(--text-main)' }} 
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || peerTyping} 
              style={{ 
                backgroundColor: inputText.trim() && !peerTyping ? 'var(--primary)' : 'var(--border-color)', 
                color: 'white', width: '2.25rem', height: '2.25rem', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
