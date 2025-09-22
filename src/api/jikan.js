const JIKAN_API_URL = 'https://api.jikan.moe/v4';

// Add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchJikan = async (endpoint) => {
  try {
    const response = await fetch(`${JIKAN_API_URL}${endpoint}`);
    
    // Handle rate limiting
    if (response.status === 429) {
      // Wait for 2 seconds before retrying
      await delay(2000);
      return fetchJikan(endpoint);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching from Jikan:', error);
    throw error;
  }
};

export const getAnimeCategories = async () => {
  try {
    // Use the fetchJikan helper with proper rate limiting
    const topRatedData = await fetchJikan('/top/anime?filter=bypopularity');
    await delay(1000); // Wait 1 second between requests
    
    const seasonalData = await fetchJikan('/seasons/now');
    await delay(1000); // Wait 1 second between requests
    
    const hiddenGemsData = await fetchJikan('/top/anime?filter=favorite');

    
    return {
      topRated: topRatedData.map(anime => ({
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
      })),
      seasonal: seasonalData.map(anime => ({
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
      })),
      hiddenGems: hiddenGemsData.map(anime => ({
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
      }))
    };
  } catch (error) {
    console.error('Error fetching anime categories:', error);
    return {
      topRated: [],
      seasonal: [],
      hiddenGems: []
    };
  }
};