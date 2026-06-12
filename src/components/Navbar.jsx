import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBookmark, FiUser, FiLogIn, FiStar, FiGlobe, FiGrid } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function Navbar({ onOpenSearch, user }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem',
        height: scrolled ? '64px' : '80px', 
        transition: 'height 0.3s ease',
        display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '2rem'
      }}>
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <motion.div
            whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(245,197,24,0.8)" }}
            style={{
              color: 'var(--primary-color)',
              fontWeight: 900, fontSize: '1.5rem',
              letterSpacing: '-0.5px',
              fontFamily: '"Times New Roman", Times, serif'
            }}
          >
            IRating<span style={{color: '#fff'}}>.</span>
          </motion.div>
        </Link>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={onOpenSearch}
          style={{
            flex: 1, maxWidth: '500px',
            display: 'flex', alignItems: 'center',
            justifyContent: isMobile ? 'center' : 'flex-start',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: isMobile ? '0 8px' : '0 16px', cursor: 'pointer', height: '44px',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
        >
          <FiSearch size={18} color="#a1a1aa" />
          {!isMobile && <span style={{ marginLeft: '12px', color: '#a1a1aa', fontSize: '0.95rem' }}>{t('search')}</span>}
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Language Dropdown */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangOpen(!langOpen)}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--text-primary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: isMobile ? '8px 4px' : '8px 12px', borderRadius: '8px', fontSize: '0.95rem',
                fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{currentLang?.flag}</span>
              {!isMobile && <FiGlobe size={16} />}
            </motion.button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0,
                    marginTop: '8px', minWidth: '180px',
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px', overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    zIndex: 100
                  }}
                >
                  {LANGUAGES.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 16px', border: 'none',
                        backgroundColor: language === lang.code ? 'rgba(245,197,24,0.1)' : 'transparent',
                        color: language === lang.code ? 'var(--primary-color)' : '#fff',
                        cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem',
                        fontWeight: language === lang.code ? 700 : 400,
                        transition: 'all 0.2s',
                        borderLeft: language === lang.code ? '3px solid var(--primary-color)' : '3px solid transparent'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavBtn icon={<FiGrid size={20} />} label={t('explore') || 'Explore'} onClick={() => navigate('/explore')} isMobile={isMobile} />
          <NavBtn icon={<FiBookmark size={20} />} label={t('watchlist')} onClick={() => navigate('/watchlist')} isMobile={isMobile} />
          <NavBtn icon={<FiStar size={20} />} label={t('ratings')} onClick={() => navigate('/ratings')} isMobile={isMobile} />
          {user ? (
            <NavBtn
              icon={<img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--primary-color)' }} />}
              label={user.displayName?.split(' ')[0]}
              onClick={() => navigate('/profile')}
              isMobile={isMobile}
            />
          ) : (
            <NavBtn icon={<FiLogIn size={20} />} label={t('login')} onClick={() => navigate('/login')} isMobile={isMobile} />
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function NavBtn({ icon, label, onClick, highlight, isMobile }) {
  return (
    <motion.button
      whileHover={{ y: -2, backgroundColor: highlight ? 'var(--primary-hover)' : 'rgba(255,255,255,0.1)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: highlight ? 'var(--primary-color)' : 'transparent',
        border: 'none', 
        color: highlight ? '#000' : 'var(--text-primary)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: isMobile ? '0px' : '8px',
        padding: isMobile ? '8px' : '8px 16px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: highlight ? 700 : 500,
        fontFamily: 'inherit', transition: 'all 0.2s'
      }}
    >
      {icon}
      {!isMobile && <span style={{ display: 'inline' }}>{label}</span>}
    </motion.button>
  );
}
