import React from 'react';
import { render } from 'react-dom';
import Root from './components/navigation/Root';
import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import combinedReducer from './reducers/combinedReducer';
import thunk from 'redux-thunk';

import 'bootstrap/dist/css/bootstrap.css';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxMiddleware = applyMiddleware(thunk, createLogger());

const store = createStore(
  combinedReducer,
  composeEnhancers(
    reduxMiddleware));

render(
  <Root store={store} />,
  document.getElementById('app'));