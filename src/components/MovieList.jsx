import React from 'react';
import { useNavigate } from 'react-router-dom';

function MovieList({ movies }) {
  const navigate = useNavigate();

  return (
    <div className="content-grid">
      {movies?.map((movie) => (
        <div 
          key={movie.id} 
          className="movie-card"
          onClick={() => navigate(`/movie/${movie.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
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
  );
}

export default MovieList;