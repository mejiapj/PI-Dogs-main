import React, { useState } from 'react';
import './SearchBar.css';
import SearchIcon from '@material-ui/icons/Search';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    // Aquí puedes implementar la lógica de búsqueda con el valor de searchQuery
    // Por ejemplo, puedes llamar a una función que realice la búsqueda de razas de perros por nombre
    // y actualizar el estado de tu componente principal con los resultados de la búsqueda.
    console.log('Realizar búsqueda con:', searchQuery);
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
