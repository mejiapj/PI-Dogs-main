import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FilterOptions.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterOptions } from '../../actions/dogsActions';

const FilterOptions = () => {
  const dispatch = useDispatch();
  const filterOptions = useSelector((state) => state.filterOptions);
  const [temperaments, setTemperaments] = useState([]);

  useEffect(() => {
    const fetchTemperaments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/temperaments');
        const data = response.data;
        setTemperaments(data);
      } catch (error) {
        console.error('Error fetching temperaments:', error);
      }
    };

    fetchTemperaments();
  }, []);

  const handleTemperamentChange = (e) => {
    dispatch(
      setFilterOptions({ ...filterOptions, temperament: e.target.value })
    );
  };

  const handleSourceChange = (e) => {
    dispatch(setFilterOptions({ ...filterOptions, source: e.target.value }));
  };

  return (
    <div className="filter-options">
      <label htmlFor="temperament-select">Temperament:</label>
      <select
        id="temperament-select"
        value={filterOptions?.temperament || ''}
        onChange={handleTemperamentChange}
      >
        <option value="">All</option>
        {temperaments.map((temperament) => (
          <option key={temperament.name} value={temperament.name}>
            {temperament.name}
          </option>
        ))}
      </select>

      <label htmlFor="source-select">Source:</label>
      <select
        id="source-select"
        value={filterOptions?.source || ''}
        onChange={handleSourceChange}
      >
        <option value="">All</option>
        <option value="API">API</option>
        <option value="BD">DB</option>
      </select>
    </div>
  );
};

export default FilterOptions;
