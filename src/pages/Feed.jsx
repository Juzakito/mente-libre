import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { usePosts } from '../features/feed/hooks/usePosts';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/tracker';
import WellnessChallenges from '../components/WellnessChallenges';
import WelcomeBanner from '../features/feed/components/WelcomeBanner';
import PostCard from '../features/feed/components/PostCard';
import ComposePostModal from '../features/feed/components/ComposePostModal';

// Re-export PostCard for backward compatibility with PublicProfile
export { PostCard };

const checkRiskWords = (text) => {
  const riskWords = /morir|matarme|desaparecer|suicidio|acabar con todo|ya no quiero vivir/i;
  return riskWords.test(text);
};

export default function Feed() {
  const { user } = useAuth();
  const { posts, addPost } = usePosts();
  const outletCtx = useOutletContext();
  const handleSOS = outletCtx?.handleSOS || (() => {});
  const showToast = outletCtx?.showToast || (() => {});
  const { t } = useTranslation();
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <WelcomeBanner user={user} />

      {/* Gamification / Wellness Challenges */}
      <WellnessChallenges />

      {/* Posts */}
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)', marginTop: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.8 }}>🌿</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('student.feed.emptyTitle')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('student.feed.emptyDesc')}</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsComposing(true)}
        className="fab-button"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0f766e 100%)', color: 'white', width: '3.5rem', height: '3.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(13,148,136,0.5)', transition: 'all 0.2s ease' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Plus size={24} />
      </button>

      {/* Compose Modal */}
      {isComposing && (
        <ComposePostModal 
          onClose={() => setIsComposing(false)}
          onPublish={(text, tags) => {
            if (checkRiskWords(text)) {
              setIsComposing(false);
              handleSOS();
            } else {
              addPost(text, tags);
              trackEvent('NEW_POST', { career: user?.career });
              setIsComposing(false);
              showToast('Desahogo publicado anónimamente');
            }
          }}
        />
      )}
    </div>
  );
}
