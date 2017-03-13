/* eslint-disable react/forbid-prop-types */

import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from '../pages/App';
import MainPageContent from '../pages/MainPageContent';
import Rate from '../pages/Rate';
import AddItemContainer from '../pages/AddItemContainer';
import ListItemsContainer from '../pages/ListItemsContainer';
import Login from '../pages/Login';

// import bootstrap directly in index.html through CDN
// import 'bootstrap/dist/css/bootstrap.css';

const NotFound = () => <h1>404 error - This page is not found!</h1>;

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={MainPageContent} />
        <Route path="/rate" component={Rate} />
        <Route path="/search" component={AddItemContainer} />
        <Route path="/addItem" component={AddItemContainer} />
        <Route path="/login" component={Login} />
        <Route path="/listItems" component={() => (<ListItemsContainer URL="/api/items" />)} />
        <Route path="/generateThumbnails" component={() => (<ListItemsContainer URL="/util/regenerateAllThumbnails" socketName="regenerateAllThumbnails" />)} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;


/*
        <IndexRoute component={MainChoiceContainer} />


        <IndexRedirect to="/mainChoice" />
        <Route path="/mainChoice" component={MainChoiceContainer} />
*/