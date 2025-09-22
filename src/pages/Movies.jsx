import React, { useState, useEffect } from 'react';
import { getMovieCategories } from '../api/tmdb';
import MovieList from '../components/MovieList';
import { useNavigate } from 'react-router-dom';

function Movies({ searchResults }) {
  const navigate = useNavigate();
  const [cats, setCats] = useState({
    topRated: [],
    newReleases: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    try {
      const data = await getMovieCategories();
      setCats(data);
    } catch (err) {
      console.log('Movie loading failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const openMovie = (id) => navigate(`/movie/${id}`);

  useEffect(() => {
    loadMovies();
    // refresh every 30 mins
    const timer = setInterval(loadMovies, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (searchResults?.length > 0) {
    return <MovieList movies={searchResults} />;
  }

  // create a movie card component to avoid repetition
  const MovieCard = ({ movie }) => (
    <div 
      key={movie.id} 
      className="movie-card"
      onClick={() => openMovie(movie.id)}
      style={{ cursor: 'pointer' }}
    >
      <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
        alt={movie.title}
        className="movie-poster"
      />
      <div className="card-content">
        <h3>{movie.title}</h3>
        <p className="description">{movie.overview}</p>
        <p>{movie.release_date?.split('-')[0]}</p>
        <p className="rating">★ {movie.vote_average?.toFixed(1)}/10</p>
      </div>
    </div>
  );

  return (
    <div className="movies-page">
      <h2>Movies</h2>
      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <div className="movie-categories">
          <div className="category-section">
            <h3>Top Rated Movies</h3>
            <div className="content-grid">
              {cats.topRated.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          </div>

          <div className="category-section">
            <h3>New Releases</h3>
            <div className="content-grid">
              {cats.newReleases.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          </div>

          <div className="category-section">
            <h3>Coming Soon / Teasers</h3>
            <div className="content-grid">
              {cats.upcoming.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;