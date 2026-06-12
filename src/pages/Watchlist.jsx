import { motion } from 'framer-motion';
import { FiBookmark, FiTrash2 } from 'react-icons/fi';
import MovieCard from '../components/MovieCard';
import { useLanguage } from '../context/LanguageContext';

export default function Watchlist({ watchlist, onRemoveFromWatchlist, onRateMovie, ratings, user }) {
  const { t } = useLanguage();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', color: '#999' }}>
        <FiBookmark size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h2 style={{ color: '#fff' }}>{t('login')}</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '4px', height: '28px', backgroundColor: '#f5c518', borderRadius: '2px' }} />
        <h1 style={{ margin: 0, fontSize: '2rem' }}>{t('yourWatchlist')}</h1>
        <span style={{ color: '#999', fontSize: '1rem', marginLeft: '0.5rem' }}>({watchlist.length})</span>
      </div>

      {watchlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 1rem', color: '#999', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <FiBookmark size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff' }}>{t('emptyWatchlist')}</h3>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {watchlist.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'relative' }}
            >
              <MovieCard
                movie={{ id: item.movieId, title: item.title, poster_path: item.posterPath, vote_average: item.voteAverage }}
                onRate={onRateMovie}
                rating={ratings?.find(r => r.movieId === item.movieId)?.rating}
              />
              <button
                onClick={() => onRemoveFromWatchlist(item.id)}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(239,68,68,0.9)', border: 'none',
                  color: '#fff', borderRadius: '50%',
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 5
                }}
              >
                <FiTrash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
