import React, { useState, useEffect } from 'react';
import { getTVShowCategories } from '../api/tmdb';
import TVShowList from '../components/TVShowList';
import { useNavigate } from 'react-router-dom';

function TVShows({ searchResults }) {
  const navigate = useNavigate();
  const [cats, setCats] = useState({
    topRated: [],
    basedOnTrueStory: [],
    randomPicks: []
  });
  const [loading, setLoading] = useState(true);

  const loadShows = async () => {
    try {
      const data = await getTVShowCategories();
      setCats(data);
    } catch (err) {
      console.log('TV shows loading failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
    // auto refresh every 30 mins
    const timer = setInterval(loadShows, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (searchResults?.length > 0) {
    return <TVShowList shows={searchResults} />;
  }

  // helper to avoid code duplication  
  const ShowCard = ({ show }) => (
    <div 
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
  );

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
              {cats.topRated.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>Based on True Stories</h3>
            <div className="content-grid">
              {cats.basedOnTrueStory.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>Random Picks</h3>
            <div className="content-grid">
              {cats.randomPicks.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TVShows;