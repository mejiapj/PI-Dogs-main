import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from './Common/SearchBar';
import Pagination from './Common/Pagination';
import FilterOptions from './Common/FilterOptions';
import SortOptions from './Common/SortOptions';
import DogCard from './Common/DogCard';
import './HomePage.css';

import {
  fetchDogs,
  setFilteredDogs,
  setPagination,
  filterDogs,
  setSortOptions,
} from '../actions/dogsActions';

const HomePage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const dogs = useSelector((state) => state.dogs.dogs);
  const filterOptions = useSelector((state) => state.filterOptions);
  const pagination = useSelector((state) => state.dogs.pagination);

  useEffect(() => {
    dispatch(fetchDogs());
  }, [dispatch]);

  useEffect(() => {
    if (filterOptions && filterOptions.temperament) {
      const filteredDogs = filterDogs(
        dogs,
        filterOptions.temperament,
        filterOptions.source
      );
      dispatch(setFilteredDogs(filteredDogs));
    }
    // console.log('Breeds:', dogs);
  }, [dogs, filterOptions, dispatch]);

  const handleSearch = (results) => {
    // console.log('Breeds:', results);
    dispatch(setFilteredDogs(results));
  };

  const handleCreateDog = () => {
    history.push('/create-dog');
  };

  const handleChangePage = (page) => {
    dispatch(setPagination(page, pagination.itemsPerPage));
  };

  const handleSortOptionsChange = (option) => {
    dispatch(setSortOptions(option));
  };

  const paginatedDogs = useMemo(() => {
    if (dogs) {
      return dogs.slice(
        (pagination.currentPage - 1) * pagination.itemsPerPage,
        pagination.currentPage * pagination.itemsPerPage
      );
    }
    return [];
  }, [dogs, pagination]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Pagination
        currentPage={pagination.currentPage}
        dogsPerPage={pagination.itemsPerPage}
        totalDogs={dogs.length}
        onChangePage={handleChangePage}
      />
      <div className="filter-sort-container">
        <FilterOptions />
        <SortOptions onChange={handleSortOptionsChange} />
        <button className="create-dog-button" onClick={handleCreateDog}>
          Create Dog
        </button>
      </div>
      {paginatedDogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} onClick={() => {}} />
      ))}
    </div>
  );
};

export default HomePage;
