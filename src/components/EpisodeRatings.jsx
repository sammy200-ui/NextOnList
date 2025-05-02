import React, { useState, useEffect } from 'react';
import { getEpisodeRatings } from '../api/tmdb';

function EpisodeRatings({ showId, seasonNumber = 1 }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      const data = await getEpisodeRatings(showId, seasonNumber);
      if (data && data.episodes) {
        setEpisodes(data.episodes);
      }
      setLoading(false);
    };

    fetchEpisodes();
  }, [showId, seasonNumber]);

  if (loading) return <div>Loading episodes...</div>;

  return (
    <div className="episode-ratings">
      <h3>Season {seasonNumber} Episodes</h3>
      <div className="episodes-grid">
        {episodes.map((episode) => (
          <div key={episode.id} className="episode-card">
            <h4>Episode {episode.episode_number}: {episode.name}</h4>
            <p>Rating: {episode.vote_average?.toFixed(1)}/10</p>
            <p>Air Date: {episode.air_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpisodeRatings;