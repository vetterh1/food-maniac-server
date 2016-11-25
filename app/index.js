import React from 'react'
import { render } from 'react-dom'
import Root from './components/Root.jsx'

import { createStore } from 'redux'
import mainStore from './reducers/mainStore'
let store = createStore(mainStore);

render(
	<Root store = {store} />, 
	document.getElementById('app'));