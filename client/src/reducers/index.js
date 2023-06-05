// Importa los reductores necesarios
import dogReducer from './dogReducer';
import temperamentReducer from './temperamentReducer';

// Combina los reductores en un solo reductor raíz
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  dogs: dogReducer,
  temperament: temperamentReducer,
});

export default rootReducer;
