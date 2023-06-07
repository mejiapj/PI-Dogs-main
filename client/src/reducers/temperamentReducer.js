// Define los tipos de acciones
export const FETCH_TEMPERAMENTS_SUCCESS = 'FETCH_TEMPERAMENTS_SUCCESS';

// Define el estado inicial del reductor
const initialState = [];

// Define el reductor
const temperamentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TEMPERAMENTS_SUCCESS':
      return action.temperaments;

    default:
      return state;
  }
};

export default temperamentReducer;
