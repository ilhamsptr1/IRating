const API_KEY = '23822dcc3e7b5f88e8df05b213a040a5';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrending = async (timeWindow = 'week', lang = 'id-ID') => {
  const res = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=${lang}`);
  const data = await res.json();
  return data.results;
};

export const fetchPopularMovies = async (page = 1, lang = 'id-ID') => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${lang}&page=${page}`);
  const data = await res.json();
  return data.results;
};

export const fetchTopRated = async (lang = 'id-ID') => {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${lang}&page=1`);
  const data = await res.json();
  return data.results;
};

export const fetchNowPlaying = async (lang = 'id-ID') => {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=${lang}&page=1`);
  const data = await res.json();
  return data.results;
};

export const fetchUpcoming = async (lang = 'id-ID') => {
  const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=${lang}&page=1`);
  const data = await res.json();
  return data.results;
};

export const searchMovies = async (query, lang = 'id-ID') => {
  if (!query) return [];
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=${lang}&query=${encodeURIComponent(query)}&page=1`);
  const data = await res.json();
  return data.results;
};

export const fetchMovieDetails = async (movieId, lang = 'id-ID') => {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${lang}&append_to_response=credits,videos,similar,recommendations&include_video_language=id,en,ko,ja,hi,te,ta,th,zh,fr,es,de,null`);
  const data = await res.json();
  return data;
};

export const fetchMoviesByGenre = async (genreId, lang = 'id-ID', page = 1) => {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${lang}&with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=300&page=${page}`);
  const data = await res.json();
  return data;
};

export const fetchGenres = async (lang = 'id-ID') => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${lang}`);
  const data = await res.json();
  return data.genres;
};

export const fetchTopRatedThisYear = async (lang = 'id-ID') => {
  const year = new Date().getFullYear();
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${lang}&sort_by=vote_average.desc&primary_release_year=${year}&vote_count.gte=100&page=1`);
  const data = await res.json();
  return data.results;
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Poster';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
