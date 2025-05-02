import React, { useState, useEffect } from 'react';
import { getTVShowCategories } from '../api/tmdb';
import TVShowList from '../components/TVShowList';
import { useNavigate } from 'react-router-dom';

function TVShows({ searchResults }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    topRated: [],
    basedOnTrueStory: [],
    randomPicks: []
  });
  const [loading, setLoading] = useState(true);

  const fetchTVShowCategories = async () => {
    try {
      const data = await getTVShowCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching TV show categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShowCategories();
   
    const refreshInterval = setInterval(fetchTVShowCategories, 30 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (searchResults?.length > 0) {
    return <TVShowList shows={searchResults} />;
  }

  return (
    <div className="tv-shows-page">
      <h2>TV Shows</h2>
      {loading ? (
        <div className="loading">Loading TV shows...</div>
      ) : (
        <div className="tv-categories">
          <div className="category-section">
            <h3>Top Rated TV Shows</h3>
            <div className="content-grid">
              {categories.topRated.map((show) => (
                <div 
                  key={show.id} 
                  className="show-card"
                  onClick={() => navigate(`/tv/${show.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} 
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
          </div>

          <div className="category-section">
            <h3>Based on True Stories</h3>
            <div className="content-grid">
              {categories.basedOnTrueStory.map((show) => (
                <div 
                  key={show.id} 
                  className="show-card"
                  onClick={() => navigate(`/tv/${show.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} 
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
          </div>

          <div className="category-section">
            <h3>Random Picks</h3>
            <div className="content-grid">
              {categories.randomPicks.map((show) => (
                <div 
                  key={show.id} 
                  className="show-card"
                  onClick={() => navigate(`/tv/${show.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${show.poster_path}`} 
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
          </div>
        </div>
      )}
    </div>
  );
}

export default TVShows;