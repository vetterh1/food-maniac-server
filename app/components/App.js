import React from 'react';
import { Link } from 'react-router'
import NavLink from './NavLink'
import FontAwesome from 'react-fontawesome';  // https://github.com/danawoodman/react-fontawesome
import Version from "./Version";

import injectTapEventPlugin from 'react-tap-event-plugin';
import MaterialUiTest from './MaterialUiTest'; // Our custom react component

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const _version = "0.13.4";

var navStyle = {
	listStyleType: 'none',
	display: 'flex',
	listStyle: 'none'
};

var navItemStyle = {
	marginLeft: "30px !important"
};

var marginRight = {
	marginRight: "10px !important"
};

const App = (props) => <div>
		<h1>Food Maniac!</h1>
		<ul role="nav" style={navStyle}>
			<li style={navItemStyle}><Link to="/"><FontAwesome name='home' style={marginRight} />Home</Link></li>
			<li style={navItemStyle}><NavLink to="/login"><FontAwesome name='user'  style={marginRight}/>Login</NavLink></li>
			<li style={navItemStyle}><NavLink to="/where"><FontAwesome name='location-arrow'  style={marginRight}/>Location</NavLink></li>
		</ul>
		{ props.children }
		<Version version={_version}/>
		<MaterialUiTest />
	</div>;

export default App;
