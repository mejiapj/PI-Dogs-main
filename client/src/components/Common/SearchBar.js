import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';
import SearchIcon from '@material-ui/icons/Search';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.thedogapi.com/v1/breeds/search/?name=${searchQuery}`
      );
      const searchResults = response.data;
      console.log(searchResults);
      onSearch(searchResults);
    } catch (error) {
      console.error('Error searching breeds:', error);
    }
  };

  return (
    <div className="search-bar">
      <h1>Search by breed name</h1>
      <div>
        <div className="search-input">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Enter breed name"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchBar;
