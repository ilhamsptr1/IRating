import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiPlay, FiPlus, FiCheck } from 'react-icons/fi';
import { FaTicketAlt } from 'react-icons/fa';
import { getImageUrl } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';

export default function InTheatersSection({ movies, watchlist, onToggleWatchlist }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 600, behavior: 'smooth' });

  const isInWatchlist = (movieId) => watchlist?.some(w => w.movieId === movieId);

  return (
    <section style={{ marginBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f5c518' }}>|</span> In theaters <FiChevronRight size={24} />
          </h2>
          <p style={{ margin: '4px 0 0', color: '#999', fontSize: '1rem' }}>Showtimes near you</p>
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
              minWidth: '200px', maxWidth: '200px', flexShrink: 0, 
              backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column'
            }}>
              {/* Poster */}
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/movie/${movie.id}`)}>
                <img 
                  src={getImageUrl(movie.poster_path, 'w500')} 
                  alt={movie.title} 
                  style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }} 
                />
                
                {/* Watchlist Ribbon */}
                <div 
                  onClick={(e) => { e.stopPropagation(); onToggleWatchlist && onToggleWatchlist(movie); }}
                  style={{
                    position: 'absolute', top: 0, left: 0, 
                    width: '32px', height: '44px',
                    backgroundColor: isInWatchlist(movie.id) ? 'rgba(245,197,24,0.9)' : 'rgba(0,0,0,0.6)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
                    display: 'flex', justifyContent: 'center', paddingTop: '6px', cursor: 'pointer',
                    transition: 'all 0.2s', zIndex: 10
                  }}
                >
                  {isInWatchlist(movie.id) ? <FiCheck color="#000" size={18} /> : <FiPlus color="#fff" size={20} />}
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiStar fill="#f5c518" color="#f5c518" size={16} />
                    <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <FiStar color="#5799ef" size={16} style={{ cursor: 'pointer' }} onClick={() => navigate(`/movie/${movie.id}`)} />
                </div>
                
                <h3 
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{ 
                    margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 500, color: '#fff',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer'
                  }}
                >
                  {movie.title}
                </h3>
                
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <motion.button
                    whileHover={{ backgroundColor: '#2a3a4a' }}
                    style={{
                      width: '100%', backgroundColor: '#222', border: 'none', borderRadius: '20px',
                      padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', color: '#5799ef', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
                    }}
                  >
                    <FaTicketAlt size={14} /> Showtimes
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ color: '#f5c518' }}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{
                      width: '100%', backgroundColor: 'transparent', border: 'none',
                      padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '6px', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem'
                    }}
                  >
                    <FiPlay size={16} fill="currentColor" /> Trailer
                  </motion.button>
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
