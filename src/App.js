import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import TVShowList from './components/TVShowList';
import AnimeList from './components/AnimeList';
import Home from './pages/Home';
import { searchContent } from './api/tmdb';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    const results = await searchContent(query);
    setSearchResults(results.results || []);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <SearchBar onSearch={handleSearch} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieList movies={searchResults} />} />
            <Route path="/tv" element={<TVShowList shows={searchResults} />} />
            <Route path="/anime" element={<AnimeList animeList={searchResults} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;