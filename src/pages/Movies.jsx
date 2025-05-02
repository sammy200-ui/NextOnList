import React, { useState, useEffect } from 'react';
import { getMovieCategories } from '../api/tmdb';
import MovieList from '../components/MovieList';
import { useNavigate } from 'react-router-dom';

function Movies({ searchResults }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    topRated: [],
    newReleases: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);

  const fetchMovieCategories = async () => {
    try {
      const data = await getMovieCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching movie categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieCategories();
    // Refresh content every 30 minutes
    const refreshInterval = setInterval(fetchMovieCategories, 30 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (searchResults?.length > 0) {
    return <MovieList movies={searchResults} />;
  }

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
              {categories.topRated.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
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
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>New Releases</h3>
            <div className="content-grid">
              {categories.newReleases.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
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
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>Coming Soon / Teasers</h3>
            <div className="content-grid">
              {categories.upcoming.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;