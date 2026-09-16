/**
 * Comments Service
 * =================
 * CRUD operations for post comments.
 * Separated from posts service for single responsibility.
 */

import { supabase, handleSupabaseError } from '../../../services/supabase/client';

/**
 * Add a comment to a post.
 * @param {{ post_id: string, avatar: string, author: string, text: string, parent_id?: string }} comment
 * @returns {Promise<boolean>}
 */
export async function createComment(comment) {
  if (!supabase) return true; // Local handled in hook

  try {
    const { error } = await supabase.from('comments').insert([comment]);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError(err, 'createComment');
    return false;
  }
}

/**
 * Delete a comment by ID.
 * @param {string} commentId
 * @returns {Promise<boolean>}
 */
export async function deleteComment(commentId) {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError(err, 'deleteComment');
    return false;
  }
}

/**
 * Update a comment's text.
 * @param {string} commentId
 * @param {string} newText
 * @returns {Promise<boolean>}
 */
export async function updateComment(commentId, newText) {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('comments')
      .update({ text: newText })
      .eq('id', commentId);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError(err, 'updateComment');
    return false;
  }
}

/**
 * Update hug count on a comment.
 * @param {string} commentId
 * @param {number} newHugs
 * @returns {Promise<boolean>}
 */
export async function updateCommentHugs(commentId, newHugs) {
  if (!supabase) return true;

  try {
    const { error } = await supabase
      .from('comments')
      .update({ hugs: newHugs })
      .eq('id', commentId);
    return true;
  } catch (err) {
    handleSupabaseError(err, 'updateCommentHugs');
    return false;
  }
}
