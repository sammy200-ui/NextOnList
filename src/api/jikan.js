const JIKAN_URL = 'https://api.jikan.moe/v4';

// wait a bit between requests so we don't get rate limited
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchAnime = async (endpoint) => {
  try {
    const res = await fetch(`${JIKAN_URL}${endpoint}`);
    
    // they rate limit pretty aggressively
    if (res.status === 429) {
      await wait(2000);
      return fetchAnime(endpoint); // try again
    }
    
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log('Jikan fetch failed:', err);
    throw err;
  }
};

// convert jikan data to something more usable
const convertAnime = (anime) => ({
  id: anime.mal_id,
  title: {
    english: anime.title_english || anime.title,
    romaji: anime.title
  },
  description: anime.synopsis,
  coverImage: {
    large: anime.images.jpg.large_image_url
  },
  startDate: {
    year: anime.year || new Date(anime.aired.from).getFullYear()
  },
  averageScore: anime.score * 10
});

export const getAnimeCategories = async () => {
  try {
    const topRated = await fetchAnime('/top/anime?filter=bypopularity');
    await wait(1000); 
    
    const seasonal = await fetchAnime('/seasons/now');
    await wait(1000); 
    
    const hiddenGems = await fetchAnime('/top/anime?filter=favorite');

    return {
      topRated: topRated.map(convertAnime),
      seasonal: seasonal.map(convertAnime),
      hiddenGems: hiddenGems.map(convertAnime)
    };
  } catch (err) {
    console.log('Failed to get anime categories:', err);
    return {
      topRated: [],
      seasonal: [],
      hiddenGems: []
    };
  }
};