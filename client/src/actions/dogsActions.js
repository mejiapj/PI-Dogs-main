import {
  FETCH_DOGS_SUCCESS,
  SET_FILTERED_DOGS,
  SET_PAGINATION,
  SET_SORT_OPTIONS,
  SET_FILTER_OPTIONS,
} from '../reducers/dogReducer';

export const fetchDogs = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('http://localhost:3001/dogs');
      const data = await response.json();
      dispatch(fetchDogsSuccess(data));
      dispatch(setFilteredDogs(data));
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };
};

export const fetchDogsSuccess = (dogs) => {
  return {
    type: FETCH_DOGS_SUCCESS,
    payload: dogs,
  };
};

export const setFilteredDogs = (dogs) => {
  return {
    type: SET_FILTERED_DOGS,
    payload: dogs,
  };
};

export const setPagination = (currentPage, itemsPerPage) => {
  return {
    type: SET_PAGINATION,
    payload: {
      currentPage,
      itemsPerPage,
    },
  };
};

export const setSortOptions = (sortKey, sortOrder) => {
  return {
    type: SET_SORT_OPTIONS,
    payload: {
      sortKey,
      sortOrder,
    },
  };
};

export const setFilterOptions = (filterOptions) => {
  return {
    type: SET_FILTER_OPTIONS,
    payload: filterOptions,
  };
};

export const filterDogs = (dogs, temperamentFilter, sortOptions) => {
  return (dispatch) => {
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
  };
};
