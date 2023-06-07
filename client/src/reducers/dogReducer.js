// Define los tipos de acciones
export const FETCH_DOGS_SUCCESS = 'FETCH_DOGS_SUCCESS';
export const SET_FILTERED_DOGS = 'SET_FILTERED_DOGS';
export const SET_PAGINATION = 'SET_PAGINATION';
export const SET_SORT_OPTIONS = 'SET_SORT_OPTIONS';
export const SET_FILTER_OPTIONS = 'SET_FILTER_OPTIONS';

// Define el estado inicial del reductor
const initialState = {
  dogs: [],
  filteredDogs: [],
  pagination: {
    currentPage: 1,
    dogsPerPage: 8,
  },
  sortOptions: '',
  filterOptions: {
    temperaments: '',
    source: '',
  },
};

// Define el reductor
const dogReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOGS_SUCCESS:
      return {
        ...state,
        dogs: action.payload,
      };
    case SET_FILTERED_DOGS:
      return {
        ...state,
        filteredDogs: action.payload,
      };
    case SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    case SET_SORT_OPTIONS:
      return {
        ...state,
        sortOptions: action.payload,
      };
    case SET_FILTER_OPTIONS:
      return {
        ...state,
        filterOptions: action.payload,
      };
    default:
      return state;
  }
};

export default dogReducer;
