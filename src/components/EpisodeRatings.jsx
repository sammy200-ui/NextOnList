import React, { useState, useEffect } from 'react';
import { getEpisodeRatings } from '../api/tmdb';

function EpisodeRatings({ showId, seasonNumber = 1 }) {
  const [eps, setEps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEps = async () => {
      const data = await getEpisodeRatings(showId, seasonNumber);
      if (data?.episodes) {
        setEps(data.episodes);
      }
      setLoading(false);
    };

    if (showId) loadEps();
  }, [showId, seasonNumber]);

  if (loading) return <div>Loading episodes...</div>;

  return (
    <div className="episode-ratings">
      <h3>Season {seasonNumber} Episodes</h3>
      <div className="episodes-grid">
        {eps.map((ep) => (
          <div key={ep.id} className="episode-card">
            <h4>Ep {ep.episode_number}: {ep.name}</h4>
            <p>Rating: {ep.vote_average?.toFixed(1)}/10</p>
            <p>Air Date: {ep.air_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpisodeRatings;