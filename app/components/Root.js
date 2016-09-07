import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';

import TestComponent from './TestComponent'
import TestClass from './TestClass'

const NotFound = () => <h1>404 error - This page is not found!</h1>

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
		<Route path="/(:filter)" component={App}>
			<Route path="/testClass" component={ TestClass } />
			<Route path="/testComponent" component={ TestComponent } />
			<Route path='*' component={ NotFound } />
		</Route>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;