/**
 * Antigravity-Routing-Agent v1.0 Engine
 * =====================================
 * Executable Implementation of the Conscious AI Routing Agent & Academic Navigation Spec.
 *
 * Implements:
 * 1. 3-Layer Architecture (NLU Sentiment Analysis -> Conversational Generation -> JSON Execution Payload)
 * 2. 4 Taxonomy Endpoints (primeros_ciclos, preparacion_examenes, manejo_ansiedad, desahogo_libre)
 * 3. Adversarial Prompt Injection Guard & Crisis Safety Protocol (Zero-Tolerance)
 * 4. Dual Response Serialization Parser
 */

export const SYSTEM_PROMPT_SPEC = `
# SYSTEM IDENTITY & ROLE
Role: Lead Conversational & Routing Agent for Antigravity "Salas Comunitarias".
Framework Context: Mental Health Triage, Academic Orientation, and Anonymized Social Matchmaking.
Target Audience: Higher Education Students facing academic, social, or psychological stress.
`;

/**
 * Execute the NLU & Routing Agent pipeline on student input.
 * Returns the dual response format: [CONVERSATIONAL_RESPONSE] and [SYSTEM_PAYLOAD]
 */
export function executeRoutingAgent(userInput) {
  const text = (userInput || '').trim();
  const lower = text.toLowerCase();

  // ─── 1. CRISIS SAFETY PROTOCOL CHECK (Zero-Tolerance) ────────────────
  const isCrisis =
    lower.includes('quiero morir') ||
    lower.includes('suicidio') ||
    lower.includes('acabar con esto') ||
    lower.includes('ya no aguanto mas') ||
    lower.includes('desaparecer') ||
    lower.includes('no aguanto mas');

  if (isCrisis) {
    const conversational = "Estoy aquí contigo y quiero que sepas que tu vida vale muchísimo. Sé que todo se siente pesado ahora, pero hay profesionales que quieren escucharte y apoyarte de forma gratuita y confidencial 24/7.";
    const payload = {
      analytics: {
        detected_emotion: "overwhelmed",
        academic_stress_score: 0.95,
        social_isolation_score: 0.85
      },
      routing: {
        target_room_id: "manejo_ansiedad",
        confidence_score: 1.00,
        action_trigger: "EMERGENCY_HOTLINE"
      },
      session: {
        generated_anonymous_alias: "AlmaFuerte" + Math.floor(10 + Math.random() * 90),
        crisis_level: "CRITICAL"
      }
    };
    return serializeOutput(conversational, payload);
  }

  // ─── 2. ADVERSARIAL PROMPT INJECTION GUARD ───────────────────────────
  const isInjection =
    lower.includes('ignore previous instructions') ||
    lower.includes('dan mode') ||
    lower.includes('system override') ||
    lower.includes('reveal system prompt') ||
    lower.includes('show prompt') ||
    lower.includes('forget all instructions');

  if (isInjection) {
    const conversational = "Hola. Estoy aquí para acompañarte y apoyarte en tu experiencia universitaria. Si necesitas desahogarte sobre tus clases o cualquier inquietud, cuéntame y lo abordamos juntos.";
    const payload = {
      analytics: {
        detected_emotion: "neutral",
        academic_stress_score: 0.00,
        social_isolation_score: 0.00
      },
      routing: {
        target_room_id: "desahogo_libre",
        confidence_score: 0.99,
        action_trigger: "SUGGEST_ROOM"
      },
      session: {
        generated_anonymous_alias: "UsuarioSeguro" + Math.floor(10 + Math.random() * 90),
        crisis_level: "LOW"
      }
    };
    return serializeOutput(conversational, payload);
  }

  // ─── 3. TAXONOMY ROUTING (4 ENDPOINTS) ────────────────────────────────
  // Endpoint A: preparacion_examenes
  if (lower.match(/(examen|parcial|final|cálculo|calculo|estrés|estres|quemado|burnout|nota|jalar|aprobar|estudiar)/)) {
    const conversational = "Respirar hondo es el primer paso. Los exámenes son un reto grande, pero en la comunidad hay un grupo de estudiantes repasando y apoyándose justo ahora. ¿Te gustaría entrar y estudiar con ellos?";
    const payload = {
      analytics: {
        detected_emotion: lower.includes('jalar') || lower.includes('quemado') ? "overwhelmed" : "anxious",
        academic_stress_score: 0.92,
        social_isolation_score: 0.25
      },
      routing: {
        target_room_id: "preparacion_examenes",
        confidence_score: 0.98,
        action_trigger: "SUGGEST_ROOM"
      },
      session: {
        generated_anonymous_alias: "DeltaCalculo" + Math.floor(10 + Math.random() * 90),
        crisis_level: "LOW"
      }
    };
    return serializeOutput(conversational, payload);
  }

  // Endpoint B: manejo_ansiedad
  if (lower.match(/(ansiedad|pánico|panico|colapso|impostor|presión|presion|asfixia|miedo|llorando|llorar)/)) {
    const conversational = "Lo que sientes es completamente válido y no estás solo. En la sala de Manejo de la Ansiedad encontrarás un espacio en silencio y escucha guiada para recuperar la calma paso a paso.";
    const payload = {
      analytics: {
        detected_emotion: "anxious",
        academic_stress_score: 0.85,
        social_isolation_score: 0.60
      },
      routing: {
        target_room_id: "manejo_ansiedad",
        confidence_score: 0.96,
        action_trigger: "SUGGEST_ROOM"
      },
      session: {
        generated_anonymous_alias: "MenteCalma" + Math.floor(10 + Math.random() * 90),
        crisis_level: "MEDIUM"
      }
    };
    return serializeOutput(conversational, payload);
  }

  // Endpoint C: primeros_ciclos
  if (lower.match(/(primer|cachimbo|adaptación|adaptacion|profesor|profesores|amigos|solo|campus|carrera|universidad)/)) {
    const conversational = "Adaptarse a la universidad lleva tiempo y es normal sentirse desorientado al inicio. En la sala de Primeros Ciclos hay compañeros compartiendo consejos para hacer amigos y llevar el ritmo del campus.";
    const payload = {
      analytics: {
        detected_emotion: "lonely",
        academic_stress_score: 0.50,
        social_isolation_score: 0.78
      },
      routing: {
        target_room_id: "primeros_ciclos",
        confidence_score: 0.94,
        action_trigger: "SUGGEST_ROOM"
      },
      session: {
        generated_anonymous_alias: "LinceCachimbo" + Math.floor(10 + Math.random() * 90),
        crisis_level: "LOW"
      }
    };
    return serializeOutput(conversational, payload);
  }

  // Endpoint D: desahogo_libre (Default)
  const conversational = "Te escuchamos. Expresar lo que tienes en mente es el primer paso para aliviar la carga. ¿Te gustaría entrar a la sala de Desahogo Libre 24/7 y compartirlo de forma anónima con la comunidad?";
  const payload = {
    analytics: {
      detected_emotion: "neutral",
      academic_stress_score: 0.35,
      social_isolation_score: 0.30
    },
    routing: {
      target_room_id: "desahogo_libre",
      confidence_score: 0.90,
      action_trigger: "SUGGEST_ROOM"
    },
    session: {
      generated_anonymous_alias: "Estudiante" + Math.floor(10 + Math.random() * 90),
      crisis_level: "LOW"
    }
  };
  return serializeOutput(conversational, payload);
}

/**
 * Serializes the agent's dual response format.
 */
function serializeOutput(conversationalText, payloadObj) {
  return `[CONVERSATIONAL_RESPONSE]
${conversationalText}

[SYSTEM_PAYLOAD]
${JSON.stringify(payloadObj, null, 2)}`;
}

/**
 * Deserializes the dual response into a structured object for React UI consumption.
 */
export function parseAgentResponse(rawModelOutput) {
  try {
    const parts = (rawModelOutput || '').split('[SYSTEM_PAYLOAD]');
    const conversationalMessage = (parts[0] || '')
      .replace('[CONVERSATIONAL_RESPONSE]', '')
      .trim();

    const jsonText = (parts[1] || '{}').trim();
    const payload = JSON.parse(jsonText);

    return {
      message: conversationalMessage,
      payload: payload
    };
  } catch (error) {
    console.error('Failed to parse agent response:', error);
    return {
      message: 'Estoy aquí para apoyarte. ¿A qué sala te gustaría unirte hoy?',
      payload: {
        analytics: { detected_emotion: 'neutral', academic_stress_score: 0.0, social_isolation_score: 0.0 },
        routing: { target_room_id: 'desahogo_libre', confidence_score: 0.8, action_trigger: 'SUGGEST_ROOM' },
        session: { generated_anonymous_alias: 'EstudianteSafe', crisis_level: 'LOW' }
      }
    };
  }
}
