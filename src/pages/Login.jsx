import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogIn, FiMail, FiLock, FiUserX } from 'react-icons/fi';
import { useAuth } from '../services/firebase';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { user, loginWithGoogle, loginAnonymously, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginAnonymously();
    } catch (err) {
      setError('Gagal masuk sebagai tamu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)', padding: '3rem 2rem',
          borderRadius: '16px', width: '100%', maxWidth: '400px',
          textAlign: 'center', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{
          color: 'var(--primary-color)', fontWeight: 900, fontSize: '2.5rem',
          letterSpacing: '-0.5px', fontFamily: '"Times New Roman", Times, serif',
          marginBottom: '1rem'
        }}>
          IRating<span style={{color: '#fff'}}>.</span>
        </div>
        
        <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          {isRegister ? 'Daftar Akun Baru' : (t('login') || 'Masuk')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Silakan {isRegister ? 'daftar' : 'masuk'} untuk menyimpan watchlist dan rating Anda.
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', top: '14px', left: '14px', color: '#a1a1aa' }} size={18} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)',
                color: '#fff', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <FiLock style={{ position: 'absolute', top: '14px', left: '14px', color: '#a1a1aa' }} size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)',
                color: '#fff', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              background: 'var(--primary-color)', color: '#000', fontSize: '1.05rem',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              marginTop: '0.5rem', opacity: loading ? 0.7 : 1
            }}
          >
            {isRegister ? 'Daftar' : 'Masuk dengan Email'}
          </motion.button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ margin: '0 10px', color: '#a1a1aa', fontSize: '0.9rem' }}>atau</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={loginWithGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
              color: '#fff', fontSize: '1.05rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px', transition: 'all 0.2s'
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264,51.509 C -3.264,50.719 -3.334,49.969 -3.454,49.239 L -14.754,49.239 L -14.754,53.749 L -8.284,53.749 C -8.574,55.229 -9.424,56.479 -10.684,57.329 L -10.684,60.329 L -6.824,60.329 C -4.564,58.239 -3.264,55.159 -3.264,51.509 z"/>
                <path fill="#34A853" d="M -14.754,63.239 C -11.514,63.239 -8.804,62.159 -6.824,60.329 L -10.684,57.329 C -11.764,58.049 -13.134,58.489 -14.754,58.489 C -17.884,58.489 -20.534,56.379 -21.484,53.529 L -25.464,53.529 L -25.464,56.619 C -23.494,60.539 -19.444,63.239 -14.754,63.239 z"/>
                <path fill="#FBBC05" d="M -21.484,53.529 C -21.734,52.809 -21.864,52.039 -21.864,51.239 C -21.864,50.439 -21.724,49.669 -21.484,48.949 L -21.484,45.859 L -25.464,45.859 C -26.284,47.479 -26.754,49.299 -26.754,51.239 C -26.754,53.179 -26.284,54.999 -25.464,56.619 L -21.484,53.529 z"/>
                <path fill="#EA4335" d="M -14.754,43.989 C -12.984,43.989 -11.404,44.599 -10.154,45.789 L -6.734,42.369 C -8.804,40.429 -11.514,39.239 -14.754,39.239 C -19.444,39.239 -23.494,41.939 -25.464,45.859 L -21.484,48.949 C -20.534,46.099 -17.884,43.989 -14.754,43.989 z"/>
              </g>
            </svg>
            Google
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnonymousLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
              color: '#fff', fontSize: '1.05rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px', transition: 'all 0.2s'
            }}
          >
            <FiUserX size={20} />
            Masuk sebagai Tamu
          </motion.button>
        </div>

        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <span 
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            {isRegister ? 'Masuk di sini' : 'Daftar di sini'}
          </span>
        </p>

      </motion.div>
    </div>
  );
}
