import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setFilterOptions, setFilteredDogs } from '../../actions/dogsActions';
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
    filterDogs({
      ...filterOptions,
      temperament: selectedTemperament,
      source: filterOptions.source,
    });
  };

  const handleSourceChange = (e) => {
    const selectedSource = e.target.value;
    dispatch(setFilterOptions({ ...filterOptions, source: selectedSource }));
    filterDogs({
      ...filterOptions,
      temperament: filterOptions.temperament,
      source: selectedSource,
    });
  };

  const filterDogs = (options) => {
    const { temperament, source } = options;
    let filteredDogs = dogs;

    if (temperament) {
      filteredDogs = filteredDogs.filter(
        (dog) => dog.temperaments && dog.temperaments.includes(temperament)
      );
    }

    if (source) {
      filteredDogs = filteredDogs.filter((dog) => dog.source === source);
    }

    dispatch(setFilteredDogs(filteredDogs));
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
          <option key={temperament.id} value={temperament.id}>
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
