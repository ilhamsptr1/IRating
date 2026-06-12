import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiStar, FiUser } from 'react-icons/fi';
import { searchMovies, fetchPopularMovies, getImageUrl } from '../services/tmdb';
import { searchUsers } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' or 'users'
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t, getTmdbLocale } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'movies') loadPopular();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setUserResults([]);
    }
  }, [isOpen, activeTab]);

  const loadPopular = async () => {
    setLoading(true);
    const movies = await fetchPopularMovies(1, getTmdbLocale());
    setResults(movies);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
      if (activeTab === 'movies') loadPopular();
      else setUserResults([]);
      return;
    }

    setLoading(true);
    if (activeTab === 'movies') {
      const movies = await searchMovies(val, getTmdbLocale());
      setResults(movies);
    } else {
      const users = await searchUsers(val);
      setUserResults(users);
    }
    setLoading(false);
  };

  const handleSelectMovie = (movie) => {
    onClose();
    navigate(`/movie/${movie.id}`);
  };

  const handleSelectUser = (user) => {
    onClose();
    navigate(`/user/${user.uid}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 150, overflow: 'auto'
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => { setActiveTab('movies'); setQuery(''); }}
              style={{
                background: 'none', border: 'none', color: activeTab === 'movies' ? '#f5c518' : '#999',
                fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', padding: '8px 16px',
                borderBottom: activeTab === 'movies' ? '2px solid #f5c518' : '2px solid transparent'
              }}
            >
              Film
            </button>
            <button
              onClick={() => { setActiveTab('users'); setQuery(''); }}
              style={{
                background: 'none', border: 'none', color: activeTab === 'users' ? '#f5c518' : '#999',
                fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', padding: '8px 16px',
                borderBottom: activeTab === 'users' ? '2px solid #f5c518' : '2px solid transparent'
              }}
            >
              Pengguna
            </button>
          </div>

          {/* Search input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center',
              backgroundColor: '#1a1a1a', borderRadius: '8px',
              border: '2px solid #f5c518', padding: '0 1rem'
            }}>
              <FiSearch size={20} color="#f5c518" />
              <input
                ref={inputRef}
                type="text"
                placeholder={activeTab === 'movies' ? t('search') : 'Cari nama pengguna...'}
                value={query}
                onChange={handleSearch}
                style={{
                  flex: 1, border: 'none', background: 'none',
                  padding: '14px 12px', color: '#fff',
                  fontSize: '1.1rem', outline: 'none', fontFamily: 'inherit'
                }}
              />
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', padding: '8px'
              }}
            >
              <FiX size={28} />
            </button>
          </div>

          {/* Results */}
          {loading ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>Mencari...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {activeTab === 'movies' ? (
                results.slice(0, 10).map((movie) => (
                  <motion.div
                    key={movie.id}
                    whileHover={{ backgroundColor: '#2a2a2a' }}
                    onClick={() => handleSelectMovie(movie)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '10px 12px', borderRadius: '4px',
                      cursor: 'pointer', transition: 'background-color 0.15s'
                    }}
                  >
                    <img
                      src={getImageUrl(movie.poster_path, 'w92')}
                      alt={movie.title}
                      style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: '#fff' }}>{movie.title}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#999' }}>{movie.release_date?.substring(0, 4)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <FiStar fill="#f5c518" color="#f5c518" size={14} />
                      <span style={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>{movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                userResults.map((user) => (
                  <motion.div
                    key={user.uid}
                    whileHover={{ backgroundColor: '#2a2a2a' }}
                    onClick={() => handleSelectUser(user)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '12px', borderRadius: '4px',
                      cursor: 'pointer', transition: 'background-color 0.15s'
                    }}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiUser size={20} color="#fff" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: '#fff' }}>{user.displayName}</h4>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
