import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getBackdropUrl } from '../services/tmdb';
import { gsap } from 'gsap';

export default function HeroSection({ movies }) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [movies]);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current.children, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', overwrite: true }
      );
    }
  }, [current]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[current];
  const maxSlides = Math.min(movies.length, 5);

  const goTo = (idx) => {
    setCurrent(idx);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % maxSlides);
    }, 6000);
  };

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '80vh', minHeight: '600px',
      marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)',
      marginTop: '-80px', marginBottom: '4rem', overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
            backgroundSize: 'cover', backgroundPosition: 'center 20%'
          }}
        />
      </AnimatePresence>

      {/* Advanced Gradients */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 40%, transparent 100%)'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(0deg, rgba(5,5,5,1) 0%, transparent 30%)'
      }} />

      {/* Content */}
      <div style={{ 
        position: 'absolute', bottom: '15%', left: '0', right: '0', zIndex: 2,
        maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'
      }}>
        <div ref={textRef} style={{ maxWidth: '700px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span style={{ 
              background: 'rgba(245, 197, 24, 0.2)', color: 'var(--primary-color)',
              padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem',
              border: '1px solid rgba(245, 197, 24, 0.3)'
            }}>
              Trending #{current + 1}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiStar fill="var(--primary-color)" color="var(--primary-color)" size={18} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{movie.vote_average?.toFixed(1)}</span>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>• {movie.release_date?.substring(0, 4)}</span>
          </div>
          
          <h1 style={{ 
            fontSize: isMobile ? 'clamp(2rem, 8vw, 5rem)' : 'clamp(3rem, 5vw, 5rem)', 
            fontWeight: 800, 
            marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            {movie.title}
          </h1>
          
          <p style={{ 
            color: '#d4d4d8', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: 1.6, 
            marginBottom: '2rem', display: '-webkit-box', 
            WebkitLineClamp: isMobile ? 2 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {movie.overview}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.1rem' }}
            >
              <FiPlay size={20} fill="#000" /> Lihat Detail
            </motion.button>
          </div>
        </div>

        {/* Custom Nav & Indicators */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'space-between',
          marginTop: isMobile ? '2rem' : '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: isMobile ? '1rem' : '2rem'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: maxSlides }).map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? '40px' : '12px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: i === current ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>
          
          {!isMobile && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => goTo((current - 1 + maxSlides) % maxSlides)} className="glass" style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background='var(--glass-bg)'}>
                <FiChevronLeft size={24} />
              </button>
              <button onClick={() => goTo((current + 1) % maxSlides)} className="glass" style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background='var(--glass-bg)'}>
                <FiChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
