const JIKAN_API_URL = 'https://api.jikan.moe/v4';

// Add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchJikan = async (endpoint) => {
  try {
    const response = await fetch(`${JIKAN_API_URL}${endpoint}`);
    
    // Handle rate limiting
    if (response.status === 429) {
      // Wait for 1 second before retrying
      await delay(2000);
      return fetchJikan(endpoint);
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
    // Add delays between requests to avoid rate limiting
    const topRatedResponse = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity');
    await delay(2000); // Wait 2 second between requests
    
    const seasonalResponse = await fetch('https://api.jikan.moe/v4/seasons/now');
    await delay(2000); // Wait 2 second between requests
    
    const hiddenGemsResponse = await fetch('https://api.jikan.moe/v4/top/anime?filter=favorite');
    
  
    const [topRatedData, seasonalData, hiddenGemsData] = await Promise.all([
      topRatedResponse.json(),
      seasonalResponse.json(),
      hiddenGemsResponse.json()
    ]);

    
    return {
      topRated: topRatedData.data.map(anime => ({
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
      seasonal: seasonalData.data.map(anime => ({
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
      hiddenGems: hiddenGemsData.data.map(anime => ({
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
    throw error;
  }
};