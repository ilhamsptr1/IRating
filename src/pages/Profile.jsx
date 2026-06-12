import { motion } from 'framer-motion';
import { FiLogOut, FiUser, FiPieChart, FiClock } from 'react-icons/fi';
import { FaFilm, FaStar } from 'react-icons/fa';
import { getFavoriteGenre } from '../utils/genres';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

const COLORS = ['#f5c518', '#5799ef', '#ec4899', '#10b981', '#a855f7', '#f97316'];

export default function Profile({ user, ratings, watchlist, onLogout }) {
  if (!user) return null;

  const { t } = useLanguage();

  const totalWatched = ratings.length;
  const avgRating = totalWatched > 0
    ? (ratings.reduce((a, c) => a + c.rating, 0) / totalWatched).toFixed(1)
    : 0;

  // Favorite Movie Object
  let favMovieObj = null;
  if (totalWatched > 0) {
    favMovieObj = [...ratings].sort((a, b) => b.rating - a.rating)[0];
  }

  // Genre Analysis for Chart
  const genreCounts = {};
  let totalGenres = 0;
  ratings.forEach(r => {
    if (r.genreNames) {
      r.genreNames.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
        totalGenres++;
      });
    }
  });

  const chartData = Object.keys(genreCounts)
    .map(key => ({
      name: key,
      value: genreCounts[key],
      percentage: ((genreCounts[key] / totalGenres) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 genres

  // User Stats
  const totalReviews = ratings.filter(r => r.review && r.review.trim() !== '').length;
  let joinDate = '-';
  if (user.metadata?.creationTime) {
    joinDate = new Date(user.metadata.creationTime).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  } else if (user.isAnonymous) {
    joinDate = 'Tamu';
  }

  // Auto Avatar Fallback
  const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Tamu')}&background=random&color=fff&size=200`;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
        <div style={{ width: '6px', height: '32px', background: 'linear-gradient(to bottom, var(--primary-color), #ff9900)', borderRadius: '3px' }} />
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{t('profileDashboard') || 'Dashboard Profil'}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Profile Card & Watchlist Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="glass"
            style={{
              borderRadius: '24px', padding: '3rem 2rem 2rem', 
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{
              position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
              width: 300, height: 300, backgroundColor: 'var(--primary-color)',
              filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <div style={{
                    position: 'absolute', inset: -8, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, transparent 100%)',
                    opacity: 0.5, animation: 'spin 4s linear infinite'
                  }} />
                  <img
                    src={avatarUrl}
                    alt={user.displayName || 'Tamu'}
                    style={{
                      width: '130px', height: '130px', borderRadius: '50%',
                      border: '4px solid var(--surface-color)', position: 'relative', zIndex: 2,
                      objectFit: 'cover'
                    }}
                  />
                </motion.div>
              </div>

              <h2 style={{ margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
                {user.displayName || 'Pengguna Tamu'}
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '20px' }}>
                <FiUser size={14} />
                <span style={{ fontSize: '0.95rem' }}>{user.email || 'Tanpa Email'}</span>
              </div>

              {/* Header User Stats */}
              <div style={{ 
                width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
                gap: '8px', marginBottom: '2rem', padding: '1rem', 
                background: 'rgba(0,0,0,0.2)', borderRadius: '16px' 
              }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiClock size={14} /> Bergabung sejak: <strong style={{ color: '#fff' }}>{joinDate}</strong>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{ratings.length}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Rating</span>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{totalReviews}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Review</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px', padding: '12px 28px',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.3s'
                }}
              >
                <FiLogOut size={18} /> {t('signOut') || 'Keluar dari Akun'}
              </motion.button>
            </div>
          </motion.div>

          {/* Watchlist Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass"
            style={{ borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Watchlist Saya
              </h3>
              {watchlist.length > 0 && (
                <Link to="/watchlist" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Lihat Semua →</Link>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin' }}>
              {watchlist.slice(0, 5).map(w => (
                <Link key={w.movieId} to={`/movie/${w.movieId}`} style={{ flexShrink: 0 }}>
                  <motion.img 
                    whileHover={{ y: -5 }}
                    src={`https://image.tmdb.org/t/p/w200${w.posterPath}`} 
                    alt={w.title}
                    style={{ width: '80px', height: '120px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                  />
                </Link>
              ))}
              {watchlist.length === 0 && (
                <div style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Belum ada film di watchlist.</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Analytics, Favorites, Recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <StatCard icon={<FaFilm size={22} />} label={t('totalWatched') || 'Total Ditonton'} value={totalWatched} color="#5799ef" delay={0.2} link="/ratings" />
            <StatCard icon={<FaStar size={22} />} label={t('avgRating') || 'Rata-rata Rating'} value={avgRating} color="#f5c518" delay={0.3} link="/ratings" />
          </div>

          {/* Favorite Movie */}
          {favMovieObj && (
            <Link to={`/movie/${favMovieObj.movieId}`} style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)' }}
                className="glass" 
                style={{ borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: `url(https://image.tmdb.org/t/p/w500${favMovieObj.backdropPath})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1, maskImage: 'linear-gradient(to left, black, transparent)', WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }} />
                
                <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Film Favorit Anda</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                  <img src={`https://image.tmdb.org/t/p/w200${favMovieObj.posterPath}`} style={{ width: '70px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} alt={favMovieObj.title} />
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>🎬 {favMovieObj.title}</h4>
                    <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>⭐ {favMovieObj.rating}/10</div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Movie Taste Analysis Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass"
            style={{ borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <FiPieChart size={24} color="var(--primary-color)" />
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{t('movieTasteAnalysis') || 'Analisis Selera Film'}</h3>
            </div>
            
            {chartData.length > 0 ? (
              <div style={{ height: 260, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(18,18,18,0.9)', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value, name, props) => [`${value} film (${props.payload.percentage}%)`, name]}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                <p>{t('noRatingData') || 'Belum ada data rating'}</p>
              </div>
            )}
          </motion.div>

          {/* Recent Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass"
            style={{ borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Rating Terakhir</h3>
              {ratings.length > 0 && (
                <Link to="/ratings" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Lihat Semua →</Link>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ratings.slice(0, 3).map(r => (
                <Link key={r.id} to={`/movie/${r.movieId}`} style={{ textDecoration: 'none' }}>
                  <motion.div 
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', x: 5 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', transition: 'background 0.2s' }}
                  >
                    <img src={`https://image.tmdb.org/t/p/w200${r.posterPath}`} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} alt={r.title} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{r.title}</h4>
                      <div style={{ color: 'var(--primary-color)', fontSize: '0.95rem', fontWeight: 700 }}>⭐ {r.rating}/10</div>
                    </div>
                  </motion.div>
                </Link>
              ))}
              {ratings.length === 0 && (
                <div style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Belum ada film yang dirating.</div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
      
      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, color, delay, link }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: `0 10px 25px ${color}20` }}
      whileTap={link ? { scale: 0.95 } : {}}
      onClick={() => link && navigate(link)}
      className="glass"
      style={{
        borderRadius: '20px', padding: '1.5rem', 
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        position: 'relative', overflow: 'hidden',
        cursor: link ? 'pointer' : 'default'
      }}
    >
      <div style={{ 
        background: `linear-gradient(135deg, ${color}, ${color}dd)`, color: '#fff', 
        width: 48, height: 48, borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 8px 20px ${color}55`
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '4px', fontWeight: 500 }}>{label}</p>
        <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{value}</h3>
      </div>
    </motion.div>
  );
}
