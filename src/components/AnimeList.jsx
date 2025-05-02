import React from 'react';
import { useNavigate } from 'react-router-dom';

function AnimeList({ animeList }) {
  const navigate = useNavigate();

  return (
    <div className="content-grid">
      {animeList?.map((anime) => {
        // Handle both TMDB and AniList data formats
        const title = anime.title?.english || anime.title?.romaji || anime.name;
        const description = anime.description || anime.overview;
        const year = anime.startDate?.year || anime.first_air_date?.split('-')[0];
        const rating = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : anime.vote_average?.toFixed(1);
        const image = anime.coverImage?.large || 
          (anime.poster_path ? `https://image.tmdb.org/t/p/w300${anime.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image');
        const animeId = anime.mal_id || anime.id;
        
        return (
          <div 
            key={animeId} 
            className="anime-card"
            onClick={() => {
              // Add a small delay before navigation to ensure proper state updates
              setTimeout(() => navigate(`/anime/${animeId}`), 100);
            }}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={image}
              alt={title}
              className="anime-poster"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
            <div className="card-content">
              <h3>{title}</h3>
              <p className="description">{description}</p>
              <p>{year}</p>
              <p className="rating">★ {rating}/10</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AnimeList;