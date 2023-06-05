// Importa los tipos de acciones necesarios
import {
  FETCH_DOGS_SUCCESS,
  SET_FILTERED_DOGS,
  SET_PAGINATION,
  SET_SORT_OPTIONS,
  SET_FILTER_OPTIONS,
} from '../reducers/dogReducer';

// Acción para obtener la lista de perros
export const fetchDogs = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('http://localhost:3001/dogs');
      const data = await response.json();

      // Despacha la acción con los datos obtenidos
      dispatch({
        type: FETCH_DOGS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };
};

// Acción para establecer los perros filtrados
export const setFilteredDogs = (dogs) => {
  return {
    type: SET_FILTERED_DOGS,
    payload: dogs,
  };
};

// Acción para establecer la paginación
export const setPagination = (pagination) => {
  return {
    type: SET_PAGINATION,
    payload: pagination,
  };
};

// Acción para establecer las opciones de ordenamiento
export const setSortOptions = (sortOptions) => {
  return {
    type: SET_SORT_OPTIONS,
    payload: sortOptions,
  };
};

// Acción para establecer las opciones de filtro
export const setFilterOptions = (filterOptions) => {
  return {
    type: SET_FILTER_OPTIONS,
    payload: filterOptions,
  };
};
