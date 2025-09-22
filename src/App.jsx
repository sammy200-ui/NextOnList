import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import { searchContent } from './api/tmdb';
import './App.css';
import Movies from './pages/Movies';  
import TVShows from './pages/TVShows';  
import Anime from './pages/Anime';  
import Details from './pages/Details';

function App() {
  const [results, setResults] = useState([]);
  const refs = {
    movies: useRef(null),
    tv: useRef(null),
    anime: useRef(null)
  };

  const doSearch = async (query) => {
    const data = await searchContent(query);
    setResults(data.results || []);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <SearchBar onSearch={doSearch} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <Home 
                searchResults={results} 
                trendingRefs={refs}
              />
            } />
            <Route path="/movies" element={<Movies searchResults={results} />} />
            <Route path="/tv" element={<TVShows searchResults={results} />} />
            <Route path="/anime" element={<Anime searchResults={results} />} />
            <Route path="/:type/:id" element={<Details />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
