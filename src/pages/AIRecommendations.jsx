import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiRefreshCw, FiStar, FiSearch } from 'react-icons/fi';
import { getAIRecommendations } from '../services/openai';
import { searchMovies, getImageUrl } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';

export default function AIRecommendations({ ratings, user }) {
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState({});
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setRecommendations([]);
    setMovieData({});
    
    const result = await getAIRecommendations(ratings);
    setMessage(result.message);
    setRecommendations(result.recommendations);

    // Try to find movie posters from TMDB for each recommendation
    const posterMap = {};
    for (const rec of result.recommendations) {
      try {
        const results = await searchMovies(rec.title);
        if (results.length > 0) {
          posterMap[rec.title] = results[0];
        }
      } catch (e) {
        // ignore
      }
    }
    setMovieData(posterMap);
    setLoading(false);
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', color: '#999' }}>
        <FiCpu size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h2 style={{ color: '#fff' }}>Login untuk mendapatkan rekomendasi AI</h2>
        <p>AI akan menganalisis preferensi Anda berdasarkan film yang sudah Anda rating.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ width: '4px', height: '28px', backgroundColor: '#f5c518', borderRadius: '2px' }} />
        <h1 style={{ margin: 0, fontSize: '2rem' }}>AI Recommendations</h1>
        <span style={{ fontSize: '1.5rem' }}>🤖</span>
      </div>

      <p style={{ color: '#999', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Dapatkan rekomendasi film yang dipersonalisasi berdasarkan selera Anda menggunakan kecerdasan buatan OpenAI.
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleGenerate}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: loading ? '#333' : '#f5c518',
          color: loading ? '#999' : '#000',
          border: 'none', borderRadius: '8px',
          padding: '14px 28px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem', fontFamily: 'inherit',
          marginBottom: '2rem'
        }}
      >
        {loading ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <FiRefreshCw size={18} />
            </motion.div>
            AI sedang berpikir...
          </>
        ) : (
          <>
            <FiCpu size={18} />
            {recommendations.length > 0 ? 'Generate Ulang' : 'Generate Rekomendasi'}
          </>
        )}
      </motion.button>

      {ratings.length === 0 && !loading && (
        <div style={{
          backgroundColor: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)',
          borderRadius: '8px', padding: '1rem 1.25rem', color: '#f5c518',
          fontSize: '0.9rem', marginBottom: '2rem'
        }}>
          ⚠️ Anda belum merating film apapun. AI membutuhkan data rating Anda untuk memberikan rekomendasi yang tepat.
        </div>
      )}

      {message && !loading && (
        <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{message}</p>
      )}

      <AnimatePresence>
        {recommendations.length > 0 && !loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {recommendations.map((rec, idx) => {
              const tmdbMovie = movieData[rec.title];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    display: 'flex', gap: '1rem',
                    backgroundColor: '#1a1a1a', borderRadius: '8px',
                    padding: '1rem', border: '1px solid #333',
                    cursor: tmdbMovie ? 'pointer' : 'default'
                  }}
                  onClick={() => tmdbMovie && navigate(`/movie/${tmdbMovie.id}`)}
                >
                  {tmdbMovie ? (
                    <img
                      src={getImageUrl(tmdbMovie.poster_path, 'w154')}
                      alt={rec.title}
                      style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: '80px', height: '120px', backgroundColor: '#333',
                      borderRadius: '4px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FiSearch size={20} color="#666" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600 }}>
                      {rec.title}
                    </h3>
                    <span style={{ color: '#999', fontSize: '0.85rem' }}>
                      {rec.year}
                    </span>
                    {tmdbMovie && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '6px 0' }}>
                        <FiStar fill="#f5c518" color="#f5c518" size={12} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tmdbMovie.vote_average?.toFixed(1)}</span>
                      </div>
                    )}
                    <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: 1.5, margin: '6px 0 0' }}>
                      {rec.reason}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
