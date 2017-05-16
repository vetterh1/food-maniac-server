import { combineReducers } from 'redux';
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
});

export default combinedReducer;