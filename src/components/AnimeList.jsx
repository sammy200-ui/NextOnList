import React from 'react';
import { useNavigate } from 'react-router-dom';

function AnimeList({ animeList }) {
  const navigate = useNavigate();

  const openAnime = (id) => {
    // small delay to prevent double clicks
    setTimeout(() => navigate(`/anime/${id}`), 100);
  };

  return (
    <div className="content-grid">
      {animeList?.map((anime) => {
        // figure out what data we actually have
        const title = anime.title?.english || anime.title?.romaji || anime.name;
        const desc = anime.description || anime.overview;
        const year = anime.startDate?.year || anime.first_air_date?.split('-')[0];
        const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : anime.vote_average?.toFixed(1);
        const img = anime.coverImage?.large || 
          (anime.poster_path ? `https://image.tmdb.org/t/p/w300${anime.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image');
        const id = anime.mal_id || anime.id;
        
        return (
          <div 
            key={id} 
            className="anime-card"
            onClick={() => openAnime(id)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={img}
              alt={title}
              className="anime-poster"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
            <div className="card-content">
              <h3>{title}</h3>
              <p className="description">{desc}</p>
              <p>{year}</p>
              <p className="rating">★ {score}/10</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AnimeList;