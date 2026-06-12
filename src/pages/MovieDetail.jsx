import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiStar, FiClock, FiCalendar, FiArrowLeft, FiBookmark, FiCheck, FiPlayCircle, FiTrash2, FiVideo, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { gsap } from 'gsap';
import { fetchMovieDetails, getImageUrl, getBackdropUrl } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { useLanguage } from '../context/LanguageContext';

export default function MovieDetail({ ratings, onRateMovie, watchlist, onToggleWatchlist, user, onDeleteRating }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const castScrollRef = useRef(null);
  const similarScrollRef = useRef(null);
  const { t, getTmdbLocale } = useLanguage();

  const { scrollY } = useScroll();
  const backdropY = useTransform(scrollY, [0, 500], [0, 150]);
  const backdropOpacity = useTransform(scrollY, [0, 300], [0.6, 0.2]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchMovieDetails(id, getTmdbLocale());
      setMovie(data);
      setLoading(false);
      window.scrollTo(0, 0);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!loading && movie && contentRef.current) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, movie]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: 50, height: 50, border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!movie) return <div style={{ textAlign: 'center', padding: '10rem 2rem', color: 'var(--text-secondary)' }}><h2>Film tidak ditemukan.</h2></div>;

  const userRating = ratings?.find(r => r.movieId === movie.id);
  const inWatchlist = watchlist?.some(w => w.movieId === movie.id);
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const similar = movie.similar?.results?.slice(0, 10) || [];
  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Parallax Backdrop */}
      <div style={{
        position: 'relative', marginTop: '-80px', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)',
        height: '60vh', minHeight: '500px', overflow: 'hidden'
      }}>
        <motion.div style={{
          position: 'absolute', inset: -50,
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
          backgroundSize: 'cover', backgroundPosition: 'center 20%',
          y: backdropY, opacity: backdropOpacity
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-color) 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0.3) 100%)' }} />

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-color)', color: '#000' }}
          onClick={() => navigate(-1)}
          className="glass"
          style={{
            position: 'absolute', top: '100px', left: 'max(2rem, calc(50vw - 680px))', zIndex: 10,
            border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
            cursor: 'pointer', borderRadius: '50%', width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
          }}
        >
          <FiArrowLeft size={24} />
        </motion.button>
      </div>

      {/* Main Content */}
      <div ref={contentRef} style={{ display: 'flex', gap: '3rem', marginTop: '-200px', position: 'relative', zIndex: 5, flexWrap: 'wrap' }}>
        
        {/* Poster Column */}
        <div style={{ flexShrink: 0, width: '100%', maxWidth: '300px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{ 
              borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              style={{ width: '100%', display: 'block' }}
            />
          </motion.div>
        </div>

        {/* Info Column */}
        <div style={{ flex: 1, minWidth: '300px', paddingTop: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.1, letterSpacing: '-1px' }}>
            {movie.title}
          </h1>

          {movie.tagline && (
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              "{movie.tagline}"
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1rem', color: '#d4d4d8', fontSize: '1rem' }}>
            {movie.release_date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiCalendar size={18} color="var(--primary-color)" /> {new Date(movie.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {movie.runtime > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiClock size={18} color="var(--primary-color)" /> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
            {director && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiVideo size={18} color="var(--primary-color)" /> {t('director')}: <strong style={{ color: '#fff' }}>{director}</strong>
              </span>
            )}
          </div>

          {/* Genres */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {movie.genres?.map(g => (
              <span key={g.id} className="glass" style={{
                color: 'var(--primary-color)', border: '1px solid rgba(245,197,24,0.3)',
                padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600
              }}>
                {g.name}
              </span>
            ))}
          </div>

          {/* Ratings row */}
          <div className="glass" style={{ display: 'flex', gap: '3rem', marginBottom: '2rem', flexWrap: 'wrap', padding: '1.5rem 2rem', borderRadius: '16px' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('tmdbRating')}</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                <FiStar fill="var(--primary-color)" color="var(--primary-color)" size={28} style={{ marginBottom: 4 }} />
                <span style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{movie.vote_average?.toFixed(1)}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 4 }}>/10</span>
              </div>
            </div>
            <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('yourRating')}</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                <FiStar fill={userRating ? '#5799ef' : 'transparent'} color="#5799ef" size={28} style={{ marginBottom: 4 }} />
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#5799ef', lineHeight: 1 }}>
                  {userRating ? userRating.rating : '-'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 4 }}>/10</span>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0', fontWeight: 700, color: '#fff' }}>{t('synopsis')}</h3>
            <p style={{ color: '#e4e4e7', lineHeight: 1.8, fontSize: '1.1rem', margin: 0 }}>
              {movie.overview || 'Sinopsis lengkap belum tersedia untuk film ini.'}
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRateMovie(movie)}
              className="btn btn-primary"
            >
              <FiStar size={18} /> {userRating ? t('editRating') : t('rate')}
            </motion.button>

            {userRating && onDeleteRating && (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.confirm(t('confirmDelete'))) {
                    onDeleteRating(userRating.id);
                  }
                }}
                className="btn btn-outline"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.5)' }}
              >
                <FiTrash2 size={18} /> {t('deleteRating')}
              </motion.button>
            )}
            
            {onToggleWatchlist && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleWatchlist(movie)}
                className="btn"
                style={{
                  backgroundColor: inWatchlist ? 'rgba(245,197,24,0.15)' : 'var(--surface-color)',
                  color: inWatchlist ? 'var(--primary-color)' : '#fff',
                  border: '1px solid ' + (inWatchlist ? 'var(--primary-color)' : 'var(--border-color)'),
                }}
              >
                {inWatchlist ? <FiCheck size={18} /> : <FiBookmark size={18} />}
                {inWatchlist ? t('removeFromWatchlist') : t('addToWatchlist')}
              </motion.button>
            )}
            
            {trailer && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('trailer-section').scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
              >
                <FiPlayCircle size={18} /> Tonton Trailer
              </motion.button>
            )}
          </div>


        </div>
      </div>

      <div ref={contentRef} style={{ marginTop: '4rem' }}>
        {/* Cast */}
        {cast.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>{t('cast')}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }} onClick={() => castScrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })} style={scrollBtnStyle}>
                  <FiChevronLeft size={22} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }} onClick={() => castScrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })} style={scrollBtnStyle}>
                  <FiChevronRight size={22} />
                </motion.button>
              </div>
            </div>
            <div ref={castScrollRef} style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', scrollBehavior: 'smooth' }}>
              {cast.map(c => (
                <motion.div 
                  key={c.id} 
                  whileHover={{ y: -10 }}
                  style={{ minWidth: '140px', maxWidth: '140px', textAlign: 'center', flexShrink: 0 }}
                >
                  <div style={{ width: '120px', height: '120px', margin: '0 auto 1rem', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-color)' }}>
                    <img
                      src={c.profile_path ? getImageUrl(c.profile_path, 'w185') : 'https://via.placeholder.com/185?text=No+Photo'}
                      alt={c.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: '0 0 4px 0', lineHeight: 1.2 }}>{c.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', margin: 0, lineHeight: 1.2 }}>{c.character}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Trailer */}
        {trailer && (
          <section id="trailer-section" style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 700 }}>Trailer Resmi</h3>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>Film Serupa</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }} onClick={() => similarScrollRef.current?.scrollBy({ left: -600, behavior: 'smooth' })} style={scrollBtnStyle}>
                  <FiChevronLeft size={22} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.9 }} onClick={() => similarScrollRef.current?.scrollBy({ left: 600, behavior: 'smooth' })} style={scrollBtnStyle}>
                  <FiChevronRight size={22} />
                </motion.button>
              </div>
            </div>
            <div ref={similarScrollRef} style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', scrollBehavior: 'smooth' }}>
              {similar.map(m => (
                <div key={m.id} style={{ minWidth: '200px', maxWidth: '200px', flexShrink: 0 }}>
                  <MovieCard movie={m} onRate={onRateMovie} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const scrollBtnStyle = {
  width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--border-color)',
  backgroundColor: 'var(--surface-color)', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
};
