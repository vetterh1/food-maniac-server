import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as log from 'loglevel';
import combinedReducer from './reducers/combinedReducer';
import { fetchKinds } from './actions/kindsActions';
import { fetchCategories } from './actions/categoriesActions';
import { fetchItems } from './actions/itemsActions';
import Root from './components/navigation/Root';


log.setDefaultLevel('warn');
log.warn('Log default level: warn');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxMiddleware = applyMiddleware(thunk, createLogger());

const store = createStore(
  combinedReducer,
  composeEnhancers(
    reduxMiddleware));

store.dispatch(fetchKinds());
store.dispatch(fetchCategories());

// TODO: remove this as it loads ALL the items
// Should be done only when necessary (ex: Rate page...)
store.dispatch(fetchItems());

render(
  <Root store={store} />,
  document.getElementById('app'));