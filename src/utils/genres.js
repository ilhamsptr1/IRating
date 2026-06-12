export const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

export const getGenreName = (id) => GENRES[id] || "Unknown";

export const getFavoriteGenre = (ratings) => {
  if (!ratings || ratings.length === 0) return "-";
  
  const genreCounts = {};
  ratings.forEach(rating => {
    if (rating.genres) {
      rating.genres.forEach(gId => {
        genreCounts[gId] = (genreCounts[gId] || 0) + 1;
      });
    }
  });
  
  if (Object.keys(genreCounts).length === 0) return "-";
  
  const favId = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
  return getGenreName(favId);
};
