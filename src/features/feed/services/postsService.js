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

/**
 * Fetch all posts with their comments.
 * @returns {Promise<Array>}
 */
export async function fetchPosts() {
  if (!supabase) {
    const local = localStorage.getItem(LOCAL_POSTS_KEY);
    return safeJSONParse(local, []);
  }

  try {
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

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
    return [];
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
