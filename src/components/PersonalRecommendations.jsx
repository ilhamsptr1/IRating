import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { fetchMoviesByGenre } from '../services/tmdb';
import MovieCard from './MovieCard';
import { useLanguage } from '../context/LanguageContext';

export default function PersonalRecommendations({ ratings, onRateMovie, watchlist, onToggleWatchlist }) {
  const [recommendations, setRecommendations] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getTmdbLocale } = useLanguage();
  const scrollRef = useRef(null);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!ratings || ratings.length === 0) {
        setLoading(false);
        return;
      }

      // Hitung frekuensi genre dari film yang sudah di-rating tinggi (>= 7)
      const positiveRatings = ratings.filter(r => r.rating >= 7);
      const targetRatings = positiveRatings.length > 0 ? positiveRatings : ratings;

      const genreCount = {};
      const genreNames = {};

      targetRatings.forEach(r => {
        if (r.genres && Array.isArray(r.genres)) {
          r.genres.forEach((gId, idx) => {
            genreCount[gId] = (genreCount[gId] || 0) + 1;
            if (r.genreNames && r.genreNames[idx]) {
              genreNames[gId] = r.genreNames[idx];
            }
          });
        }
      });

      // Ambil 3 genre teratas
      const sortedGenres = Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a]).slice(0, 3);
      
      const topGenreNames = sortedGenres.map(id => genreNames[id]).filter(Boolean);
      setTopGenres(topGenreNames);

      if (sortedGenres.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Ambil film berdasarkan genre teratas
        const genreQueryString = sortedGenres.join('|'); // OR operator in TMDB
        const res = await fetchMoviesByGenre(genreQueryString, getTmdbLocale());
        
        // Filter out movies the user has already rated
        const ratedIds = new Set(ratings.map(r => r.movieId));
        const filteredRecs = (res.results || res).filter(m => !ratedIds.has(m.id)).slice(0, 10);
        
        setRecommendations(filteredRecs);
      } catch (error) {
        console.error("Error fetching recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [ratings, getTmdbLocale()]);

  const isInWatchlist = (movieId) => watchlist?.some(w => w.movieId === movieId);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 600, behavior: 'smooth' });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div style={{ width: 30, height: 30, border: '3px solid #333', borderTopColor: '#f5c518', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!ratings || ratings.length === 0 || recommendations.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '6px', height: '32px', background: 'linear-gradient(to bottom, var(--primary-color), #ff9900)', borderRadius: '3px' }} />
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
               Rekomendasi Untuk Anda
            </h2>
          </div>
          <p style={{ color: '#999', marginBottom: '0', fontSize: '1rem' }}>
            Karena Anda menyukai: <span style={{ color: '#f5c518', fontWeight: 600 }}>{topGenres.join(' • ')}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }} onClick={scrollLeft} style={navBtnStyle}>
            <FiChevronLeft size={24} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }} onClick={scrollRight} style={navBtnStyle}>
            <FiChevronRight size={24} />
          </motion.button>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: '1.5rem' }}>
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: '1.25rem', overflowX: 'auto',
            scrollBehavior: 'smooth', paddingBottom: '1.5rem', paddingTop: '1rem',
            scrollbarWidth: 'none', marginLeft: '-0.5rem', paddingLeft: '0.5rem',
            marginRight: '-0.5rem', paddingRight: '0.5rem'
          }}
        >
          {recommendations.map((movie) => (
            <div key={movie.id} style={{ minWidth: '200px', maxWidth: '200px', flexShrink: 0 }}>
              <MovieCard
                movie={movie}
                onRate={onRateMovie}
                rating={null} // they haven't rated it yet
                inWatchlist={isInWatchlist(movie.id)}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const navBtnStyle = {
  width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color)',
  backgroundColor: 'var(--surface-color)', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
};
