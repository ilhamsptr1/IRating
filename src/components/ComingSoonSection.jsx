import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlay, FiPlus, FiCheck, FiThumbsUp, FiHeart } from 'react-icons/fi';
import { getBackdropUrl } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';

export default function ComingSoonSection({ movies, watchlist, onToggleWatchlist }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 600, behavior: 'smooth' });

  const isInWatchlist = (movieId) => watchlist?.some(w => w.movieId === movieId);

  // Helper to format date like "JUN 12"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <section style={{ marginBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f5c518' }}>|</span> Coming soon to theaters <FiChevronRight size={24} />
          </h2>
          <p style={{ margin: '4px 0 0', color: '#999', fontSize: '1rem' }}>Trailers for upcoming releases</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollLeft} style={navBtnStyle}>
            <FiChevronLeft size={24} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollRight} style={navBtnStyle}>
            <FiChevronRight size={24} />
          </motion.button>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: '1rem', overflowX: 'auto',
            scrollBehavior: 'smooth', paddingBottom: '1rem',
            scrollbarWidth: 'none', marginLeft: '-0.5rem', paddingLeft: '0.5rem',
            marginRight: '-0.5rem', paddingRight: '0.5rem'
          }}
        >
          {movies.slice(0, 15).map((movie) => (
            <div key={movie.id} style={{ 
              minWidth: '400px', maxWidth: '400px', flexShrink: 0, 
              display: 'flex', flexDirection: 'column'
            }}>
              {/* Backdrop with Play Button */}
              <div 
                style={{ 
                  position: 'relative', cursor: 'pointer', borderRadius: '8px', 
                  overflow: 'hidden', aspectRatio: '16/9', backgroundColor: '#222' 
                }} 
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img 
                  src={getBackdropUrl(movie.backdrop_path, 'w780')} 
                  alt={movie.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
                
                {/* Play Button & Duration Overlay */}
                <div style={{ 
                  position: 'absolute', bottom: '16px', left: '16px', 
                  display: 'flex', alignItems: 'center', gap: '8px' 
                }}>
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '50%', 
                    border: '2px solid #fff', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' 
                  }}>
                    <FiPlay color="#fff" size={18} fill="#fff" style={{ marginLeft: '2px' }} />
                  </div>
                  <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    2:30
                  </span>
                </div>
              </div>

              {/* Details below image */}
              <div style={{ display: 'flex', marginTop: '16px', gap: '16px' }}>
                {/* Watchlist Ribbon */}
                <div 
                  onClick={() => onToggleWatchlist && onToggleWatchlist(movie)}
                  style={{
                    width: '32px', height: '44px', flexShrink: 0,
                    backgroundColor: isInWatchlist(movie.id) ? 'rgba(245,197,24,0.9)' : '#222',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
                    display: 'flex', justifyContent: 'center', paddingTop: '6px', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isInWatchlist(movie.id) ? <FiCheck color="#000" size={18} /> : <FiPlus color="#fff" size={20} />}
                </div>

                {/* Text Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                    {formatDate(movie.release_date)}
                  </p>
                  <h3 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ 
                      margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 500, color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {movie.title}
                  </h3>
                  
                  <p 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ margin: '0 0 12px', color: '#5799ef', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Get tickets
                  </p>

                  <div style={{ display: 'flex', gap: '16px', color: '#999', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiThumbsUp size={14} /> {Math.floor(movie.vote_count / 2)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiHeart size={14} color="#ec4899" fill="#ec4899" /> {Math.floor(movie.vote_count / 3)}
                    </span>
                  </div>
                </div>
              </div>
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
