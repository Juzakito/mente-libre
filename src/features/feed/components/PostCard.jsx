import React, { useState } from 'react';
import { Heart, Sparkles, EyeOff, Trash2, Edit3, Check, MessageCircle, Repeat2, BarChart2, Bookmark, Share, X } from 'lucide-react';
import { useAuth } from '../../../store/AuthContext';
import { usePosts } from '../hooks/usePosts';
import { safeJSONParse } from '../../../utils/helpers';
import { useOutletContext, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppleEmoji from '../../../components/ui/AppleEmoji';

export default function PostCard({ post }) {
  const { user } = useAuth();
  const { deletePost, updatePost, toggleHug, addComment, deleteComment, updateComment, toggleCommentHug } = usePosts();
  const outletCtx = useOutletContext();
  const showToast = outletCtx?.showToast || console.log;
  const { t } = useTranslation();
  const [showSensitive, setShowSensitive] = useState(!post.isSensitive);
  const [related, setRelated] = useState(post.related);
  const [hugAnimating, setHugAnimating] = useState(false);
  const [relatedAnimating, setRelatedAnimating] = useState(false);
  const [hasHugged, setHasHugged] = useState(() => {
    try { return safeJSONParse(localStorage.getItem('likedPosts'), []).includes(post.id); } catch { return false; }
  });
  const [hasRelated, setHasRelated] = useState(() => {
    try { return safeJSONParse(localStorage.getItem('relatedPosts'), []).includes(post.id); } catch { return false; }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [huggedComments, setHuggedComments] = useState(() => {
    try { return safeJSONParse(localStorage.getItem('likedComments'), []); } catch { return []; }
  });
  
  const commentInputRef = React.useRef(null);

  // Comment editing state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const handleHug = () => {
    if (post.isMine) {
      showToast('No puedes darte apoyo a ti mismo, ¡deja que otros lo hagan! 💙');
      return;
    }
    toggleHug(post.id, post.hugs, !hasHugged);
    let liked = [];
    try { liked = safeJSONParse(localStorage.getItem('likedPosts'), []); } catch {}
    
    if (hasHugged) {
      setHasHugged(false);
      localStorage.setItem('likedPosts', JSON.stringify(liked.filter(id => id !== post.id)));
    } else {
      setHasHugged(true);
      setHugAnimating(true);
      localStorage.setItem('likedPosts', JSON.stringify([...liked, post.id]));
      setTimeout(() => setHugAnimating(false), 300);
    }
  };

  const handleRelated = () => {
    if (post.isMine) return; // Prevent reacting to own post
    let relatedArr = [];
    try { relatedArr = safeJSONParse(localStorage.getItem('relatedPosts'), []); } catch {}
    
    if (hasRelated) {
      setRelated(r => r - 1);
      setHasRelated(false);
      localStorage.setItem('relatedPosts', JSON.stringify(relatedArr.filter(id => id !== post.id)));
    } else {
      setRelated(r => r + 1);
      setHasRelated(true);
      setRelatedAnimating(true);
      localStorage.setItem('relatedPosts', JSON.stringify([...relatedArr, post.id]));
      setTimeout(() => setRelatedAnimating(false), 300);
    }
  };

  const handleCommentSubmit = (e, parentId = null) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const finalCommentText = replyingTo ? `@${replyingTo} ${commentText}` : commentText;
    addComment(post.id, finalCommentText, parentId);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleReplyClick = (authorName, commentId) => {
    setReplyingTo(authorName);
    setReplyingToId(commentId);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 50);
  };

  const [replyingToId, setReplyingToId] = useState(null);

  const topLevelComments = post.comments?.filter(c => !c.parent_id) || [];
  
  const getReplies = (parentId) => {
    return post.comments?.filter(c => c.parent_id === parentId) || [];
  };

  const handleCommentHug = (commentId, currentHugs, commentAuthor) => {
    if (commentAuthor === user?.nickname) return;
    const isHugged = huggedComments.includes(commentId);
    toggleCommentHug(commentId, currentHugs, !isHugged);
    
    let updated;
    if (isHugged) {
      updated = huggedComments.filter(id => id !== commentId);
    } else {
      updated = [...huggedComments, commentId];
    }
    setHuggedComments(updated);
    localStorage.setItem('likedComments', JSON.stringify(updated));
  };
  
  return (
    <div className="card animate-fade-in" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.2s ease', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }}
         onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
         onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to={`/app/u/${post.author}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="author-link">
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              <AppleEmoji emoji={post.isMine ? (user?.avatar || post.avatar) : post.avatar} size={32} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.875rem' }} className="author-name">{post.author}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{post.time}</div>
            </div>
          </Link>
        </div>
        
        {post.isMine && !isEditing && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(!post.created_at || (Date.now() - new Date(post.created_at).getTime()) < 300000) && (
              <button onClick={() => setIsEditing(true)} style={{ color: 'var(--text-light)', background: 'transparent', cursor: 'pointer' }} title="Editar (solo los primeros 5 min)">
                <Edit3 size={18} />
              </button>
            )}
            <button onClick={() => deletePost(post.id)} style={{ color: 'var(--accent-rose)', background: 'transparent', cursor: 'pointer' }}>
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
      
      {!showSensitive && !isEditing ? (
        <div className="glass" style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', margin: '0.5rem 0', backdropFilter: 'blur(8px)' }}>
          <EyeOff color="var(--text-light)" size={24} style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-muted)' }}>{t('student.feed.sensitive')}</p>
          <button onClick={() => setShowSensitive(true)} style={{ marginTop: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontSize: '0.75rem', fontWeight: 800, padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 10px rgba(13,148,136,0.3)' }}>
            {t('student.feed.viewContent')}
          </button>
        </div>
      ) : isEditing ? (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'vertical' }}
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button onClick={() => { setIsEditing(false); setEditText(post.text); }} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 800, cursor: 'pointer' }}>
              {t('student.feed.cancel')}
            </button>
            <button onClick={() => { updatePost(post.id, editText); setIsEditing(false); }} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', cursor: 'pointer' }}>
              <Check size={14} /> {t('student.feed.save')}
            </button>
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem', wordBreak: 'break-word' }}>
          {post.text}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 800, flexWrap: 'wrap' }}>
          <button onClick={handleHug} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-rose)', backgroundColor: hasHugged ? 'var(--bg-danger)' : 'transparent', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => !hasHugged && (e.currentTarget.style.backgroundColor = 'var(--bg-danger)')} onMouseLeave={(e) => !hasHugged && (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Heart size={16} fill={hasHugged ? "var(--accent-rose)" : "none"} color="var(--accent-rose)" className={hugAnimating ? 'animate-pop' : ''} /> {post.hugs}
          </button>
          <button onClick={handleRelated} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', backgroundColor: hasRelated ? 'var(--primary-light)' : 'transparent', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => !hasRelated && (e.currentTarget.style.backgroundColor = 'var(--primary-light)')} onMouseLeave={(e) => !hasRelated && (e.currentTarget.style.backgroundColor = 'transparent')}>
            <Sparkles size={16} fill={hasRelated ? "var(--primary)" : "none"} color="var(--primary)" className={relatedAnimating ? 'animate-pop' : ''} /> {related}
          </button>
          <button onClick={() => setShowComments(!showComments)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', backgroundColor: showComments ? 'var(--surface)' : 'transparent', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => !showComments && (e.currentTarget.style.backgroundColor = 'var(--surface)')} onMouseLeave={(e) => !showComments && (e.currentTarget.style.backgroundColor = 'transparent')}>
            <MessageCircle size={16} /> {post.comments?.length || 0}
          </button>
        </div>
      </div>

      {showComments && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }} className="animate-slide-up">
          
          {!replyingToId && (
            <form onSubmit={(e) => handleCommentSubmit(e, null)} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
                <AppleEmoji emoji={user?.avatar || '🦊'} size={32} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t('student.feed.replyPlaceholder')}
                  style={{ width: '100%', minHeight: '60px', padding: '0.5rem 0', border: 'none', backgroundColor: 'transparent', fontSize: '1rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                  <button type="submit" disabled={!commentText.trim()} style={{ backgroundColor: commentText.trim() ? 'var(--primary)' : 'var(--border-color)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: commentText.trim() ? 'pointer' : 'default', transition: 'background-color 0.2s', boxShadow: commentText.trim() ? '0 4px 10px rgba(13,148,136,0.3)' : 'none' }}>
                    {t('student.feed.replyBtn')}
                  </button>
                </div>
              </div>
            </form>
          )}

          {topLevelComments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {topLevelComments.map((c) => {
                const replies = getReplies(c.id);
                return (
                  <div key={c.id} style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0, zIndex: 2 }}>
                          <AppleEmoji emoji={c.isMine ? (user?.avatar || c.avatar) : c.avatar} size={24} />
                        </div>
                        {replies.length > 0 && (
                          <div style={{ flex: 1, width: '2px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }}></div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                          <Link to={`/app/u/${c.author}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="author-name">{c.author}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>@{c.author.replace(/\s/g, '').toLowerCase()}</span>
                          </Link>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>· {c.time || 'Reciente'}</span>
                          
                          {c.isMine && editingCommentId !== c.id && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                              {(!c.created_at || (Date.now() - new Date(c.created_at).getTime()) < 300000) && (
                                <button onClick={() => { setEditingCommentId(c.id); setEditCommentText(c.text); }} style={{ color: 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }} title="Editar (solo los primeros 5 min)">
                                  <Edit3 size={16} strokeWidth={2} />
                                </button>
                              )}
                              <button onClick={() => { if(window.confirm('¿Borrar?')) deleteComment(c.id); }} style={{ color: 'var(--accent-rose)', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                                <Trash2 size={16} strokeWidth={2} />
                              </button>
                            </div>
                          )}
                        </div>
                        {editingCommentId === c.id ? (
                          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <textarea 
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              style={{ width: '100%', minHeight: '60px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', fontSize: '0.95rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
                              autoFocus
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <button onClick={() => setEditingCommentId(null)} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}>
                                {t('student.feed.cancel')}
                              </button>
                              <button onClick={() => { updateComment(c.id, editCommentText); setEditingCommentId(null); }} style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}>
                                {t('student.feed.save')}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, wordBreak: 'break-word', lineHeight: 1.5 }}>
                              {c.text}
                            </p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '425px', marginTop: '0.75rem', color: 'var(--text-light)' }}>
                              <button onClick={() => handleReplyClick(c.author, c.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                <MessageCircle size={18} strokeWidth={1.5} />
                              </button>
                              <button onClick={() => showToast('¡Retuiteado! (Demo)')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                <Repeat2 size={18} strokeWidth={1.5} />
                              </button>
                              <button 
                                onClick={() => handleCommentHug(c.id, c.hugs, c.author)} 
                                disabled={c.author === user?.nickname}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: huggedComments.includes(c.id) ? 'var(--accent-rose)' : 'var(--text-light)', background: 'transparent', cursor: c.author === user?.nickname ? 'not-allowed' : 'pointer', padding: 0, opacity: c.author === user?.nickname ? 0.5 : 1 }} 
                                className="twitter-action-btn"
                              >
                                <Heart size={18} strokeWidth={1.5} fill={huggedComments.includes(c.id) ? 'var(--accent-rose)' : 'none'} />
                                {c.hugs > 0 && <span style={{ fontSize: '0.75rem' }}>{c.hugs}</span>}
                              </button>
                              <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                <BarChart2 size={18} strokeWidth={1.5} />
                              </button>
                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => showToast('Guardado (Demo)')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                  <Bookmark size={18} strokeWidth={1.5} />
                                </button>
                                <button onClick={() => showToast('Enlace copiado (Demo)')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                  <Share size={18} strokeWidth={1.5} />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Inline Reply Form */}
                    {replyingToId === c.id && (
                      <form onSubmit={(e) => { setReplyingToId(null); handleCommentSubmit(e, c.id); }} style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', marginLeft: '3.25rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '2rem', height: '2rem', backgroundColor: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                          <AppleEmoji emoji={user?.avatar || '🦊'} size={24} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>{t('student.feed.replyingTo')} <span style={{ color: 'var(--primary)' }}>@{replyingTo.replace(/\s/g, '')}</span></span>
                            <button type="button" onClick={() => setReplyingToId(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                              <X size={14} />
                            </button>
                          </div>
                          <textarea 
                            ref={commentInputRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={t('student.feed.replyPlaceholder')}
                            style={{ width: '100%', minHeight: '60px', padding: '0.5rem 0', border: 'none', backgroundColor: 'transparent', fontSize: '1rem', color: 'var(--text-main)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                            <button type="submit" disabled={!commentText.trim()} style={{ backgroundColor: commentText.trim() ? 'var(--primary)' : 'var(--border-color)', color: 'white', padding: '0.4rem 1rem', borderRadius: '9999px', fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: commentText.trim() ? 'pointer' : 'default', transition: 'background-color 0.2s' }}>
                              {t('student.feed.replyBtn')}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Replies mapping */}
                    {replies.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                        {replies.map(reply => (
                          <div key={reply.id} style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <div style={{ width: '3.25rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                              <div style={{ width: '2rem', height: '2rem', backgroundColor: 'var(--bg-color)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                                <AppleEmoji emoji={reply.isMine ? (user?.avatar || reply.avatar) : reply.avatar} size={20} />
                              </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                <Link to={`/app/u/${reply.author}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="author-name">{reply.author}</span>
                                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>@{reply.author.replace(/\s/g, '').toLowerCase()}</span>
                                </Link>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>· {reply.time || 'Reciente'}</span>
                                {reply.isMine && (
                                  <div style={{ marginLeft: 'auto' }}>
                                    <button onClick={() => deleteComment(reply.id)} style={{ color: 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                                      <Trash2 size={14} strokeWidth={2} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, wordBreak: 'break-word', lineHeight: 1.5 }}>
                                {reply.text.startsWith('@') ? (
                                  <>
                                    <span style={{ color: 'var(--primary)' }}>{reply.text.split(' ')[0]}</span>{' '}
                                    {reply.text.substring(reply.text.indexOf(' ') + 1)}
                                  </>
                                ) : (
                                  reply.text
                                )}
                              </p>
                              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                                <button onClick={() => handleCommentHug(reply.id, reply.hugs, reply.author)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: huggedComments.includes(reply.id) ? 'var(--accent-rose)' : 'var(--text-light)', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                  <Heart size={16} strokeWidth={1.5} fill={huggedComments.includes(reply.id) ? 'var(--accent-rose)' : 'none'} />
                                  {reply.hugs > 0 && <span style={{ fontSize: '0.75rem' }}>{reply.hugs}</span>}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
             <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', margin: '2rem 0' }}>{t('student.feed.emptyReplies')}</div>
          )}
        </div>
      )}
    </div>
  );
}
