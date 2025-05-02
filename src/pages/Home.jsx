import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingContent } from '../api/tmdb';

function Home({ searchResults, trendingRefs, scrollContent }) {
  const navigate = useNavigate();
  const [trending, setTrending] = useState({ movies: [], tvShows: [], anime: [] });
  const [loading, setLoading] = useState(true);

  const fetchTrending = async () => {
    try {
      const data = await getTrendingContent();
      setTrending(data);
    } catch (error) {
      console.error('Error fetching trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
   
    const refreshInterval = setInterval(fetchTrending, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  
  if (searchResults?.length > 0) {
    const movies = searchResults.filter(item => item.media_type === 'movie');
    const tvShows = searchResults.filter(item => item.media_type === 'tv');
    const anime = searchResults.filter(item => item.media_type === 'tv' && item.original_language === 'ja');
  
    return (
      <div className="home">
        <h2>Search Results</h2>
        <div className="trending-content">
          {movies.length > 0 && (
            <div className="trending-section">
              <h3>Movies</h3>
              <div className="content-grid">
                {movies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="movie-card"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
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
            </div>
          )}
  
          {tvShows.length > 0 && (
            <div className="trending-section">
              <h3>TV Shows</h3>
              <div className="content-grid">
                {tvShows.map((show) => (
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
                      <p>{show.first_air_date?.split('-')[0]}</p>
                      <p className="rating">★ {show.vote_average?.toFixed(1)}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {anime.length > 0 && (
            <div className="trending-section">
              <h3>Anime</h3>
              <div className="content-grid">
                {anime.map((anime) => (
                  <div 
                    key={anime.id} 
                    className="anime-card"
                    onClick={() => navigate(`/anime/${anime.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${anime.poster_path}`} 
                      alt={anime.name}
                      className="anime-poster"
                    />
                    <div className="card-content">
                      <h3>{anime.name}</h3>
                      <p className="description">{anime.overview}</p>
                      <p>{anime.first_air_date?.split('-')[0]}</p>
                      <p className="rating">★ {anime.vote_average?.toFixed(1)}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Update the trending section
  return (
    <div className="home">
      <h2>Trending Now</h2>
      {loading ? (
        <div className="loading">Loading trending content...</div>
      ) : (
        <div className="trending-content">
          <div className="trending-section">
            <h3>Trending Movies</h3>
            <div className="content-grid" ref={trendingRefs.movies}>
              {trending.movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
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
          </div>

          <div className="trending-section">
            <h3>Trending TV Shows</h3>
            <div className="content-grid" ref={trendingRefs.tv}>
              {trending.tvShows.map((show) => (
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
                    <p>{show.first_air_date?.split('-')[0]}</p>
                    <p className="rating">★ {show.vote_average?.toFixed(1)}/10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="trending-section">
            <h3>Trending Anime</h3>
            <div className="content-grid" ref={trendingRefs.anime}>
              {trending.anime.map((anime) => (
                <div 
                  key={anime.id} 
                  className="anime-card"
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${anime.poster_path}`} 
                    alt={anime.name}
                    className="anime-poster"
                  />
                  <div className="card-content">
                    <h3>{anime.name}</h3>
                    <p className="description">{anime.overview}</p>
                    <p>{anime.first_air_date?.split('-')[0]}</p>
                    <p className="rating">★ {anime.vote_average?.toFixed(1)}/10</p>
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

export default Home;