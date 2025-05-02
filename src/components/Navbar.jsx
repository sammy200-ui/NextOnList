import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">NextOnList</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/tv">TV Shows</Link>
        <Link to="/anime">Anime</Link>
      </div>
    </nav>
  );
}

export default Navbar;