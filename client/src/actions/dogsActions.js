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
      // console.log(data);
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

export const setPagination = (pagination) => {
  return {
    type: SET_PAGINATION,
    payload: pagination,
  };
};

export const setSortOptions = (sortOptions) => {
  return {
    type: SET_SORT_OPTIONS,
    payload: sortOptions,
  };
};

export const setFilterOptions = (filterOptions) => {
  return {
    type: SET_FILTER_OPTIONS,
    payload: filterOptions,
  };
};

export const filterDogs = (dogs, temperament, source) => {
  return (dispatch) => {
    let filteredDogs = dogs;

    if (temperament) {
      filteredDogs = filteredDogs.filter((dog) =>
        dog.temperament?.includes(temperament)
      );
    }

    if (source) {
      filteredDogs = filteredDogs.filter((dog) =>
        dog.source?.toLowerCase().includes(source.toLowerCase())
      );
    }

    dispatch(setFilteredDogs(filteredDogs));
  };
};
