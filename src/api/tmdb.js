const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json'
};

export const searchContent = async (query, type = 'multi') => {
  try {
    // Extract genre or category from query
    const searchQuery = query.toLowerCase().trim();
    let apiUrl = `${TMDB_BASE_URL}/search/${type}`;
    let params = `query=${encodeURIComponent(searchQuery)}`;

    // Handle specific genre searches
    if (searchQuery.includes('horror')) {
      apiUrl = `${TMDB_BASE_URL}/discover/movie`;
      params = 'with_genres=27&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    } else if (searchQuery.includes('action')) {
      apiUrl = `${TMDB_BASE_URL}/discover/movie`;
      params = 'with_genres=28&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    } else if (searchQuery.includes('comedy')) {
      apiUrl = `${TMDB_BASE_URL}/discover/movie`;
      params = 'with_genres=35&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    } else if (searchQuery.includes('drama')) {
      apiUrl = `${TMDB_BASE_URL}/discover/movie`;
      params = 'with_genres=18&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    }

    const response = await fetch(`${apiUrl}?${params}`, { headers });
    const data = await response.json();
    
    // Add media_type to results for proper UI handling
    if (data.results) {
      data.results = data.results.map(item => ({
        ...item,
        media_type: type === 'multi' ? (item.media_type || 'movie') : type
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error searching content:', error);
    return { results: [] };
  }
};

export const getEpisodeRatings = async (showId, seasonNumber) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}`,
      { headers }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching episode ratings:', error);
    return null;
  }
};

export const getTrendingContent = async () => {
  try {
    const [movies, tvShows, anime] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/trending/movie/week`, { headers }),
      fetch(`${TMDB_BASE_URL}/trending/tv/week`, { headers }),
      fetch(`${TMDB_BASE_URL}/discover/tv?with_original_language=ja&sort_by=popularity.desc`, { headers })
    ]);

    return {
      movies: (await movies.json()).results,
      tvShows: (await tvShows.json()).results,
      anime: (await anime.json()).results
    };
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return { movies: [], tvShows: [], anime: [] };
  }
};

export const getMovieCategories = async () => {
  try {
    const [topRated, newReleases, upcoming] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/top_rated`, { headers }),
      fetch(`${TMDB_BASE_URL}/movie/now_playing`, { headers }),
      fetch(`${TMDB_BASE_URL}/movie/upcoming`, { headers })
    ]);

    return {
      topRated: (await topRated.json()).results,
      newReleases: (await newReleases.json()).results,
      upcoming: (await upcoming.json()).results
    };
  } catch (error) {
    console.error('Error fetching movie categories:', error);
    return { topRated: [], newReleases: [], upcoming: [] };
  }
};

export const getTVShowCategories = async () => {
  try {
    const [topRated, basedOnTrueStory, randomShows] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/tv/top_rated`, { headers }),
      fetch(`${TMDB_BASE_URL}/discover/tv?with_genres=99&sort_by=vote_average.desc`, { headers }),
      fetch(`${TMDB_BASE_URL}/discover/tv?sort_by=random.desc`, { headers })
    ]);

    return {
      topRated: (await topRated.json()).results,
      basedOnTrueStory: (await basedOnTrueStory.json()).results,
      randomPicks: (await randomShows.json()).results
    };
  } catch (error) {
    console.error('Error fetching TV show categories:', error);
    return { topRated: [], basedOnTrueStory: [], randomPicks: [] };
  }
};