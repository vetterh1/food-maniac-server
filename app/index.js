import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import App from './components/App'
import TestComponent from './components/TestComponent'
import TestClass from './components/TestClass'

const NotFound = () => <h1>404.. This page is not found!</h1>

render((
  <Router history={ hashHistory }>
    <Route component={ App }>
      <Route path="/testClass" component={ TestClass } />
      <Route path="/testComponent" component={ TestComponent } />
    </Route>
    <Route path='*' component={ NotFound } />
  </Router>
  ), document.getElementById('app'));


