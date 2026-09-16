import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarDays, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PostCard } from './Feed';
import AppleEmoji from '../components/ui/AppleEmoji';

export default function PublicProfile() {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const { posts, user } = useAppContext();
  const [activeTab, setActiveTab] = useState('posts');
  
  // Find user's posts
  const userPosts = useMemo(() => {
    return posts.filter(p => p.author === nickname);
  }, [posts, nickname]);
  
  // Find the avatar from their most recent post, or default to a silhouette/fox
  const userAvatar = useMemo(() => {
    if (nickname === user?.nickname && user?.avatar) return user.avatar;
    if (userPosts.length > 0) return userPosts[0].avatar;
    return '🦊';
  }, [userPosts, nickname, user]);
  
  // Find posts where the user has commented
  const userRepliedPosts = useMemo(() => {
    return posts.filter(p => p.comments?.some(c => c.author === nickname));
  }, [posts, nickname]);
  
  // Check privacy settings
  const canViewReplies = useMemo(() => {
    if (user?.nickname === nickname) return true; // Can always view own
    const privacySetting = localStorage.getItem('mente-libre-privacy-replies-' + nickname);
    return privacySetting === 'true';
  }, [nickname, user]);
  
  // Compute stats
  const totalPosts = userPosts.length;
  const totalHugs = userPosts.reduce((acc, post) => acc + (post.hugs || 0), 0);


  return (
    <div className="page-content animate-fade-in" style={{ padding: 0, paddingBottom: '2rem' }}>
      {/* Header/Cover */}
      <div style={{ position: 'relative' }}>
        <div style={{ 
          height: '180px', 
          background: 'linear-gradient(to right, #09090b, #1f2937)', 
          backgroundImage: 'radial-gradient(circle at top right, var(--primary) 0%, transparent 60%)',
          width: '100%' 
        }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ 
              position: 'absolute', top: '1rem', left: '1rem', 
              backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', 
              color: 'white', border: 'none', borderRadius: '50%', 
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10
            }}
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        {/* Avatar */}
        <div style={{ 
          position: 'absolute', 
          bottom: '-40px', 
          left: '1.25rem', 
          width: '80px', 
          height: '80px', 
          backgroundColor: 'var(--bg-color)', 
          borderRadius: '50%', 
          border: '4px solid var(--surface)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '2.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 5
        }}>
          <AppleEmoji emoji={userAvatar} size={48} />
        </div>
      </div>
      
      {/* Profile Info */}
      <div style={{ padding: '3rem 1.25rem 1rem 1.25rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{nickname}</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>@{nickname.replace(/\s/g, '').toLowerCase()}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          <CalendarDays size={14} /> Se unió recientemente
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
          <div>
            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{totalPosts}</span> <span style={{ color: 'var(--text-muted)' }}>Publicaciones</span>
          </div>
          <div>
            <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{totalHugs}</span> <span style={{ color: 'var(--text-muted)' }}>Abrazos recibidos</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setActiveTab('posts')}
          style={{ flex: 1, textAlign: 'center', padding: '0.8rem', fontWeight: activeTab === 'posts' ? 800 : 700, color: activeTab === 'posts' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: activeTab === 'posts' ? '3px solid var(--primary)' : '3px solid transparent', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}>
          Posts
        </div>
        <div 
          onClick={() => { if (canViewReplies) setActiveTab('replies'); }}
          style={{ flex: 1, textAlign: 'center', padding: '0.8rem', fontWeight: activeTab === 'replies' ? 800 : 700, color: activeTab === 'replies' ? 'var(--text-main)' : 'var(--text-muted)', borderBottom: activeTab === 'replies' ? '3px solid var(--primary)' : '3px solid transparent', cursor: canViewReplies ? 'pointer' : 'not-allowed', fontSize: '0.9rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          Respuestas {!canViewReplies && <Lock size={14} />}
        </div>
      </div>
      
      {/* Feed */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-color)', minHeight: '50vh' }}>
        {activeTab === 'posts' ? (
          userPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }} className="animate-fade-in">
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Sin publicaciones aún</p>
              <p style={{ fontSize: '0.9rem' }}>Este usuario no ha compartido desahogos recientemente.</p>
            </div>
          ) : (
            userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )
        ) : (
          !canViewReplies ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }} className="animate-fade-in">
              <Lock size={32} style={{ margin: '0 auto 1rem', color: 'var(--text-light)' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Respuestas Privadas</p>
              <p style={{ fontSize: '0.9rem' }}>Este usuario prefiere mantener en privado sus respuestas.</p>
            </div>
          ) : userRepliedPosts.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }} className="animate-fade-in">
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Sin respuestas aún</p>
              <p style={{ fontSize: '0.9rem' }}>Este usuario no ha comentado en otros desahogos.</p>
            </div>
          ) : (
            userRepliedPosts.map(post => (
              <PostCard key={`reply-${post.id}`} post={post} />
            ))
          )
        )}
      </div>
    </div>
  );
}
