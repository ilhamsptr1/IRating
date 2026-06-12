import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where, getDocs, setDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, updateProfile, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRScoq2DEaVi5TFtA8VK_ukHrNRDLbLmU",
  authDomain: "ratingfilm-1325d.firebaseapp.com",
  projectId: "ratingfilm-1325d",
  storageBucket: "ratingfilm-1325d.firebasestorage.app",
  messagingSenderId: "423052456129",
  appId: "1:423052456129:web:5c614843a3e9b6ce5e6440"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Auth hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !user.isAnonymous) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL || '',
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.error('Error syncing user profile:', error);
        }
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfilePhoto = async (photoURL) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL });
      await setDoc(doc(db, 'users', auth.currentUser.uid), { photoURL }, { merge: true });
      setUser({ ...auth.currentUser, photoURL });
    }
  };

  const loginAnonymously = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Anonymous login error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email registration error:', error);
      throw error;
    }
  };

  return { user, loading, loginWithGoogle, loginAnonymously, loginWithEmail, registerWithEmail, logout, updateProfilePhoto };
};

// Ratings hook
export const useRatings = (userId) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRatings([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'ratings'),
      where('userId', '==', userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRatings(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching ratings:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const addRating = async (movie, rating, review = '') => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'ratings'), {
        userId,
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path || '',
        genres: movie.genre_ids || movie.genres?.map(g => g.id) || [],
        genreNames: movie.genres?.map(g => g.name) || [],
        rating,
        review,
        releaseDate: movie.release_date || '',
        voteAverage: movie.vote_average || 0,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error('Error adding rating:', e);
    }
  };

  const updateRating = async (id, newRating, newReview = '') => {
    try {
      await updateDoc(doc(db, 'ratings', id), {
        rating: newRating,
        review: newReview,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error('Error updating rating:', e);
    }
  };

  const deleteRating = async (id) => {
    try {
      await deleteDoc(doc(db, 'ratings', id));
    } catch (e) {
      console.error('Error deleting rating:', e);
    }
  };

  return { ratings, loading, addRating, updateRating, deleteRating };
};

// Watchlist hook
export const useWatchlist = (userId) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setWatchlist([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'watchlist'),
      where('userId', '==', userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      setWatchlist(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching watchlist:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const addToWatchlist = async (movie) => {
    if (!userId) return;
    const existing = watchlist.find(w => w.movieId === movie.id);
    if (existing) return;
    try {
      await addDoc(collection(db, 'watchlist'), {
        userId,
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path || '',
        releaseDate: movie.release_date || '',
        voteAverage: movie.vote_average || 0,
        addedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error('Error adding to watchlist:', e);
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      await deleteDoc(doc(db, 'watchlist', id));
    } catch (e) {
      console.error('Error removing from watchlist:', e);
    }
  };

  const isInWatchlist = (movieId) => watchlist.some(w => w.movieId === movieId);

  return { watchlist, loading, addToWatchlist, removeFromWatchlist, isInWatchlist };
};

// User Profile & Follow System
export const searchUsers = async (searchQuery) => {
  if (!searchQuery) return [];
  try {
    // A simple client-side filter for demonstration, in production use Algolia or similar.
    const snapshot = await getDocs(collection(db, 'users'));
    const users = [];
    const queryLower = searchQuery.toLowerCase();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.displayName && data.displayName.toLowerCase().includes(queryLower)) {
        users.push(data);
      }
    });
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

export const getUserProfile = async (userId) => {
  try {
    const snapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const getUserStats = async (userId) => {
  try {
    const ratingsSnap = await getDocs(query(collection(db, 'ratings'), where('userId', '==', userId)));
    let totalRatings = 0;
    ratingsSnap.forEach(doc => { totalRatings += doc.data().rating });
    return {
      movieCount: ratingsSnap.size,
      totalRatings: totalRatings
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { movieCount: 0, totalRatings: 0 };
  }
};

export const useFollowSystem = (currentUserId) => {
  const [following, setFollowing] = useState([]);
  
  useEffect(() => {
    if (!currentUserId) {
      setFollowing([]);
      return;
    }
    const q = query(collection(db, 'follows'), where('followerId', '==', currentUserId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push(doc.data().followingId));
      setFollowing(data);
    });
    return () => unsubscribe();
  }, [currentUserId]);

  const followUser = async (targetUserId) => {
    if (!currentUserId || !targetUserId) return;
    try {
      // Check if already following
      const existing = await getDocs(query(collection(db, 'follows'), where('followerId', '==', currentUserId), where('followingId', '==', targetUserId)));
      if (!existing.empty) return;
      await addDoc(collection(db, 'follows'), {
        followerId: currentUserId,
        followingId: targetUserId,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async (targetUserId) => {
    if (!currentUserId || !targetUserId) return;
    try {
      const existing = await getDocs(query(collection(db, 'follows'), where('followerId', '==', currentUserId), where('followingId', '==', targetUserId)));
      existing.forEach(async (d) => {
        await deleteDoc(doc(db, 'follows', d.id));
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const isFollowing = (userId) => following.includes(userId);

  return { following, followUser, unfollowUser, isFollowing };
};
