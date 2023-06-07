import React from 'react';
import { useDispatch } from 'react-redux';
import { setSortOptions } from '../../actions/dogsActions';

const SortOptions = () => {
  const dispatch = useDispatch();

  const handleSortChange = (e) => {
    const selectedSortOption = e.target.value;
    dispatch(setSortOptions(selectedSortOption));
  };

  return (
    <div className="sort-options">
      <label htmlFor="sort-select">Sort by:</label>
      <select id="sort-select" onChange={handleSortChange}>
        <option value="alphabetical">Alphabetical (A-Z)</option>
        <option value="alphabetical-desc">Alphabetical (Z-A)</option>
        <option value="weight">Weight (asc)</option>
        <option value="weight-desc">Weight (desc)</option>
      </select>
    </div>
  );
};

export default SortOptions;
