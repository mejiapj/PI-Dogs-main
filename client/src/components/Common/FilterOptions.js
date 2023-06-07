import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setFilterOptions, filterDogs } from '../../actions/dogsActions';
import { fetchTemperaments } from '../../actions/temperamentActions';

const FilterOptions = () => {
  const dispatch = useDispatch();
  const filterOptions = useSelector((state) => state.filterOptions) || {
    temperament: '',
    source: '',
  };

  const temperaments = useSelector((state) => state.temperament) || [];
  const dogs = useSelector((state) => state.dogs.dogs) || [];

  useEffect(() => {
    dispatch(fetchTemperaments());
  }, [dispatch]);

  const handleTemperamentChange = (e) => {
    const selectedTemperament = e.target.value;
    dispatch(
      setFilterOptions({ ...filterOptions, temperament: selectedTemperament })
    );
    dispatch(filterDogs(dogs, selectedTemperament, filterOptions.source));
  };

  const handleSourceChange = (e) => {
    const selectedSource = e.target.value;
    dispatch(setFilterOptions({ ...filterOptions, source: selectedSource }));
    dispatch(filterDogs(dogs, filterOptions.temperament, selectedSource));
  };

  return (
    <div className="filter-options">
      <label htmlFor="temperament-select">Temperament:</label>
      <select
        id="temperament-select"
        value={filterOptions.temperament}
        onChange={handleTemperamentChange}
      >
        <option value="">All</option>
        {temperaments.map((temperament) => (
          <option key={temperament.id} value={temperament.name}>
            {temperament.name}
          </option>
        ))}
      </select>

      <label htmlFor="source-select">Source:</label>
      <select
        id="source-select"
        value={filterOptions.source}
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
