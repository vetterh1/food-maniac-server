import { combineReducers } from 'redux';
import coordinates from './coordinatesReducer';
import forms from './formsReducer';

const combinedReducer = combineReducers({
  coordinates,
  forms,
});

export default combinedReducer;