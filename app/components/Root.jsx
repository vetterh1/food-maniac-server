import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';

import TestComponent from './TestComponent';
import TestClass from './TestClass';

import Login from './Login';
import ChooseLocation from './ChooseLocation';

const NotFound = () => <h1>404 error - This page is not found!</h1>;

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/where" component={ChooseLocation} />
        <Route path="/login" component={Login} />
        <Route path="/testClass" component={TestClass} />
        <Route path="/testComponent" component={TestComponent} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;