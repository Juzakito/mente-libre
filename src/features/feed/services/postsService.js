/**
 * Posts Service
 * ==============
 * Abstracts all post CRUD operations.
 * Handles both Supabase and localStorage fallback modes.
 * Decouples data operations from UI components.
 */

import { supabase, handleSupabaseError } from '../../../services/supabase/client';
import { safeJSONParse } from '../../../utils/helpers';

const LOCAL_POSTS_KEY = 'mente-libre-posts';

export const INITIAL_TALKCAMPUS_POSTS = [
  {
    id: 'tc_1',
    author: 'FlyingJay9577',
    avatar: '🦊',
    authorAge: 19,
    text: 'Siento seguir quejándome de esto, pero me duele que no tenga amigos ni pareja. Simplemente no desaparece. Desearía que la gente fuera más amable. Solo quiero que la gente me quiera.',
    time: '2m',
    created_at: new Date(Date.now() - 120000).toISOString(),
    hugs: 14,
    tags: ['Sad', '#SaludMental', '#Universidad', '#Desahogo'],
    comments: [
      { id: 'c1', author: 'DeltaClover1000', text: 'No estás solo en esto, aquí tienes a toda una comunidad que te apoya.', created_at: new Date().toISOString() },
      { id: 'c2', author: 'EarthAngel9', text: 'Respira profundo, los vínculos sinceros toman tiempo pero llegan.', created_at: new Date().toISOString() },
      { id: 'c3', author: 'IvoryBird2653', text: 'Te mando un abrazo fuerte amigo.', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'tc_2',
    author: 'EarthAngel9',
    avatar: '🦄',
    authorAge: 22,
    text: 'Mi nuevo enfoque ante mi próxima cita médica. Cuando la vea, sonreiré y escucharé lo que tenga que decir, sin juzgar su posición. Siento que cuando mantengo una postura abierta las cosas fluyen con más calma y comprensión mutua.',
    time: '4m',
    created_at: new Date(Date.now() - 240000).toISOString(),
    hugs: 28,
    tags: ['Hopeful', '#Científica', '#Amistad', '#Universidad'],
    comments: [
      { id: 'c4', author: 'FlyingJay9577', text: '¡Esa actitud es inspiradora!', created_at: new Date().toISOString() },
      { id: 'c5', author: 'DeltaClover1000', text: 'Mucho éxito en tu consulta.', created_at: new Date().toISOString() },
      { id: 'c6', author: 'Anxious_Soul', text: '¡Qué gran perspectiva!', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'tc_3',
    author: 'IvoryBird2653',
    avatar: '🐱',
    authorAge: 25,
    text: 'Me hice un tatuaje horrible... Estoy de intercambio en el campus y no puedo concentrarme; mi vida se está desmoronando y odio todo lo que me está pasando. No puedo creer que haya metido tanto la pata y no sé qué voy a hacer para arreglarlo.',
    time: '22m',
    created_at: new Date(Date.now() - 1320000).toISOString(),
    hugs: 9,
    tags: ['Anxious', '#Exámenes', '#PrimerAño', '#Desahogo'],
    comments: [
      { id: 'c7', author: 'FlyingJay9577', text: 'Cálmate, casi todo tiene solución o cobertura. No te juzgues tan duro.', created_at: new Date().toISOString() },
      { id: 'c8', author: 'EarthAngel9', text: 'Estar de intercambio trae mucha presión acumulada, date un respiro hoy.', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'tc_4',
    author: 'NoticiasCampus',
    avatar: '🦉',
    authorAge: 21,
    text: '📢 [COMUNICADO OFICIAL UCS] Taller gratuito de Manejo del Estrés Académico y Mindfulness en el Campus Científica. Este jueves a las 4:00 PM. ¡Cupos libres para todos los estudiantes universitarios!',
    time: '45m',
    created_at: new Date(Date.now() - 2700000).toISOString(),
    hugs: 45,
    tags: ['#Noticias', '#Científica', '#SaludMental', '#Universidad'],
    comments: [
      { id: 'c9', author: 'FlyingJay9577', text: '¡Genial! Me voy a inscribir con mis compañeros.', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'tc_5',
    author: 'CosmicBuddy_QA',
    avatar: '🤖',
    authorAge: 20,
    text: '¿Alguien más siente que la semana de exámenes parciales paraliza los pensamientos? ¿Qué hábitos de estudio o pausas activas les funcionan a ustedes para mantener la calma?',
    time: '1h',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    hugs: 18,
    tags: ['#Preguntas', '#Exámenes', '#Estudio', '#Universidad'],
    comments: [
      { id: 'c10', author: 'EarthAngel9', text: 'Técnica Pomodoro de 25 min y caminata de 5 min al aire libre me salva la vida.', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'tc_6',
    author: 'BúhoEstudiantil',
    avatar: '🦉',
    authorAge: 18,
    text: 'Primer año de Universidad Científica del Sur y la adaptación me está costando más de lo que pensaba. A veces extraño mi casa pero sé que dar el máximo valdrá la pena. ¡Un día a la vez! 💚',
    time: '2h',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    hugs: 32,
    tags: ['#PrimerAño', '#Científica', '#Universidad', '#Motivado'],
    comments: [
      { id: 'c11', author: 'IvoryBird2653', text: 'El primer semestre siempre es duro, pero te acostumbras rápido. ¡Fuerza!', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'tc_7',
    author: 'MedicinaSoul',
    avatar: '👽',
    authorAge: 24,
    text: 'Aprobé mi examen de anatomía clínica tras semanas de desvelos y ansiedad. Agradecido con mi grupo de estudio por no dejarme tirar la toalla. 🙏✨',
    time: '3h',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    hugs: 50,
    tags: ['#Medicina', '#Exámenes', '#Agradecido', '#SaludMental'],
    comments: [
      { id: 'c12', author: 'NoticiasCampus', text: '¡Felicidades futuro médico!', created_at: new Date().toISOString() }
    ]
  }
];

/**
 * Fetch all posts with their comments.
 * @returns {Promise<Array>}
 */
export async function fetchPosts() {
  if (!supabase) {
    const local = localStorage.getItem(LOCAL_POSTS_KEY);
    const parsed = safeJSONParse(local, null);
    if (!parsed || parsed.length === 0) {
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(INITIAL_TALKCAMPUS_POSTS));
      return INITIAL_TALKCAMPUS_POSTS;
    }
    return parsed;
  }

  try {
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    if (!postsData || postsData.length === 0) {
      return INITIAL_TALKCAMPUS_POSTS;
    }

    // Fetch comments separately (table may not exist yet)
    let commentsData = [];
    try {
      const { data: cData, error: cError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });
      if (!cError && cData) commentsData = cData;
    } catch {
      console.warn('Comments table not available yet.');
    }

    // Combine posts with their comments
    return (postsData || []).map((p) => ({
      ...p,
      comments: commentsData.filter((c) => c.post_id === p.id),
    }));
  } catch (err) {
    handleSupabaseError(err, 'fetchPosts');
    return INITIAL_TALKCAMPUS_POSTS;
  }
}

/**
 * Create a new post.
 * @param {{ avatar: string, author: string, text: string, tags: string[] }} post
 * @returns {Promise<boolean>} Success
 */
export async function createPost(post) {
  if (!supabase) {
    // Local fallback
    const local = safeJSONParse(localStorage.getItem(LOCAL_POSTS_KEY), []);
    const newPost = {
      ...post,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      hugs: 0,
      is_sensitive: false,
      comments: [],
    };
    localStorage.setItem(
      LOCAL_POSTS_KEY,
      JSON.stringify([newPost, ...local])
    );
    return true;
  }

  try {
    const { error } = await supabase.from('posts').insert([
      {
        avatar: post.avatar,
        author: post.author,
        text: post.text,
        tags: post.tags || [],
        hugs: 0,
        is_sensitive: false,
      },
    ]);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError(err, 'createPost');
    return false;
  }
}

/**
 * Update a post's text.
 * @param {string} id
 * @param {string} newText
 * @returns {Promise<boolean>}
 */
export async function updatePost(id, newText) {
  if (!supabase) return true; // Local handled in hook

  try {
    const { error } = await supabase
      .from('posts')
      .update({ text: newText })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError(err, 'updatePost');
    return false;
  }
}

/**
 * Delete a post.
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deletePost(id) {
  if (!supabase) return true;

  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError(err, 'deletePost');
    return false;
  }
}

/**
 * Update hug count on a post.
 * @param {string} id
 * @param {number} newHugs
 * @returns {Promise<boolean>}
 */
export async function updatePostHugs(id, newHugs) {
  if (!supabase) return true;

  try {
    await supabase.from('posts').update({ hugs: newHugs }).eq('id', id);
    return true;
  } catch (err) {
    handleSupabaseError(err, 'updatePostHugs');
    return false;
  }
}

/**
 * Subscribe to realtime changes on posts and comments.
 * @param {Function} onUpdate - Callback when data changes
 * @returns {Function} Unsubscribe function
 */
export function subscribeToPostChanges(onUpdate) {
  if (!supabase) return () => {};

  const channelName = `posts_changes_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      () => onUpdate()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'comments' },
      () => onUpdate()
    )
    .subscribe();

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch (e) {
      console.warn('Error removing channel:', e);
    }
  };
}
