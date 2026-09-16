/**
 * usePosts Hook
 * ==============
 * Manages feed posts state, CRUD operations, and realtime updates.
 * Extracted from AppContext to reduce re-renders — only components
 * that actually use posts will re-render when posts change.
 *
 * Usage:
 *   const { posts, loadingPosts, addPost, deletePost, ... } = usePosts();
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../store/AuthContext';
import * as postsService from '../services/postsService';
import * as commentsService from '../services/commentsService';
import { supabase } from '../../../services/supabase/client';
import { safeJSONParse } from '../../../utils/helpers';

const LOCAL_POSTS_KEY = 'mente-libre-posts';

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // ─── Fetch Posts ────────────────────────────────────────
  const refreshPosts = useCallback(async () => {
    try {
      const data = await postsService.fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error refreshing posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  // ─── Initial load + realtime subscription ───────────────
  useEffect(() => {
    refreshPosts();
    const unsubscribe = postsService.subscribeToPostChanges(refreshPosts);
    return unsubscribe;
  }, [refreshPosts]);

  // ─── Persist local posts when Supabase is not available ─
  useEffect(() => {
    if (!supabase) {
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
    }
  }, [posts]);

  // ─── Add Post ───────────────────────────────────────────
  const addPost = useCallback(
    async (text, tags) => {
      if (!user) return false;

      const newPost = {
        avatar: user.avatar,
        author: user.nickname,
        text,
        tags: tags || [],
      };

      const success = await postsService.createPost(newPost);
      if (success) {
        refreshPosts();
      }
      return success;
    },
    [user, refreshPosts]
  );

  // ─── Delete Post ────────────────────────────────────────
  const deletePost = useCallback(
    async (id) => {
      const success = await postsService.deletePost(id);
      if (success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        refreshPosts();
      }
    },
    [refreshPosts]
  );

  // ─── Update Post ────────────────────────────────────────
  const updatePost = useCallback(
    async (id, newText) => {
      const success = await postsService.updatePost(id, newText);
      if (success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, text: newText } : p))
        );
        refreshPosts();
      }
    },
    [refreshPosts]
  );

  // ─── Toggle Hug ─────────────────────────────────────────
  const toggleHug = useCallback(
    async (id, currentHugs, increment) => {
      const newHugs = increment
        ? Number(currentHugs || 0) + 1
        : Math.max(0, Number(currentHugs || 0) - 1);

      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, hugs: newHugs } : p))
      );

      await postsService.updatePostHugs(id, newHugs);
    },
    []
  );

  // ─── Add Comment ────────────────────────────────────────
  const addComment = useCallback(
    async (postId, text, parentId = null) => {
      if (!user) return false;

      const newComment = {
        post_id: postId,
        avatar: user.avatar,
        author: user.nickname,
        text,
        parent_id: parentId,
      };

      const success = await commentsService.createComment(newComment);
      if (success) {
        refreshPosts();
      }
      return success;
    },
    [user, refreshPosts]
  );

  // ─── Delete Comment ─────────────────────────────────────
  const deleteComment = useCallback(
    async (commentId) => {
      const success = await commentsService.deleteComment(commentId);
      if (success) refreshPosts();
    },
    [refreshPosts]
  );

  // ─── Update Comment ────────────────────────────────────
  const updateComment = useCallback(
    async (commentId, newText) => {
      const success = await commentsService.updateComment(commentId, newText);
      if (success) refreshPosts();
    },
    [refreshPosts]
  );

  // ─── Toggle Comment Hug ────────────────────────────────
  const toggleCommentHug = useCallback(
    async (commentId, currentHugs, isAdding) => {
      const newHugs = isAdding
        ? Number(currentHugs || 0) + 1
        : Math.max(0, Number(currentHugs || 0) - 1);

      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => ({
          ...p,
          comments: p.comments?.map((c) =>
            c.id === commentId ? { ...c, hugs: newHugs } : c
          ),
        }))
      );

      await commentsService.updateCommentHugs(commentId, newHugs);
    },
    []
  );

  // ─── Format posts for UI consumption ────────────────────
  const formattedPosts = posts.map((p) => {
    const isMine = p.author === user?.nickname;
    return {
      ...p,
      avatar: isMine ? user?.avatar : p.avatar,
      time: p.created_at
        ? new Date(p.created_at).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Hace poco',
      isMine,
      isSensitive: p.is_sensitive,
      related: p.tags?.length || 0,
      comments: (p.comments || []).map((c) => {
        const isCommentMine = c.author === user?.nickname;
        return {
          ...c,
          avatar: isCommentMine ? user?.avatar : c.avatar,
          time: c.created_at
            ? new Date(c.created_at).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Hace poco',
          isMine: isCommentMine,
        };
      }),
    };
  });

  return {
    posts: formattedPosts,
    loadingPosts,
    addPost,
    deletePost,
    updatePost,
    toggleHug,
    addComment,
    deleteComment,
    updateComment,
    toggleCommentHug,
    refreshPosts,
  };
}
