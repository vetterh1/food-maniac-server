import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import coordinates from './coordinatesReducer';
// import forms from './formsReducer';

const combinedReducer = combineReducers({
  coordinates,
  // forms,
  form: formReducer,
});

export default combinedReducer;