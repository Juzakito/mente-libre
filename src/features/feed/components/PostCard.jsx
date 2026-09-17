import React, { useState } from 'react';
import { Heart, Sparkles, EyeOff, Trash2, Edit3, Check, MessageCircle, Repeat2, BarChart2, Bookmark, Share, X, MoreHorizontal } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { safeJSONParse } from '../../../utils/helpers';
import { useOutletContext, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppleEmoji from '../../../components/ui/AppleEmoji';
import TalkCampusAvatar from '../../../components/ui/TalkCampusAvatar';

export default function PostCard({ post, feedStyle = 'classic' }) {
  const { user, deletePost, updatePost, toggleHug, addComment, deleteComment, updateComment, toggleCommentHug } = useAppContext();
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
    try { localStorage.setItem('likedComments', JSON.stringify(updated)); } catch {}
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = post.text && post.text.length > 170;
  const displayedText = isLongText && !isExpanded ? post.text.slice(0, 170) : post.text;

  // Derive TalkCampus creature avatar or emoji
  const isCreature = typeof post.avatar === 'string' && (
    post.avatar.includes('jay') ||
    post.avatar.includes('angel') ||
    post.avatar.includes('bird') ||
    post.avatar.includes('delta') ||
    post.avatar.includes('anxious') ||
    post.avatar.includes('cosmic') ||
    post.author?.toLowerCase().includes('jay') ||
    post.author?.toLowerCase().includes('angel') ||
    post.author?.toLowerCase().includes('bird') ||
    post.author?.toLowerCase().includes('delta')
  );

  const creatureKey = post.avatar || (
    post.author?.toLowerCase().includes('jay') ? 'flying_jay' :
    post.author?.toLowerCase().includes('angel') ? 'earth_angel' :
    post.author?.toLowerCase().includes('bird') ? 'ivory_bird' :
    post.author?.toLowerCase().includes('anxious') ? 'anxious_soul' : 'delta_clover'
  );

  // Derive mood pill
  const mood = post.mood || (
    post.text.toLowerCase().includes('solo') || post.text.toLowerCase().includes('triste') || post.text.toLowerCase().includes('duele') ? { label: 'Sad 🙁', bg: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa' } :
    post.text.toLowerCase().includes('enfoque') || post.text.toLowerCase().includes('sonreiré') || post.text.toLowerCase().includes('esperanza') ? { label: 'Hopeful 😀', bg: 'rgba(168, 85, 247, 0.18)', color: '#c084fc' } :
    post.text.toLowerCase().includes('ansioso') || post.text.toLowerCase().includes('miedo') || post.text.toLowerCase().includes('desmoronando') || post.text.toLowerCase().includes('odio') ? { label: 'Anxious 😩', bg: 'rgba(14, 165, 233, 0.18)', color: '#38bdf8' } :
    null
  );

  // Time formatting (e.g. 2m, 4m, 22m)
  const timeFormatted = post.time || (
    post.created_at ? `${Math.max(1, Math.floor((Date.now() - new Date(post.created_at).getTime()) / 60000))}m` : '2m'
  );

  const isSolid = feedStyle === 'solid';

  return (
    <div
      className="card animate-fade-in"
      style={{
        padding: '1.25rem',
        borderRadius: '16px',
        backgroundColor: isSolid ? '#0f1d21' : '#141719',
        backgroundImage: isSolid ? 'linear-gradient(145deg, #0d1e22 0%, #152c30 100%)' : 'none',
        border: isSolid ? '1.5px solid #00e676' : '1px solid #232a2d',
        boxShadow: isSolid ? '0 8px 24px rgba(0, 230, 118, 0.22)' : '0 2px 10px rgba(0,0,0,0.3)',
        transition: 'all 0.25s ease',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Top accent bar for Solid style */}
      {isSolid && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #3b82f6 0%, #00e676 50%, #8b5cf6 100%)'
        }} />
      )}

      {/* Card Header: Avatar, Name, Time, Three Dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', marginTop: isSolid ? '0.2rem' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to={`/app/u/${post.author}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isCreature ? (
              <TalkCampusAvatar
                id={creatureKey}
                size={42}
                style={{
                  border: isSolid ? '2px solid #00e676' : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: isSolid ? '0 0 12px rgba(0, 230, 118, 0.4)' : 'none'
                }}
              />
            ) : (
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#23282b',
                border: isSolid ? '2px solid #00e676' : '1px solid rgba(255,255,255,0.12)',
                boxShadow: isSolid ? '0 0 10px rgba(0, 230, 118, 0.35)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AppleEmoji emoji={post.avatar || '🦊'} size={28} />
              </div>
            )}
            <div>
              <div style={{ fontWeight: 900, color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.2 }}>
                {post.author}
              </div>
              <div style={{ fontSize: '0.72rem', color: isSolid ? '#38bdf8' : '#8e9ca0', marginTop: '2px', fontWeight: 600 }}>
                {timeFormatted}
              </div>
            </div>
          </Link>
        </div>

        {/* Top Right: Three dots menu & edit/delete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {post.isMine && !isEditing && (
            <>
              {(!post.created_at || (Date.now() - new Date(post.created_at).getTime()) < 300000) && (
                <button onClick={() => setIsEditing(true)} style={{ color: '#8e9ca0', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <Edit3 size={15} />
                </button>
              )}
              <button onClick={() => deletePost(post.id)} style={{ color: '#f43f5e', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <Trash2 size={15} />
              </button>
            </>
          )}
          <button style={{ color: '#8e9ca0', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }} title="Opciones">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Post Text */}
      {!showSensitive && !isEditing ? (
        <div style={{ border: '1px solid #2e373b', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', margin: '0.5rem 0', backgroundColor: '#131718' }}>
          <EyeOff color="#8e9ca0" size={22} style={{ margin: '0 auto 0.4rem' }} />
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8e9ca0' }}>Contenido sensible</p>
          <button onClick={() => setShowSensitive(true)} style={{ marginTop: '0.5rem', backgroundColor: '#00e676', color: '#082e30', border: 'none', fontSize: '0.75rem', fontWeight: 800, padding: '0.4rem 1rem', borderRadius: '9999px', cursor: 'pointer' }}>
            Ver contenido
          </button>
        </div>
      ) : isEditing ? (
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: '10px', border: '1px solid #2e373b', backgroundColor: '#22272a', color: '#ffffff', fontSize: '0.95rem', resize: 'vertical' }}
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button onClick={() => { setIsEditing(false); setEditText(post.text); }} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: '9999px', backgroundColor: 'transparent', color: '#8e9ca0', border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button onClick={() => { updatePost(post.id, editText); setIsEditing(false); }} style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', borderRadius: '9999px', backgroundColor: '#00e676', color: '#082e30', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem', border: 'none', cursor: 'pointer' }}>
              <Check size={14} /> Guardar
            </button>
          </div>
        </div>
      ) : (
        <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '0.85rem', wordBreak: 'break-word' }}>
          {displayedText}
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ background: 'none', border: 'none', color: isSolid ? '#00e676' : '#8e9ca0', fontSize: '0.92rem', cursor: 'pointer', padding: '0 0 0 4px', textDecoration: 'none', fontWeight: 700 }}
            >
              {isExpanded ? ' (leer menos)' : ' (leer más)'}
            </button>
          )}
        </p>
      )}

      {/* Mood Tag Pill (Matching Image 4) */}
      {mood && (
        <div style={{ marginBottom: '0.85rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: isSolid ? '0.3rem 0.75rem' : '0.25rem 0.65rem',
            borderRadius: '9999px',
            backgroundColor: isSolid ? '#00e676' : mood.bg,
            color: isSolid ? '#06291d' : mood.color,
            fontSize: '0.75rem',
            fontWeight: isSolid ? 900 : 800,
            boxShadow: isSolid ? '0 4px 14px rgba(0, 230, 118, 0.35)' : 'none'
          }}>
            {mood.label}
          </span>
        </div>
      )}

      {/* Card Footer: Comments & Hearts counter */}
      <div style={{
        display: 'flex',
        justify: 'flex-end',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#8e9ca0',
        fontSize: '0.82rem',
        fontWeight: 700,
        paddingTop: '0.6rem',
        borderTop: isSolid ? '1px solid rgba(0, 230, 118, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Comments Count */}
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: isSolid ? '#38bdf8' : showComments ? '#ffffff' : '#8e9ca0',
            backgroundColor: isSolid ? 'rgba(56, 189, 248, 0.12)' : 'none',
            border: isSolid ? '1px solid rgba(56, 189, 248, 0.25)' : 'none',
            padding: isSolid ? '0.35rem 0.75rem' : '0',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 800,
            transition: 'all 0.15s ease'
          }}
        >
          <MessageCircle size={16} />
          <span>{post.comments?.length ?? 0}</span>
        </button>

        {/* Hearts Count */}
        <button
          onClick={handleHug}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: isSolid || hasHugged ? '#f43f5e' : '#8e9ca0',
            backgroundColor: isSolid ? 'rgba(244, 63, 94, 0.12)' : 'none',
            border: isSolid ? '1px solid rgba(244, 63, 94, 0.25)' : 'none',
            padding: isSolid ? '0.35rem 0.75rem' : '0',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 800,
            transition: 'all 0.15s ease'
          }}
        >
          <Heart size={16} fill={hasHugged ? '#f43f5e' : 'none'} color={hasHugged ? '#f43f5e' : (isSolid ? '#f43f5e' : '#8e9ca0')} className={hugAnimating ? 'animate-pop' : ''} />
          <span>{post.hugs ?? 0}</span>
        </button>
      </div>

      {showComments && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }} className="animate-slide-up">
          
          {!replyingToId && (
            <form onSubmit={(e) => handleCommentSubmit(e, null)} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: '38px', height: '38px', flexShrink: 0 }}>
                <TalkCampusAvatar id={user?.avatar || 'owl'} size={38} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Postea tu respuesta..."
                  style={{
                    width: '100%',
                    minHeight: '65px',
                    padding: '0.75rem 1rem',
                    border: '1px solid #283033',
                    backgroundColor: '#131718',
                    fontSize: '0.95rem',
                    color: '#ffffff',
                    WebkitTextFillColor: '#ffffff',
                    outline: 'none',
                    resize: 'vertical',
                    borderRadius: '12px',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    style={{
                      backgroundColor: commentText.trim() ? '#00e676' : '#232a2d',
                      color: commentText.trim() ? '#082e30' : '#8e9ca0',
                      padding: '0.45rem 1.25rem',
                      borderRadius: '9999px',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: commentText.trim() ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      boxShadow: commentText.trim() ? '0 4px 12px rgba(0, 230, 118, 0.3)' : 'none'
                    }}
                  >
                    Responder
                  </button>
                </div>
              </div>
            </form>
          )}

          {topLevelComments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topLevelComments.map((c) => {
                const replies = getReplies(c.id);
                return (
                  <div key={c.id} style={{ display: 'flex', flexDirection: 'column', padding: '0.85rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                          <TalkCampusAvatar id={c.isMine ? (user?.avatar || 'owl') : (c.avatar || 'owl')} size={36} />
                        </div>
                        {replies.length > 0 && (
                          <div style={{ flex: 1, width: '2px', backgroundColor: '#283033', margin: '0.25rem 0' }}></div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                          <Link to={`/app/u/${c.author}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.author}</span>
                            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>@{c.author.replace(/\s/g, '').toLowerCase()}</span>
                          </Link>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>· {c.time || 'Reciente'}</span>
                          
                          {c.isMine && editingCommentId !== c.id && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                              {(!c.created_at || (Date.now() - new Date(c.created_at).getTime()) < 300000) && (
                                <button onClick={() => { setEditingCommentId(c.id); setEditCommentText(c.text); }} style={{ color: '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }} title="Editar">
                                  <Edit3 size={15} strokeWidth={2} />
                                </button>
                              )}
                              <button onClick={() => { if(window.confirm('¿Borrar?')) deleteComment(c.id); }} style={{ color: '#f43f5e', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                                <Trash2 size={15} strokeWidth={2} />
                              </button>
                            </div>
                          )}
                        </div>

                        {editingCommentId === c.id ? (
                          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <textarea 
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              style={{ width: '100%', minHeight: '60px', padding: '0.6rem', borderRadius: '10px', border: '1px solid #00e676', backgroundColor: '#131718', fontSize: '0.92rem', color: '#ffffff', WebkitTextFillColor: '#ffffff', outline: 'none', resize: 'vertical' }}
                              autoFocus
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <button onClick={() => setEditingCommentId(null)} style={{ backgroundColor: 'transparent', color: '#8e9ca0', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #283033', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}>
                                Cancelar
                              </button>
                              <button onClick={() => { updateComment(c.id, editCommentText); setEditingCommentId(null); }} style={{ backgroundColor: '#00e676', color: '#082e30', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 900 }}>
                                Guardar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ fontSize: '0.92rem', color: '#f1f5f9', margin: '0.25rem 0 0.5rem', wordBreak: 'break-word', lineHeight: 1.5, fontWeight: 500 }}>
                              {c.text}
                            </p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '380px', marginTop: '0.5rem', color: '#8e9ca0' }}>
                              <button onClick={() => handleReplyClick(c.author, c.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                <MessageCircle size={16} strokeWidth={1.75} />
                              </button>
                              <button onClick={() => showToast('¡Compartido!')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                <Repeat2 size={16} strokeWidth={1.75} />
                              </button>
                              <button 
                                onClick={() => handleCommentHug(c.id, c.hugs, c.author)} 
                                disabled={c.author === user?.nickname}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: huggedComments.includes(c.id) ? '#f43f5e' : '#8e9ca0', background: 'transparent', cursor: c.author === user?.nickname ? 'not-allowed' : 'pointer', padding: 0, opacity: c.author === user?.nickname ? 0.5 : 1 }} 
                                className="twitter-action-btn"
                              >
                                <Heart size={16} strokeWidth={1.75} fill={huggedComments.includes(c.id) ? '#f43f5e' : 'none'} />
                                {c.hugs > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{c.hugs}</span>}
                              </button>
                              <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                <BarChart2 size={16} strokeWidth={1.75} />
                              </button>
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => showToast('Guardado')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                  <Bookmark size={16} strokeWidth={1.75} />
                                </button>
                                <button onClick={() => showToast('Enlace copiado')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                  <Share size={16} strokeWidth={1.75} />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Inline Reply Form */}
                    {replyingToId === c.id && (
                      <form onSubmit={(e) => { setReplyingToId(null); handleCommentSubmit(e, c.id); }} style={{ display: 'flex', gap: '0.65rem', marginTop: '0.6rem', marginLeft: '2.75rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '30px', height: '30px', flexShrink: 0 }}>
                          <TalkCampusAvatar id={user?.avatar || 'owl'} size={30} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>Respondiendo a <span style={{ color: '#00e676', fontWeight: 700 }}>@{replyingTo?.replace(/\s/g, '')}</span></span>
                            <button type="button" onClick={() => setReplyingToId(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8e9ca0', padding: 0 }}>
                              <X size={14} />
                            </button>
                          </div>
                          <textarea 
                            ref={commentInputRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            style={{ width: '100%', minHeight: '55px', padding: '0.6rem 0.85rem', border: '1px solid #283033', backgroundColor: '#131718', fontSize: '0.9rem', color: '#ffffff', WebkitTextFillColor: '#ffffff', outline: 'none', resize: 'vertical', borderRadius: '10px', fontFamily: 'inherit' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                            <button type="submit" disabled={!commentText.trim()} style={{ backgroundColor: commentText.trim() ? '#00e676' : '#232a2d', color: commentText.trim() ? '#082e30' : '#8e9ca0', padding: '0.35rem 1rem', borderRadius: '9999px', fontWeight: 900, fontSize: '0.8rem', border: 'none', cursor: commentText.trim() ? 'pointer' : 'default', transition: 'all 0.15s ease' }}>
                              Responder
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Replies mapping */}
                    {replies.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                        {replies.map(reply => (
                          <div key={reply.id} style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem', marginLeft: '2.5rem' }}>
                            <div style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                              <TalkCampusAvatar id={reply.isMine ? (user?.avatar || 'owl') : (reply.avatar || 'owl')} size={28} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                                <Link to={`/app/u/${reply.author}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reply.author}</span>
                                  <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>@{reply.author.replace(/\s/g, '').toLowerCase()}</span>
                                </Link>
                                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>· {reply.time || 'Reciente'}</span>
                                {reply.isMine && (
                                  <div style={{ marginLeft: 'auto' }}>
                                    <button onClick={() => deleteComment(reply.id)} style={{ color: '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                                      <Trash2 size={14} strokeWidth={2} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p style={{ fontSize: '0.88rem', color: '#f1f5f9', margin: 0, wordBreak: 'break-word', lineHeight: 1.45, fontWeight: 500 }}>
                                {reply.text.startsWith('@') ? (
                                  <>
                                    <span style={{ color: '#00e676', fontWeight: 700 }}>{reply.text.split(' ')[0]}</span>{' '}
                                    <span style={{ color: '#f1f5f9' }}>{reply.text.substring(reply.text.indexOf(' ') + 1)}</span>
                                  </>
                                ) : (
                                  reply.text
                                )}
                              </p>
                              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.35rem', color: '#8e9ca0' }}>
                                <button onClick={() => handleCommentHug(reply.id, reply.hugs, reply.author)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: huggedComments.includes(reply.id) ? '#f43f5e' : '#8e9ca0', background: 'transparent', cursor: 'pointer', padding: 0 }} className="twitter-action-btn">
                                  <Heart size={14} strokeWidth={1.75} fill={huggedComments.includes(reply.id) ? '#f43f5e' : 'none'} />
                                  {reply.hugs > 0 && <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{reply.hugs}</span>}
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
            <div style={{ fontSize: '0.85rem', color: '#8e9ca0', textAlign: 'center', margin: '1.5rem 0', fontWeight: 600 }}>Aún no hay respuestas. ¡Sé el primero!</div>
          )}
        </div>
      )}
    </div>
  );
}
