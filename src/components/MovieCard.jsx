import { motion } from 'framer-motion';
import { FiStar, FiBookmark, FiCheck, FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/tmdb';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function MovieCard({ movie, onRate, rating, inWatchlist, onToggleWatchlist }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  const isRated = rating !== undefined;
  const posterPath = movie.poster_path || movie.posterPath;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.6)' : '0 4px 10px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Poster */}
      <div
        onClick={() => navigate(`/movie/${movie.id || movie.movieId}`)}
        style={{ position: 'relative', paddingTop: '150%', backgroundColor: '#111', overflow: 'hidden' }}
      >
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          src={getImageUrl(posterPath)}
          alt={movie.title}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        {/* Hover Overlay with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="glass"
          style={{
            position: 'absolute', inset: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)'
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', boxShadow: '0 4px 14px rgba(245, 197, 24, 0.4)'
          }}>
            <FiPlay size={20} fill="#000" style={{ marginLeft: 4 }} />
          </div>
        </motion.div>

        {/* Watchlist Ribbon */}
        {onToggleWatchlist && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onToggleWatchlist(movie); }}
            style={{
              position: 'absolute', top: 0, right: 12,
              width: '32px', height: '42px',
              backgroundColor: inWatchlist ? 'var(--primary-color)' : 'rgba(0,0,0,0.7)',
              backdropFilter: inWatchlist ? 'none' : 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
              cursor: 'pointer', transition: 'background-color 0.2s', zIndex: 2
            }}
          >
            {inWatchlist
              ? <FiCheck size={16} color="#000" style={{ marginTop: '-4px' }} />
              : <FiBookmark size={16} color="#fff" style={{ marginTop: '-4px' }} />
            }
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          onClick={() => navigate(`/movie/${movie.id || movie.movieId}`)}
          style={{
            fontSize: '1rem', marginBottom: '8px', fontWeight: 600,
            color: '#fff', display: '-webkit-box',
            WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            cursor: 'pointer', transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          {movie.title}
        </h3>

        {/* Rating row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiStar fill="var(--primary-color)" color="var(--primary-color)" size={14} />
            <span style={{ fontWeight: 600, color: '#fff' }}>
              {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
            </span>
          </div>
          
          {isRated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(87, 153, 239, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              <FiStar fill="#5799ef" color="#5799ef" size={12} />
              <span style={{ fontWeight: 700, color: '#5799ef', fontSize: '0.85rem' }}>{rating}</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={(e) => { e.stopPropagation(); if (onRate) onRate(movie); }}
            className="btn btn-outline"
            style={{
              width: '100%', padding: '8px', fontSize: '0.85rem',
              borderColor: isRated ? 'rgba(87, 153, 239, 0.3)' : 'var(--border-color)',
              color: isRated ? '#5799ef' : 'var(--text-secondary)'
            }}
          >
            {isRated ? t('editRating') : t('rate')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
