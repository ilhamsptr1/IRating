import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiLoader } from 'react-icons/fi';
import { gsap } from 'gsap';
import { fetchGenres, fetchMoviesByGenre } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { useLanguage } from '../context/LanguageContext';

export default function Explore({ ratings, onRateMovie, watchlist, onToggleWatchlist }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const { t, getTmdbLocale } = useLanguage();
  const loaderRef = useRef(null);
  const gridRef = useRef(null);

  // Fetch genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreList = await fetchGenres(getTmdbLocale());
        setGenres(genreList);
        if (genreList.length > 0) {
          setSelectedGenre(genreList[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch genres', error);
      }
    };
    loadGenres();
  }, [getTmdbLocale()]);

  // Fetch movies when genre or page changes
  const loadMovies = useCallback(async (genreId, pageNum, append = false) => {
    if (!genreId) return;
    setLoading(true);
    try {
      const data = await fetchMoviesByGenre(genreId, getTmdbLocale(), pageNum);
      if (append) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
      }
      setHasMore(pageNum < data.total_pages);
    } catch (error) {
      console.error('Failed to fetch movies', error);
    } finally {
      setLoading(false);
    }
  }, [getTmdbLocale()]);

  // Reset when genre changes
  useEffect(() => {
    if (selectedGenre) {
      setPage(1);
      setMovies([]);
      loadMovies(selectedGenre, 1, false);
    }
  }, [selectedGenre, loadMovies]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadMovies(selectedGenre, page, true);
    }
  }, [page, selectedGenre, loadMovies]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        setPage(prev => prev + 1);
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore]);

  // Simple animation for movie grid
  useEffect(() => {
    if (gridRef.current && movies.length > 0 && page === 1) {
      gsap.fromTo(gridRef.current.children, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [movies, page]);

  const isInWatchlist = (movieId) => watchlist?.some(w => w.movieId === movieId);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '6px', height: '32px', background: 'linear-gradient(to bottom, var(--primary-color), #ff9900)', borderRadius: '3px' }} />
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>
          Jelajahi Genre
        </h1>
      </div>

      {/* Genre Selector */}
      <div style={{ marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {genres.map(genre => (
          <motion.button
            key={genre.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGenre(genre.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: selectedGenre === genre.id ? 'none' : '1px solid rgba(255,255,255,0.2)',
              backgroundColor: selectedGenre === genre.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
              color: selectedGenre === genre.id ? '#000' : '#fff',
              fontWeight: selectedGenre === genre.id ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {genre.name}
          </motion.button>
        ))}
      </div>

      {/* Movie Grid */}
      <div 
        ref={gridRef}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '2rem' 
        }}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${index}`}
            movie={movie}
            onRate={onRateMovie}
            rating={ratings?.find(r => r.movieId === movie.id)?.rating}
            inWatchlist={isInWatchlist(movie.id)}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <FiLoader className="spin" size={32} color="var(--primary-color)" />
        </div>
      )}

      {/* Intersection Observer Target */}
      {!loading && hasMore && (
        <div ref={loaderRef} style={{ height: '20px', marginTop: '2rem' }}></div>
      )}

      {!hasMore && movies.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem' }}>
          Tidak ada film lagi untuk ditampilkan.
        </p>
      )}

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
