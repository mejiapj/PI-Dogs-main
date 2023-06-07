// src/actions/temperamentActions.js

export const FETCH_TEMPERAMENTS_SUCCESS = 'FETCH_TEMPERAMENTS_SUCCESS';
export const SET_TEMPERAMENT_FILTER = 'SET_TEMPERAMENT_FILTER';

export const fetchTemperamentsSuccess = (temperaments) => {
  return {
    type: FETCH_TEMPERAMENTS_SUCCESS,
    temperaments: temperaments,
  };
};

export const fetchTemperaments = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('http://localhost:3001/temperaments');
      const temperaments = await response.json();
      dispatch(fetchTemperamentsSuccess(temperaments));
    } catch (error) {
      console.error('Error temperaments:', error);
    }
  };
};

export const setTemperamentFilter = (temperament) => {
  return {
    type: SET_TEMPERAMENT_FILTER,
    payload: temperament,
  };
};
