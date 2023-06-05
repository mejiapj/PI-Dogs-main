// Importa los tipos de acciones necesarios
import { SET_TEMPERAMENT_FILTER } from '../reducers/temperamentReducer';

// Acción para establecer el filtro de temperamento
export const setTemperamentFilter = (temperament) => {
  return {
    type: SET_TEMPERAMENT_FILTER,
    payload: temperament,
  };
};
