import { motion } from 'framer-motion';
import { FiStar, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { getImageUrl } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function MyRatings({ ratings, onRateMovie, onDeleteRating, user }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', color: '#999' }}>
        <FiStar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h2 style={{ color: '#fff' }}>{t('login')}</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '4px', height: '28px', backgroundColor: '#f5c518', borderRadius: '2px' }} />
        <h1 style={{ margin: 0, fontSize: '2rem' }}>{t('yourRatings')}</h1>
        <span style={{ color: '#999', fontSize: '1rem', marginLeft: '0.5rem' }}>({ratings.length})</span>
      </div>

      {ratings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 1rem', color: '#999', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <FiStar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff' }}>{t('emptyRatings')}</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {ratings.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '12px 16px', backgroundColor: '#1a1a1a',
                borderRadius: '4px', cursor: 'pointer'
              }}
              onClick={() => navigate(`/movie/${r.movieId}`)}
            >
              <img
                src={getImageUrl(r.posterPath, 'w92')}
                alt={r.title}
                style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: '#fff' }}>{r.title}</h4>
                {r.review && <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.review}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <FiStar fill="#f5c518" color="#f5c518" size={16} />
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f5c518' }}>{r.rating}</span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>/10</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={(e) => { e.stopPropagation(); onRateMovie({ id: r.movieId, title: r.title, poster_path: r.posterPath }); }}
                  style={{ background: 'none', border: 'none', color: '#5799ef', cursor: 'pointer', padding: '4px' }}>
                  <FiEdit2 size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDeleteRating(r.id); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
