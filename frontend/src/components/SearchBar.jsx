import React from "react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="🔍 Search for a task..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>
  );
}

export default SearchBar;
