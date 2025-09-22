const API_BASE = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

// basic headers for requests
const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

export const searchContent = async (query, type = 'multi') => {
  try {
    const q = query.toLowerCase().trim();
    let url = `${API_BASE}/search/${type}`;
    let params = `query=${encodeURIComponent(q)}`;

    // quick genre shortcuts
    if (q.includes('horror')) {
      url = `${API_BASE}/discover/movie`;
      params = 'with_genres=27&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    } else if (q.includes('action')) {
      url = `${API_BASE}/discover/movie`;
      params = 'with_genres=28&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    } else if (q.includes('comedy')) {
      url = `${API_BASE}/discover/movie`;
      params = 'with_genres=35&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    } else if (q.includes('drama')) {
      url = `${API_BASE}/discover/movie`;
      params = 'with_genres=18&sort_by=popularity.desc&include_adult=false&language=en-US&page=1';
    }

    const res = await fetch(`${url}?${params}`, { headers });
    const data = await res.json();
    
    // add media type if missing
    if (data.results) {
      data.results = data.results.map(item => ({
        ...item,
        media_type: type === 'multi' ? (item.media_type || 'movie') : type
      }));
    }
    
    return data;
  } catch (err) {
    console.log('Search failed:', err);
    return { results: [] };
  }
};

export const getEpisodeRatings = async (showId, seasonNumber) => {
  try {
    const res = await fetch(`${API_BASE}/tv/${showId}/season/${seasonNumber}`, { headers });
    return await res.json();
  } catch (err) {
    console.log('Episode fetch failed:', err);
    return null;
  }
};

export const getTrendingContent = async () => {
  try {
    // get all trending stuff at once
    const [movies, tv, anime] = await Promise.all([
      fetch(`${API_BASE}/trending/movie/week`, { headers }),
      fetch(`${API_BASE}/trending/tv/week`, { headers }),
      fetch(`${API_BASE}/discover/tv?with_original_language=ja&sort_by=popularity.desc`, { headers })
    ]);

    return {
      movies: (await movies.json()).results,
      tvShows: (await tv.json()).results,
      anime: (await anime.json()).results
    };
  } catch (err) {
    console.log('Trending fetch failed:', err);
    return { movies: [], tvShows: [], anime: [] };
  }
};

export const getMovieCategories = async () => {
  try {
    const [topRated, newReleases, upcoming] = await Promise.all([
      fetch(`${API_BASE}/movie/top_rated`, { headers }),
      fetch(`${API_BASE}/movie/now_playing`, { headers }),
      fetch(`${API_BASE}/movie/upcoming`, { headers })
    ]);

    return {
      topRated: (await topRated.json()).results,
      newReleases: (await newReleases.json()).results,
      upcoming: (await upcoming.json()).results
    };
  } catch (err) {
    console.log('Movie categories failed:', err);
    return { topRated: [], newReleases: [], upcoming: [] };
  }
};

export const getTVShowCategories = async () => {
  try {
    const [topRated, basedOnTrue, random] = await Promise.all([
      fetch(`${API_BASE}/tv/top_rated`, { headers }),
      fetch(`${API_BASE}/discover/tv?with_genres=99&sort_by=vote_average.desc`, { headers }),
      fetch(`${API_BASE}/discover/tv?sort_by=random.desc`, { headers })
    ]);

    return {
      topRated: (await topRated.json()).results,
      basedOnTrueStory: (await basedOnTrue.json()).results,
      randomPicks: (await random.json()).results
    };
  } catch (err) {
    console.log('TV categories failed:', err);
    return { topRated: [], basedOnTrueStory: [], randomPicks: [] };
  }
};