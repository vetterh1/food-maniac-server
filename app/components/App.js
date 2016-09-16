import React from 'react';
import { Link } from 'react-router'
import NavLink from './NavLink'
import FontAwesome from 'react-fontawesome';
import Version from "./Version";

const _version = "0.12-1";


const App = (props) => <div>
		<h1>Food Maniac!</h1>
		<ul role="nav">
			<li><Link to="/"><FontAwesome name='home' />Home</Link></li>
			<li><NavLink to="/login"><FontAwesome name='user' />Login</NavLink></li>
			<li><NavLink to="/where"><FontAwesome name='location-arrow' />Location</NavLink></li>
		</ul>
		{ props.children }
	    <Version version={_version}/>
	</div>;

export default App;
