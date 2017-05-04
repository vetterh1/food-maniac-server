import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import coordinatesReducer from './coordinatesReducer';
import placesReducer from './placesReducer';
import kindsReducer from './kindsReducer';

const combinedReducer = combineReducers({
  coordinates: coordinatesReducer,
  places: placesReducer,
  kinds: kindsReducer,
  form: formReducer,
});

export default combinedReducer;