import React from 'react';
import { useNavigate } from 'react-router-dom';

function TVShowList({ shows }) {
  const navigate = useNavigate();

  return (
    <div className="content-grid">
      {shows?.map((show) => (
        <div 
          key={show.id} 
          className="show-card"
          onClick={() => navigate(`/tv/${show.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
            alt={show.name}
            className="show-poster"
          />
          <div className="card-content">
            <h3>{show.name}</h3>
            <p className="description">{show.overview}</p>
            <p>First Air: {show.first_air_date?.split('-')[0]}</p>
            <p className="rating">★ {show.vote_average?.toFixed(1)}/10</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TVShowList;