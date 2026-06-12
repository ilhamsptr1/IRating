import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchModal from './components/SearchModal';
import RatingModal from './components/RatingModal';
import Footer from './components/Footer';
import { useAuth, useRatings, useWatchlist } from './services/firebase';
import { LanguageProvider } from './context/LanguageContext';

const Home = lazy(() => import('./pages/Home'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const MyRatings = lazy(() => import('./pages/MyRatings'));
const Profile = lazy(() => import('./pages/Profile'));
const AIRecommendations = lazy(() => import('./pages/AIRecommendations'));
const Explore = lazy(() => import('./pages/Explore'));
const Login = lazy(() => import('./pages/Login'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { user, loading: authLoading, loginWithGoogle, logout, updateProfilePhoto } = useAuth();
  const { ratings, addRating, updateRating, deleteRating } = useRatings(user?.uid);
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist(user?.uid);

  const handleRateMovie = (movie) => {
    if (!user) {
      loginWithGoogle();
      return;
    }
    setSelectedMovie(movie);
    setIsRatingOpen(true);
  };

  const handleSaveRating = (movie, ratingValue, review) => {
    const existing = ratings.find(r => r.movieId === movie.id);
    if (existing) {
      updateRating(existing.id, ratingValue, review);
    } else {
      addRating(movie, ratingValue, review);
    }
  };

  const handleToggleWatchlist = (movie) => {
    if (!user) {
      loginWithGoogle();
      return;
    }
    const existing = watchlist.find(w => w.movieId === movie.id);
    if (existing) {
      removeFromWatchlist(existing.id);
    } else {
      addToWatchlist(movie);
    }
  };

  if (authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', backgroundColor: '#000'
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
        }}>
          <div style={{
            backgroundColor: '#f5c518', color: '#000',
            fontWeight: 900, fontSize: '2rem',
            padding: '4px 12px', borderRadius: '4px',
            fontFamily: '"Times New Roman", Times, serif'
          }}>
            IRating
          </div>
          <div style={{
            width: 30, height: 30,
            border: '3px solid #333', borderTopColor: '#f5c518',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="app-container">
          <Navbar
            onOpenSearch={() => setIsSearchOpen(true)}
            user={user}
          />

          <main>
            <Suspense fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div style={{ width: 30, height: 30, border: '3px solid #333', borderTopColor: '#f5c518', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            }>
              <Routes>
                <Route path="/" element={
                  <Home
                    ratings={ratings}
                    onRateMovie={handleRateMovie}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                    user={user}
                  />
                } />
                <Route path="/movie/:id" element={
                  <MovieDetail
                    ratings={ratings}
                    onRateMovie={handleRateMovie}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                    user={user}
                    onDeleteRating={deleteRating}
                  />
                } />
                <Route path="/watchlist" element={
                  <Watchlist
                    watchlist={watchlist}
                    onRemoveFromWatchlist={removeFromWatchlist}
                    onRateMovie={handleRateMovie}
                    ratings={ratings}
                    user={user}
                  />
                } />
                <Route path="/ratings" element={
                  <MyRatings
                    ratings={ratings}
                    onRateMovie={handleRateMovie}
                    onDeleteRating={deleteRating}
                    user={user}
                  />
                } />
                <Route path="/profile" element={
                  <Profile
                    user={user}
                    ratings={ratings}
                    watchlist={watchlist}
                    onLogout={async () => {
                      await logout();
                      window.location.href = '/login';
                    }}
                    onUpdatePhoto={updateProfilePhoto}
                  />
                } />
                <Route path="/explore" element={
                  <Explore
                    ratings={ratings}
                    onRateMovie={handleRateMovie}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                } />
                <Route path="/ai" element={
                  <AIRecommendations
                    ratings={ratings}
                    user={user}
                  />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/user/:userId" element={<UserProfile currentUser={user} />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />

          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />

          <RatingModal
            isOpen={isRatingOpen}
            onClose={() => setIsRatingOpen(false)}
            movie={selectedMovie}
            existingRating={selectedMovie ? ratings.find(r => r.movieId === selectedMovie.id) : null}
            onSave={handleSaveRating}
          />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
