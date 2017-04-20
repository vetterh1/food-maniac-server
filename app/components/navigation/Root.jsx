/* eslint-disable react/forbid-prop-types */

import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import App from '../pages/App';
import MainPageContent from '../pages/MainPageContent';
import RateContainer from '../pages/RateContainer';
import AddItemContainer from '../pages/AddItemContainer';
import SearchItemContainer from '../pages/SearchItemContainer';
import ListItemsContainer from '../pages/ListItemsContainer';
import Login from '../pages/Login';

const NotFound = () => <h2>404 error - This page is not found!</h2>;

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={MainPageContent} />
        <Route path="/rate" component={RateContainer} />
        <Route path="/searchItem" component={SearchItemContainer} />
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