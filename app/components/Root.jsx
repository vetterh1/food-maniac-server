import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App';
import MainChoiceContainer from './MainChoiceContainer';
import Rate from './Rate';

import TestComponent from './TestComponent';
import TestClass from './TestClass';

import Login from './Login';
import ChooseLocation from './TestChooseLocation';

const NotFound = () => <h1>404 error - This page is not found!</h1>;

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={MainChoiceContainer} />
        <Route path="/rate" component={Rate} />
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


/*
        <IndexRedirect to="/mainChoice" />
        <Route path="/mainChoice" component={MainChoiceContainer} />
*/