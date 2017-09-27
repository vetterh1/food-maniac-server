/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable jsx-a11y/img-has-alt */

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as log from 'loglevel';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import combinedReducer from './reducers/combinedReducer';
import { fetchKinds } from './actions/kindsActions';
import { fetchCategories } from './actions/categoriesActions';
import { fetchItems } from './actions/itemsActions';
import Root from './components/navigation/Root';
import { setupLanguages } from './actions/languageInfoActions';

require('es6-object-assign/auto');
require('./utils/array_find_polyfill');

log.setDefaultLevel('warn');
log.warn('Log default level: warn');


//
// --------------- Init Redux actions & reducers ---------------
//

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxMiddleware = applyMiddleware(thunk, createLogger());

const store = createStore(
  combinedReducer,
  composeEnhancers(reduxMiddleware));


//
// --------------- Init Redux store with Server data ---------------
//

store.dispatch(fetchKinds());
store.dispatch(fetchCategories());

// OPTIMIZE: this loads ALL the items
// Could be done only when necessary (ex: Rate page...)
// Or only the current user last ones
store.dispatch(fetchItems());


//
// ------------------------  i18n  -------------------------
//

function ensureIntlSupport() {
  if (window.Intl) return Promise.resolve();
  return new Promise((resolve) => {
    resolve(require('intl'));
  })
  .then(() => Promise.all([
    require('intl/locale-data/jsonp/en.js'),
  ]));
}

// TODO when adding a new language:
// - add an import above
// - add to languagesList array below

const languagesList =
  ['EN', 'FR'];

const languageBrowser =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

const languageBrowserWithoutRegionCode =
  languageBrowser.toUpperCase().split(/[_-]+/)[0];

const defaultLanguage =
  languagesList.indexOf(languageBrowserWithoutRegionCode) >= 0 ? languageBrowserWithoutRegionCode : 'EN';

addLocaleData([...en, ...fr]);
store.dispatch(setupLanguages(languagesList, defaultLanguage));


//
// --------------- MAIN RENDER ---------------
//

ensureIntlSupport().then(
  render(
    <Root store={store} />,
    document.getElementById('app')));