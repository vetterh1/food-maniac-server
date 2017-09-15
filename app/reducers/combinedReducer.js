import { combineReducers } from 'redux';
import languageInfoReducer from './languageInfoReducer';
import coordinatesReducer from './coordinatesReducer';
import placesReducer from './placesReducer';
import kindsReducer from './kindsReducer';
import categoriesReducer from './categoriesReducer';
import itemsReducer from './itemsReducer';

const combinedReducer = combineReducers({
  languageInfo: languageInfoReducer,
  coordinates: coordinatesReducer,
  places: placesReducer,
  kinds: kindsReducer,
  categories: categoriesReducer,
  items: itemsReducer,
});

export default combinedReducer;