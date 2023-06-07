import React, { useEffect } from 'react';
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
  const temperamentFilter = useSelector(
    (state) => state.temperament.temperamentFilter
  );
  const filteredDogs = useSelector((state) => state.dogs.filteredDogs);
  const pagination = useSelector((state) => state.dogs.pagination);
  const sortOptions = useSelector((state) => state.dogs.sortOptions);

  useEffect(() => {
    dispatch(fetchDogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterDogs(dogs, temperamentFilter, sortOptions));
  }, [dogs, temperamentFilter, sortOptions, dispatch]);

  const handleCardClick = (dog) => {
    history.push({
      pathname: `/dogs/${dog.id}`,
      state: { dog: dog },
    });
  };

  const handleSearch = (results) => {
    dispatch(setFilteredDogs(results));
  };

  const handleCreateDog = () => {
    history.push('/create-dog');
  };

  const handleChangePage = (page) => {
    dispatch(setPagination({ ...pagination, currentPage: page }));
  };

  const handleSortOptionsChange = (option) => {
    dispatch(setSortOptions(option));
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Pagination
        currentPage={pagination.currentPage}
        dogsPerPage={pagination.dogsPerPage}
        totalDogs={filteredDogs.length}
        onChangePage={handleChangePage}
      />
      <div className="filter-sort-container">
        <FilterOptions />
        <SortOptions onChange={handleSortOptionsChange} />
        <button className="create-dog-button" onClick={handleCreateDog}>
          Create Dog
        </button>
      </div>
      {filteredDogs
        .slice(
          (pagination.currentPage - 1) * pagination.dogsPerPage,
          pagination.currentPage * pagination.dogsPerPage
        )
        .map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            onClick={() => handleCardClick(dog)}
          />
        ))}
    </div>
  );
};

export default HomePage;
