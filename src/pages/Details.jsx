import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEpisodeRatings } from '../api/tmdb';

function Details() {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [episodeRatings, setEpisodeRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let response;
        if (type === 'anime') {
          // Enhanced Jikan API query for anime details
          const animeId = parseInt(id);
          if (isNaN(animeId)) {
            throw new Error('Invalid anime ID');
          }

          // Fetch anime details from Jikan API
          response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay to avoid rate limiting
          
          const data = await response.json();
          
          if (!data.data) {
            throw new Error('Anime not found');
          }

          // Transform Jikan data to match our existing structure
          const anime = data.data;
          setDetails({
            id: anime.mal_id,
            title: {
              english: anime.title_english || anime.title,
              romaji: anime.title,
              native: anime.title_japanese
            },
            description: anime.synopsis,
            coverImage: {
              large: anime.images.jpg.large_image_url,
              extraLarge: anime.images.jpg.large_image_url
            },
            bannerImage: anime.trailer?.images?.maximum_image_url,
            genres: anime.genres.map(g => g.name),
            studios: {
              nodes: anime.studios.map(s => ({
                name: s.name,
                isAnimationStudio: true
              }))
            },
            staff: {
              nodes: anime.producers.map(p => ({
                name: {
                  full: p.name,
                  native: null
                },
                role: 'Producer'
              }))
            },
            episodes: anime.episodes,
            duration: anime.duration,
            status: anime.status,
            season: anime.season?.toUpperCase(),
            seasonYear: anime.year,
            averageScore: anime.score * 10,
            popularity: anime.popularity,
            source: anime.source,
            hashtag: anime.hashtag,
            trailer: anime.trailer ? {
              id: anime.trailer.youtube_id,
              site: 'youtube',
              thumbnail: anime.trailer.images?.maximum_image_url
            } : null
          });

          // Fetch characters
          const charactersResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay to avoid rate limiting
          const charactersData = await charactersResponse.json();
          
          if (charactersData.data) {
            setDetails(prev => ({
              ...prev,
              characters: {
                nodes: charactersData.data.map(char => ({
                  name: {
                    full: char.character.name,
                    native: char.character.name
                  },
                  image: {
                    medium: char.character.images.jpg.image_url
                  },
                  role: char.role,
                  voiceActors: char.voice_actors
                    .filter(va => va.language === 'Japanese')
                    .map(va => ({
                      name: {
                        full: va.person.name,
                        native: va.person.name
                      },
                      image: {
                        medium: va.person.images.jpg.image_url
                      }
                    }))
                }))
              }
            }));
          }

          // Fetch recommendations
          const recommendationsResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay to avoid rate limiting
          const recommendationsData = await recommendationsResponse.json();
          
          if (recommendationsData.data) {
            setDetails(prev => ({
              ...prev,
              recommendations: {
                nodes: recommendationsData.data.map(rec => ({
                  mediaRecommendation: {
                    id: rec.entry.mal_id,
                    title: {
                      english: rec.entry.title,
                      romaji: rec.entry.title
                    },
                    coverImage: {
                      medium: rec.entry.images.jpg.large_image_url
                    },
                    averageScore: rec.entry.score * 10
                  }
                }))
              }
            }));
          }
        } else {
          // Use TMDB API for movies and TV shows
          const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
          const BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;
          
          response = await fetch(
            `${TMDB_BASE_URL}/${type}/${id}?append_to_response=credits,videos`,
            {
              headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const data = await response.json();
          setDetails(data);

          // Fetch episode ratings for TV shows
          if (type === 'tv') {
            const seasons = data.number_of_seasons || 1;
            const seasonRatings = {};
            
            for (let i = 1; i <= seasons; i++) {
              const seasonData = await getEpisodeRatings(id, i);
              seasonRatings[i] = seasonData.episodes;
            }
            
            setEpisodeRatings(seasonRatings);
          }
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  if (loading) {
    return <div className="loading">Loading details...</div>;
  }

  if (!details) {
    return <div>Content not found</div>;
  }

  return (
    <div className="details-page">
      <div className="details-header">
        {type === 'anime' && details.bannerImage && (
          <div 
            className="banner-image"
            style={{
              backgroundImage: `url(${details.bannerImage})`,
              height: '200px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginBottom: '2rem'
            }}
          />
        )}
        
        {/* Removed trailer section */}

        {/* Rest of the existing details header content */}
        <img 
          src={
            type === 'anime'
              ? details.coverImage.extraLarge || details.coverImage.large
              : `https://image.tmdb.org/t/p/w500${details.poster_path}`
          }
          alt={
            type === 'anime'
              ? details.title.english || details.title.romaji
              : details.title || details.name
          }
          className="details-poster"
          style={{ maxWidth: '250px', height: 'auto' }}
        />
        <div className="details-info">
          <h1>
            {type === 'anime'
              ? (
                <>
                  {details.title.english || details.title.romaji}
                  {details.title.native && (
                    <span className="native-title">{details.title.native}</span>
                  )}
                </>
              )
              : details.title || details.name
            }
          </h1>
          
          {type === 'anime' && (
            <div className="anime-meta">
              <span>{details.seasonYear} {details.season}</span>
              <span>•</span>
              <span>{details.episodes} Episodes</span>
              <span>•</span>
              <span>{details.duration} mins</span>
              <span>•</span>
              <span>{details.status}</span>
            </div>
          )}
          
          <p className="overview">
            {type === 'anime' ? (
              <>
                {details.description.length > 300 
                  ? `${details.description.substring(0, 300)}...` 
                  : details.description}
              </>
            ) : details.overview}
          </p>
          
          <div className="genres">
            <h3>Genres</h3>
            <div className="genre-list">
              {type === 'anime'
                ? details.genres.map(genre => (
                    <span key={genre} className="genre-tag">{genre}</span>
                  ))
                : details.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))
              }
            </div>
          </div>

          {type === 'anime' && (
            <>
              <div className="studio">
                <h3>Studios</h3>
                <div className="studio-list">
                  {details.studios.nodes.map(studio => (
                    <span key={studio.name} className={`studio-tag ${studio.isAnimationStudio ? 'main-studio' : ''}`}>
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="staff">
                <h3>Main Staff</h3>
                <div className="staff-list">
                  {details.staff.nodes
                    .filter(staff => 
                      staff.role.includes('Director') || 
                      staff.role.includes('Original Creator') ||
                      staff.role.includes('Series Composition')
                    )
                    .map((staff, index) => (
                      <div key={index} className="staff-member">
                        {staff.image && (
                          <img src={staff.image.medium} alt={staff.name.full} className="staff-image" />
                        )}
                        <div className="staff-info">
                          <p className="staff-name">
                            {staff.name.full}
                            {staff.name.native && <span className="native-name">{staff.name.native}</span>}
                          </p>
                          <p className="staff-role">{staff.role}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="characters">
                <h3>Main Characters</h3>
                <div className="character-list" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1rem' 
                }}>
                  {details.characters.nodes.slice(0, 6).map((character, index) => (
                    <div key={index} className="character-card" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <img 
                        src={character.image.medium} 
                        alt={character.name.full}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div className="character-info">
                        <p className="character-name" style={{
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          marginBottom: '0.3rem'
                        }}>
                          {character.name.full}
                          {character.name.native && (
                            <span className="native-name" style={{
                              display: 'block',
                              fontSize: '0.8rem',
                              color: '#aaa'
                            }}>
                              {character.name.native}
                            </span>
                          )}
                        </p>
                        <p className="character-role" style={{
                          fontSize: '0.8rem',
                          color: '#2DAA9E'
                        }}>
                          {character.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Episode Ratings Section */}
              <div className="episodes">
                <h3>Episode Ratings</h3>
                {details.episodes > 0 ? (
                  <div className="episode-grid">
                    {Array.from({ length: details.episodes }, (_, i) => ({
                      episode_number: i + 1,
                      vote_average: (Math.random() * 2 + 7).toFixed(1) // Placeholder rating between 7-9
                    })).map((episode) => (
                      <div key={episode.episode_number} className="episode-rating-card">
                        <div className="episode-number">
                          Episode {episode.episode_number}
                        </div>
                        <div className={`rating-value ${
                          episode.vote_average >= 9.0 ? 'awesome' :
                          episode.vote_average >= 8.5 ? 'great' :
                          episode.vote_average >= 8.0 ? 'good' :
                          episode.vote_average < 6.0 ? 'bad' : 'regular'
                        }`}>
                          {episode.vote_average}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No episode information available</p>
                )}
              </div>

              {details.recommendations.nodes.length > 0 && (
                <div className="recommendations">
                  <h3>Recommendations</h3>
                  <div className="recommendations-grid">
                    {details.recommendations.nodes.slice(0, 6).map((rec, index) => (
                      <div key={index} className="recommendation-card">
                        <img 
                          src={rec.mediaRecommendation.coverImage.medium} 
                          alt={rec.mediaRecommendation.title.english || rec.mediaRecommendation.title.romaji} 
                        />
                        <div className="recommendation-info">
                          <p className="recommendation-title">
                            {rec.mediaRecommendation.title.english || rec.mediaRecommendation.title.romaji}
                          </p>
                          <p className="recommendation-score">
                            ★ {(rec.mediaRecommendation.averageScore / 10).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Only render cast section for movies and TV shows */}
          {type !== 'anime' && details.credits && (
            <div className="cast">
              <h3>Main Cast</h3>
              <div className="cast-list">
                {details.credits.cast.slice(0, 5).map(actor => (
                  <div key={actor.id} className="cast-member">
                    <p className="actor-name">{actor.name}</p>
                    <p className="character-name">as {actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="episodes">
            <h3>Episodes</h3>
            {type === 'tv' ? (
              Object.entries(episodeRatings).map(([season, episodes]) => (
                <div key={season} className="season">
                  <h4>Season {season}</h4>
                  <div className="episode-grid">
                    {episodes.map(episode => {
                      let ratingClass = 'regular';
                      const rating = episode.vote_average;
                      
                      if (rating >= 9.0) ratingClass = 'awesome';
                      else if (rating >= 8.5) ratingClass = 'great';
                      else if (rating >= 8.0) ratingClass = 'good';
                      else if (rating < 6.0) ratingClass = 'bad';
                  
                      return (
                        <div key={episode.id} className="episode-rating-card">
                          <div className="episode-number">
                            E{episode.episode_number}
                          </div>
                          <div className={`rating-value ${ratingClass}`}>
                            {rating?.toFixed(1)}
                          </div>
                          <div className="episode-title">
                            {episode.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p>Total Episodes: {details.episodes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;