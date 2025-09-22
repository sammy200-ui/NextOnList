import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if(q.trim()) onSearch(q);
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for movies, TV shows, or anime..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;