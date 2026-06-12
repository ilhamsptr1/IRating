import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaFilm, FaStar, FaHeart, FaChartLine } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import PersonalRecommendations from '../components/PersonalRecommendations';
import InTheatersSection from '../components/InTheatersSection';
import ComingSoonSection from '../components/ComingSoonSection';
import { fetchTrending, fetchTopRated, fetchTopRatedThisYear, fetchMoviesByGenre, fetchNowPlaying, fetchUpcoming } from '../services/tmdb';
import { getFavoriteGenre } from '../utils/genres';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Home({ ratings, onRateMovie, watchlist, onToggleWatchlist, user }) {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [topYear, setTopYear] = useState([]);
  const [topHorror, setTopHorror] = useState([]);
  const [topAction, setTopAction] = useState([]);
  const [topThriller, setTopThriller] = useState([]);
  const [topComedy, setTopComedy] = useState([]);
  const [topDrama, setTopDrama] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const statsRef = useRef(null);
  const navigate = useNavigate();
  const { t, getTmdbLocale } = useLanguage();

  useEffect(() => {
    const lang = getTmdbLocale();
    const loadData = async () => {
      const [t, tr, ty, th, ta, tthr, tcom, tdra, np, up] = await Promise.all([
        fetchTrending('week', lang),
        fetchTopRated(lang),
        fetchTopRatedThisYear(lang),
        fetchMoviesByGenre(27, lang).then(d => d.results),
        fetchMoviesByGenre(28, lang).then(d => d.results),
        fetchMoviesByGenre(53, lang).then(d => d.results),
        fetchMoviesByGenre(35, lang).then(d => d.results),
        fetchMoviesByGenre(18, lang).then(d => d.results),
        fetchNowPlaying(lang),
        fetchUpcoming(lang)
      ]);
      setTrending(t);
      setTopRated(tr);
      setTopYear(ty);
      setTopHorror(th);
      setTopAction(ta);
      setTopThriller(tthr);
      setTopComedy(tcom);
      setTopDrama(tdra);
      setNowPlaying(np);
      setUpcoming(up);
    };
    loadData();
  }, [getTmdbLocale()]);

  // Stats GSAP
  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, [ratings]);

  const totalWatched = ratings.length;
  const avgRating = totalWatched > 0
    ? (ratings.reduce((a, c) => a + c.rating, 0) / totalWatched).toFixed(1)
    : 0;
  const favGenre = getFavoriteGenre(ratings);
  let favMovieObj = null;
  if (totalWatched > 0) {
    favMovieObj = [...ratings].sort((a, b) => b.rating - a.rating)[0];
  }

  const statCards = [
    { title: t('totalWatched'), value: totalWatched, icon: <FaFilm size={22} />, color: '#5799ef', link: '/ratings' },
    { title: t('avgRating'), value: `${avgRating}/10`, icon: <FaStar size={22} />, color: '#f5c518', link: '/ratings' },
    { title: t('favGenre'), value: favGenre, icon: <FaHeart size={22} />, color: '#ec4899', link: '/ratings' },
    { title: t('favMovie'), value: favMovieObj ? favMovieObj.title : '-', icon: <FaChartLine size={22} />, color: '#10b981', link: favMovieObj ? `/movie/${favMovieObj.movieId}` : null }
  ];

  const isInWatchlist = (movieId) => watchlist?.some(w => w.movieId === movieId);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <HeroSection movies={trending} />

      {/* Stats */}
      {user && (
        <section style={{ marginBottom: '5rem' }}>
          <SectionTitle title={t('statsTitle')} />
          <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {statCards.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, boxShadow: `0 10px 30px ${s.color}20` }}
                whileTap={s.link ? { scale: 0.95 } : {}}
                onClick={() => s.link && navigate(s.link)}
                className="glass"
                style={{
                  borderRadius: '16px',
                  padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
                  position: 'relative', overflow: 'hidden',
                  cursor: s.link ? 'pointer' : 'default'
                }}
              >
                <div style={{ 
                  background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`, color: '#fff', 
                  width: 56, height: 56, borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 8px 20px ${s.color}55`
                }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>{s.title}</p>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{s.value}</h3>
                </div>
                {/* Decorative glow */}
                <div style={{
                  position: 'absolute', top: -30, right: -30, width: 80, height: 80,
                  backgroundColor: s.color, filter: 'blur(50px)', opacity: 0.15, borderRadius: '50%'
                }} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Personal AI Recommendations */}
      <PersonalRecommendations 
        ratings={ratings} 
        onRateMovie={onRateMovie} 
        watchlist={watchlist} 
        onToggleWatchlist={onToggleWatchlist} 
      />

      {/* In Theaters & Coming Soon Sections */}
      <InTheatersSection 
        movies={nowPlaying} 
        watchlist={watchlist} 
        onToggleWatchlist={onToggleWatchlist} 
      />
      <ComingSoonSection 
        movies={upcoming} 
        watchlist={watchlist} 
        onToggleWatchlist={onToggleWatchlist} 
      />

      {/* Movie Sections */}
      <MovieSection title={t('topAllTime')} movies={topRated} onRateMovie={onRateMovie} ratings={ratings} watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} isInWatchlist={isInWatchlist} />
      <MovieSection title={t('topYear')} movies={topYear} onRateMovie={onRateMovie} ratings={ratings} watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} isInWatchlist={isInWatchlist} />
      <MovieSection title={t('topAction')} movies={topAction} onRateMovie={onRateMovie} ratings={ratings} watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} isInWatchlist={isInWatchlist} />
      <MovieSection title={t('topHorror')} movies={topHorror} onRateMovie={onRateMovie} ratings={ratings} watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} isInWatchlist={isInWatchlist} />
      <MovieSection title={t('topThriller')} movies={topThriller} onRateMovie={onRateMovie} ratings={ratings} watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} isInWatchlist={isInWatchlist} />
      <MovieSection title={t('topComedy')} movies={topComedy} onRateMovie={onRateMovie} ratings={ratings} watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} isInWatchlist={isInWatchlist} />
      <MovieSection title={t('topDrama')} movies={topDrama} onRateMovie={onRateMovie} ratings={ratings} watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} isInWatchlist={isInWatchlist} />
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div style={{ width: '6px', height: '32px', background: 'linear-gradient(to bottom, var(--primary-color), #ff9900)', borderRadius: '3px' }} />
      <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{title}</h2>
    </div>
  );
}

function MovieSection({ title, movies, onRateMovie, ratings, watchlist, onToggleWatchlist, isInWatchlist }) {
  const sectionRef = useRef(null);
  const rowRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (sectionRef.current && rowRef.current && movies.length > 0) {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(rowRef.current.children,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out',
          scrollTrigger: {
            trigger: rowRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ marginBottom: '4rem' }}>
      <div ref={sectionRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <SectionTitle title={title} />
        
        {!isMobile && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollLeft}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <FiChevronLeft size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollRight}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <FiChevronRight size={24} />
            </motion.button>
          </div>
        )}
      </div>
      
      <div style={{ position: 'relative' }}>
        <div
          ref={rowRef}
          style={{
            display: 'flex', gap: '1.25rem', overflowX: 'auto',
            scrollBehavior: 'smooth', paddingBottom: '1.5rem', paddingTop: '1rem',
            scrollbarWidth: 'none', marginLeft: '-0.5rem', paddingLeft: '0.5rem',
            marginRight: '-0.5rem', paddingRight: '0.5rem'
          }}
        >
          {movies.slice(0, 20).map((movie) => (
            <div key={movie.id} style={{ minWidth: '200px', maxWidth: '200px', flexShrink: 0 }}>
              <MovieCard
                movie={movie}
                onRate={onRateMovie}
                rating={ratings?.find(r => r.movieId === movie.id)?.rating}
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
