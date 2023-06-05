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
    const filterAndSortDogs = () => {
      if (Array.isArray(dogs)) {
        const filteredAndSortedDogs = dogs
          .filter((dog) => {
            if (temperamentFilter) {
              return (
                dog.temperaments && dog.temperaments.includes(temperamentFilter)
              );
            }
            return true;
          })
          .sort((a, b) => {
            if (sortOptions === 'alphabetical') {
              return a.nombre.localeCompare(b.nombre);
            } else if (sortOptions === 'alphabetical-desc') {
              return b.nombre.localeCompare(a.nombre);
            } else if (sortOptions === 'weight') {
              return parseFloat(a.peso.metric) - parseFloat(b.peso.metric);
            } else if (sortOptions === 'weight-desc') {
              return parseFloat(b.peso.metric) - parseFloat(a.peso.metric);
            }
            return 0;
          });

        dispatch(setFilteredDogs(filteredAndSortedDogs));
      }
    };

    filterAndSortDogs();
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
        <SortOptions />
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
