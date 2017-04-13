import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import coordinatesReducer from './coordinatesReducer';
import placesReducer from './placesReducer';

const combinedReducer = combineReducers({
  coordinates: coordinatesReducer,
  places: placesReducer,
  form: formReducer,
});

export default combinedReducer;