import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'
import TestComponent from './TestComponent'
import TestClass from './TestClass'

const NotFound = () => <h1>404 error - This page is not found!</h1>

module.exports = (
	<Route path="/" component={ App }>
	  <Route path="/testClass" component={ TestClass } />
	  <Route path="/testComponent" component={ TestComponent } />
	  <Route path='*' component={ NotFound } />
	</Route>
);