import React from 'react';
import { useNavigate } from 'react-router-dom';

function MovieList({ movies }) {
  const navigate = useNavigate();

  const openMovie = (id) => navigate(`/movie/${id}`);

  return (
    <div className="content-grid">
      {movies?.map((m) => (
        <div 
          key={m.id} 
          className="movie-card"
          onClick={() => openMovie(m.id)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
            alt={m.title}
            className="movie-poster"
          />
          <div className="card-content">
            <h3>{m.title}</h3>
            <p className="description">{m.overview}</p>
            <p>{m.release_date?.split('-')[0]}</p>
            <p className="rating">★ {m.vote_average?.toFixed(1)}/10</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;