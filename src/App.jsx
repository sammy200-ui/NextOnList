import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import { searchContent } from './api/tmdb';
import './App.css';
import Movies from './pages/Movies';  // This component is imported but not defined
import TVShows from './pages/TVShows';  // This component is imported but not defined
import Anime from './pages/Anime';  // This component is imported but not defined
import Details from './pages/Details';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const trendingRefs = {
    movies: useRef(null),
    tv: useRef(null),
    anime: useRef(null)
  };

  const handleSearch = async (query) => {
    const results = await searchContent(query);
    setSearchResults(results.results || []);
  };

  const scrollContent = (direction, section) => {
    const container = trendingRefs[section].current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <SearchBar onSearch={handleSearch} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <Home 
                searchResults={searchResults} 
                trendingRefs={trendingRefs}
                scrollContent={scrollContent}
              />
            } />
            <Route path="/movies" element={<Movies searchResults={searchResults} />} />
            <Route path="/tv" element={<TVShows searchResults={searchResults} />} />
            <Route path="/anime" element={<Anime searchResults={searchResults} />} />
            <Route path="/:type/:id" element={<Details />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
