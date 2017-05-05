import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import coordinatesReducer from './coordinatesReducer';
import placesReducer from './placesReducer';
import kindsReducer from './kindsReducer';
import categoriesReducer from './categoriesReducer';
import itemsReducer from './itemsReducer';

const combinedReducer = combineReducers({
  coordinates: coordinatesReducer,
  places: placesReducer,
  kinds: kindsReducer,
  categories: categoriesReducer,
  items: itemsReducer,
  form: formReducer,
});

export default combinedReducer;