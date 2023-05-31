import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchBar from './Common/SearchBar';
import Pagination from './Common/Pagination';
import FilterOptions from './Common/FilterOptions';
import SortOptions from './Common/SortOptions';
import DogCard from './Common/DogCard';

const HomePage = () => {
  const history = useHistory();
  const [dogs, setDogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    dogsPerPage: 8,
  });
  const [filterOptions, setFilterOptions] = useState({
    temperament: '',
    source: '',
  });
  const [sortOptions, setSortOptions] = useState('');

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await fetch('http://localhost:3001/dogs');
        const data = await response.json();
        // console.log(data);
        setDogs(data);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchDogs();
  }, []);

  useEffect(() => {
    const filterAndSortDogs = () => {
      const filteredAndSortedDogs = dogs
        .filter((dog) => dog.nombre.includes(searchQuery))
        .filter((dog) => {
          if (filterOptions.temperament) {
            return dog.temperaments.includes(filterOptions.temperament);
          }
          return true;
        })
        .filter((dog) => {
          if (filterOptions.source) {
            return dog.origen === filterOptions.source;
          }
          return true;
        })
        .sort((a, b) => {
          if (sortOptions === 'alphabetical') {
            return a.nombre.localeCompare(b.nombre);
          } else if (sortOptions === 'weight') {
            return parseFloat(a.peso.metric) - parseFloat(b.peso.metric);
          }
          return 0;
        });

      setFilteredDogs(filteredAndSortedDogs);
    };

    filterAndSortDogs();
  }, [dogs, searchQuery, filterOptions, sortOptions]);

  const handleCardClick = (dog) => {
    history.push({
      pathname: `/dogs/${dog.id}`,
      state: { dog: dog },
    });
  };

  return (
    <div>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <FilterOptions
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <SortOptions sortOptions={sortOptions} setSortOptions={setSortOptions} />
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

      <Pagination
        currentPage={pagination.currentPage}
        dogsPerPage={pagination.dogsPerPage}
        totalDogs={filteredDogs.length}
        onChangePage={(page) =>
          setPagination({ ...pagination, currentPage: page })
        }
      />
    </div>
  );
};

export default HomePage;
