import React from 'react';
import { useNavigate } from 'react-router-dom';

function TVShowList({ shows }) {
  const navigate = useNavigate();

  const openShow = (id) => navigate(`/tv/${id}`);

  return (
    <div className="content-grid">
      {shows?.map((s) => (
        <div 
          key={s.id} 
          className="show-card"
          onClick={() => openShow(s.id)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${s.poster_path}`}
            alt={s.name}
            className="show-poster"
          />
          <div className="card-content">
            <h3>{s.name}</h3>
            <p className="description">{s.overview}</p>
            <p>First Air: {s.first_air_date?.split('-')[0]}</p>
            <p className="rating">★ {s.vote_average?.toFixed(1)}/10</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TVShowList;