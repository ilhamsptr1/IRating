import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';
import { getImageUrl } from '../services/tmdb';
import { useLanguage } from '../context/LanguageContext';

export default function RatingModal({ isOpen, onClose, movie, existingRating, onSave }) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRating(existingRating?.rating || 0);
      setReview(existingRating?.review || '');
    }
  }, [isOpen, existingRating]);

  if (!isOpen || !movie) return null;

  const handleSave = () => {
    onSave(movie, rating, review);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 200, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            width: '100%', maxWidth: '420px',
            overflow: 'hidden',
            border: '1px solid #333'
          }}
        >
          {/* Header with star */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '2rem 1.5rem 1rem',
            background: 'linear-gradient(180deg, rgba(245,197,24,0.15) 0%, transparent 100%)'
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              backgroundColor: '#f5c518', display: 'flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
            }}>
              <FiStar size={28} color="#000" fill="#000" />
            </div>
            <span style={{ color: '#f5c518', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>{t('rateThisMovie')}</span>
            <h3 style={{ margin: '0.5rem 0 0', textAlign: 'center', fontSize: '1.2rem' }}>{movie.title}</h3>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', padding: '1.5rem' }}>
            {[...Array(10)].map((_, i) => {
              const val = i + 1;
              const active = val <= (hoverRating || rating);
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiStar
                    size={28}
                    fill={active ? '#f5c518' : 'transparent'}
                    color={active ? '#f5c518' : '#555'}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(val)}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Rating value */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: rating > 0 ? '#f5c518' : '#555' }}>
              {rating > 0 ? `${rating}/10` : '?/10'}
            </span>
          </div>

          {/* Review */}
          <div style={{ padding: '0 1.5rem 1rem' }}>
            <textarea
              placeholder={t('writeReviewPlaceholder')}
              rows="3"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              style={{
                width: '100%', resize: 'vertical',
                backgroundColor: '#0d0d0d', border: '1px solid #333',
                borderRadius: '4px', padding: '10px',
                color: '#fff', fontFamily: 'inherit', outline: 'none'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '10px', borderRadius: '4px',
                border: '1px solid #333', backgroundColor: 'transparent',
                color: '#fff', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit'
              }}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={rating === 0}
              style={{
                flex: 1, padding: '10px', borderRadius: '4px',
                border: 'none',
                backgroundColor: rating > 0 ? '#f5c518' : '#333',
                color: rating > 0 ? '#000' : '#666',
                cursor: rating > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 600, fontFamily: 'inherit'
              }}
            >
              {t('save')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
