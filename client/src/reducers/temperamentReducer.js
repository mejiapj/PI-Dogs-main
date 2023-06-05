// Define los tipos de acciones
export const SET_TEMPERAMENT_FILTER = 'SET_TEMPERAMENT_FILTER';

// Define el estado inicial del reductor
const initialState = {
  temperamentFilter: '',
};

// Define el reductor
const temperamentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEMPERAMENT_FILTER:
      return {
        ...state,
        temperamentFilter: action.payload,
      };
    default:
      return state;
  }
};

export default temperamentReducer;
