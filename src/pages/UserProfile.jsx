import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiArrowLeft } from 'react-icons/fi';
import { getUserProfile, getUserStats, useFollowSystem } from '../services/firebase';

export default function UserProfile({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ movieCount: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  
  const { following, followUser, unfollowUser, isFollowing } = useFollowSystem(currentUser?.uid);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const data = await getUserProfile(userId);
      setProfile(data);
      if (data) {
        const userStats = await getUserStats(userId);
        setStats(userStats);
      }
      setLoading(false);
    };
    loadProfile();
  }, [userId]);

  const handleFollowToggle = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (isFollowing(userId)) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spin" style={{ width: 40, height: 40, border: '4px solid #333', borderTopColor: '#f5c518', borderRadius: '50%' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem', color: '#999' }}>
        <h2>Pengguna tidak ditemukan.</h2>
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginTop: '1rem' }}>Kembali</button>
      </div>
    );
  }

  const isSelf = currentUser?.uid === userId;
  const currentlyFollowing = isFollowing(userId);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}
      >
        <FiArrowLeft /> Kembali
      </button>

      <div className="glass" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        {profile.photoURL ? (
          <img src={profile.photoURL} alt={profile.displayName} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #333' }} />
        ) : (
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #222' }}>
            <FiUser size={60} color="#666" />
          </div>
        )}

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 style={{ margin: '0 0 10px', fontSize: '2rem', fontWeight: 800 }}>{profile.displayName}</h1>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>Total Rating</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#f5c518', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⭐ {stats.totalRatings}
              </h3>
            </div>
            <div style={{ width: 1, backgroundColor: '#333' }}></div>
            <div>
              <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>Film Ditonton</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🎬 {stats.movieCount}
              </h3>
            </div>
          </div>

          {!isSelf && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFollowToggle}
              style={{
                backgroundColor: currentlyFollowing ? 'transparent' : '#f5c518',
                color: currentlyFollowing ? '#fff' : '#000',
                border: currentlyFollowing ? '1px solid #666' : 'none',
                padding: '10px 24px', borderRadius: '8px', fontWeight: 700,
                cursor: 'pointer', fontSize: '1rem', transition: 'all 0.3s'
              }}
            >
              {currentlyFollowing ? 'Unfollow' : 'Follow'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
