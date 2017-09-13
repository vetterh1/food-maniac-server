import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as log from 'loglevel';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import localeData from './locales/data.json';
import combinedReducer from './reducers/combinedReducer';
import { fetchKinds } from './actions/kindsActions';
import { fetchCategories } from './actions/categoriesActions';
import { fetchItems } from './actions/itemsActions';
import Root from './components/navigation/Root';

require('es6-object-assign/auto');
require('./utils/array_find_polyfill');

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


//
// -------------------  i18n  ---------------------
//

addLocaleData([...en, ...fr]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
                  navigator.language ||
                  navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;




render(
  <IntlProvider locale={language} messages={messages}>
    <Root store={store} />
  </IntlProvider>,
  document.getElementById('app'));