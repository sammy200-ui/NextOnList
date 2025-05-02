import React, { useState, useEffect } from "react";
import AnimeList from "../components/AnimeList";
import { getAnimeCategories } from "../api/jikan";  // Updated import path
import { useNavigate } from "react-router-dom";

function Anime({ searchResults }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({
    topRated: [],
    seasonal: [],
    hiddenGems: []
  });
  const [loading, setLoading] = useState(true);

  const personalFavorites = [
    {
      id: 16498,
      title: { english: 'Attack on Titan', romaji: 'Shingeki no Kyojin' },
      description: "Humanity's last stand against man-eating giants",
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/1361/130998.jpg' },
      startDate: { year: 2013 },
      averageScore: 90
    },
    {
      id: 101348,
      title: { english: 'Vinland Saga', romaji: 'Vinland Saga' },
      description: 'A tale of revenge and discovery in the Viking Age.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/1500/103005.jpg' },
      startDate: { year: 2019 },
      averageScore: 87
    },
    {
      id: 19,
      title: { english: 'Monster', romaji: 'Monster' },
      description: 'A psychological thriller following Dr. Tenma\'s pursuit of a killer.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/10/18793.jpg' },
      startDate: { year: 2004 },
      averageScore: 89
    },
    {
      id: 98444,
      title: { english: 'Grand Blue', romaji: 'Grand Blue' },
      description: 'A comedy about college life, diving, and questionable drinking practices.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/1302/94882.jpg' },
      startDate: { year: 2018 },
      averageScore: 84
    },
    {
      id: 9253,
      title: { english: 'Steins;Gate', romaji: 'Steins;Gate' },
      description: 'A sci-fi thriller about time travel and its consequences.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg' },
      startDate: { year: 2011 },
      averageScore: 93
    },
    {
      id: 21827,
      title: { english: 'Violet Evergarden', romaji: 'Violet Evergarden' },
      description: 'A former soldier learns about love through ghostwriting letters.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/1614/106512.jpg' },
      startDate: { year: 2018 },
      averageScore: 89
    },
    {
      id: 11111,
      title: { english: 'Another', romaji: 'Another' },
      description: 'A horror mystery about a cursed class and mysterious deaths.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/4/75509.jpg' },
      startDate: { year: 2012 },
      averageScore: 77
    },
    {
      id: 1689,
      title: { english: '5 Centimeters per Second', romaji: 'Byousoku 5 Centimeter' },
      description: 'A story about distance, time, and how they affect relationships.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/1417/112991.jpg' },
      startDate: { year: 2007 },
      averageScore: 81
    },
    {
      id: 32281,
      title: { english: 'Your Name', romaji: 'Kimi no Na wa' },
      description: 'Two strangers find themselves mysteriously switching bodies.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/5/87048.jpg' },
      startDate: { year: 2016 },
      averageScore: 91
    },
    {
      id: 431,
      title: { english: 'Howl\'s Moving Castle', romaji: 'Howl no Ugoku Shiro' },
      description: 'A magical adventure about a cursed young woman and a mysterious wizard.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/5/75810.jpg' },
      startDate: { year: 2004 },
      averageScore: 87
    },
    {
      id: 289,
      title: { english: 'Grave of the Fireflies', romaji: 'Hotaru no Haka' },
      description: 'A heartbreaking tale of two siblings struggling to survive during WWII.',
      coverImage: { large: 'https://cdn.myanimelist.net/images/anime/7/75808.jpg' },
      startDate: { year: 1988 },
      averageScore: 89
    }
  ];

  const fetchAnimeCategories = async () => {
    try {
      const data = await getAnimeCategories();
      if (data && (data.topRated || data.seasonal || data.hiddenGems)) {
        setCategories(data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching anime categories:', error);
      // Set default categories with personal favorites only
      setCategories({
        topRated: [],
        seasonal: [],
        hiddenGems: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeCategories();
    // Refresh content every 30 minutes
    const refreshInterval = setInterval(fetchAnimeCategories, 30 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (searchResults?.length > 0) {
    return <AnimeList animeList={searchResults} />;
  }

  return (
    <div className="anime-page">
      <h2>Anime</h2>
      {loading ? (
        <div className="loading">Loading anime...</div>
      ) : (
        <div className="anime-categories">
          <div className="category-section">
            <h3>Personal Favorites</h3>
            <div className="content-grid">
              {personalFavorites.map((anime) => (
                <div 
                  key={anime.id} 
                  className="anime-card"
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="anime-poster"
                  />
                  <div className="card-content">
                    <h3>{anime.title.english || anime.title.romaji}</h3>
                    <p className="description">{anime.description}</p>
                    <p>Year: {anime.startDate.year}</p>
                    <p className="rating">★ {(anime.averageScore / 10).toFixed(1)}/10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>Top-Rated Anime</h3>
            <div className="content-grid">
              {categories.topRated.map((anime, index) => (
                <div 
                  key={`topRated-${anime.id}-${index}`} 
                  className="anime-card"
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="anime-poster"
                  />
                  <div className="card-content">
                    <h3>{anime.title.english || anime.title.romaji}</h3>
                    <p className="description">{anime.description}</p>
                    <p>Year: {anime.startDate.year}</p>
                    <p className="rating">★ {(anime.averageScore / 10).toFixed(1)}/10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>Seasonal Anime</h3>
            <div className="content-grid">
              {categories.seasonal.map((anime, index) => (
                <div 
                  key={`seasonal-${anime.id}-${index}`} 
                  className="anime-card"
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="anime-poster"
                  />
                  <div className="card-content">
                    <h3>{anime.title.english || anime.title.romaji}</h3>
                    <p className="description">{anime.description}</p>
                    <p>Year: {anime.startDate.year}</p>
                    <p className="rating">★ {(anime.averageScore / 10).toFixed(1)}/10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h3>Hidden Gems</h3>
            <div className="content-grid">
              {categories.hiddenGems.map((anime, index) => (
                <div 
                  key={`hiddenGems-${anime.id}-${index}`} 
                  className="anime-card"
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    className="anime-poster"
                  />
                  <div className="card-content">
                    <h3>{anime.title.english || anime.title.romaji}</h3>
                    <p className="description">{anime.description}</p>
                    <p>Year: {anime.startDate.year}</p>
                    <p className="rating">★ {(anime.averageScore / 10).toFixed(1)}/10</p>
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

export default Anime;