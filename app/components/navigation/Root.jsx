/* eslint-disable react/forbid-prop-types */

import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from '../pages/App';
import MainChoiceContainer from './MainChoiceContainer';
import Rate from '../pages/Rate';
import AddItem from '../pages/AddItem';
import Login from '../pages/Login';

const NotFound = () => <h1>404 error - This page is not found!</h1>;

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={MainChoiceContainer} />
        <Route path="/rate" component={Rate} />
        <Route path="/search" component={AddItem} />
        <Route path="/addItem" component={AddItem} />
        <Route path="/login" component={Login} />
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
        <IndexRedirect to="/mainChoice" />
        <Route path="/mainChoice" component={MainChoiceContainer} />
*/