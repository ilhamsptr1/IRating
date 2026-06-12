import { FaTiktok, FaInstagram, FaGithub } from 'react-icons/fa6';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3rem 1rem',
      marginTop: '4rem',
      backgroundColor: '#000', // solid black as in IMDb
      borderTop: '1px solid var(--border-color)'
    }}>
      <div style={{
        backgroundColor: '#121212', // Slightly lighter container
        borderRadius: '12px',
        padding: '2rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.2rem', 
          fontWeight: 700,
          color: '#fff'
        }}>
          Follow Me On Social Media 
        </h3>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <SocialIcon href="https://www.tiktok.com/@ninetofive925" icon={<FaTiktok size={24} />} />
          <SocialIcon href="https://www.instagram.com/ilhammsptra_/" icon={<FaInstagram size={24} />} />
          <SocialIcon href="https://github.com/ilhamsptr1" icon={<FaGithub size={24} />} />
        </div>
      </div>
      
      <p style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        © 2026 Ilham Saputra. All rights reserved.
      </p>
    </footer>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        color: '#fff',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--primary-color)';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {icon}
    </a>
  );
}
