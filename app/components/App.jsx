/* eslint-disable react/prefer-stateless-function */

const _version = '2017-01-18 16:00 - add_new_item';

import React from 'react';
import MainAppBar from './MainAppBar';
import Version from './Version';
import Radium, { StyleRoot } from 'radium';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { red500 } from 'material-ui/styles/colors';

const styles = {
  pageContainer: {
    fontSize: '2em',
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: red500,
  },
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


@Radium
class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }

  getChildContext() {
    return {
      muiTheme: this.muiTheme,
    };
  }

  render() {
    return (
      <StyleRoot>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.pageContainer}>
            <MainAppBar />
            { this.props.children }
            <Version version={_version} />
          </div>
        </MuiThemeProvider>
      </StyleRoot>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object,
};


export default App;









/*
import { Link } from 'react-router';
import NavLink from './NavLink';
import IconHome from 'material-ui/svg-icons/action/home'; // Icons list: https://material.io/icons/
import IconLocation from 'material-ui/svg-icons/communication/location-on';
import IconLogin from 'material-ui/svg-icons/action/account-circle';
import FormsyTest1 from './FormsyTest1';
import MaterialUiTest from './MaterialUiTest';


// import FormItem from './FormItem';
// import * as actionsItem from '../actions/FormActions';
// import { connect } from 'react-redux';
// const SmartFormItem = connect(state => state, actionsItem)(FormItem);
//      <SmartFormItem {...props} />

    [c.BREAKPOINT_SMALL]: {
      fontSize: '20px',
    },
    [c.BREAKPOINT_LARGE]: {
      fontSize: '90px',
    },

body {
    background-color: lightblue;
}

@media (min-width: 480px) {
    body {
        background-color: lightgreen;
    }
}


const navStyle = {
  listStyle: 'none',
};

const navItemStyle = {
  marginLeft: '30px !important',
};

const marginRight = {
  marginRight: '10px !important',
};


            <MaterialUiTest />
            <FormsyTest1 />

            <ul role="navigation" style={navStyle}>
              <li style={navItemStyle}><Link to="/"><IconHome style={styles.menuIconStyles} />Home</Link></li>
              <li style={navItemStyle}><NavLink to="/login"><IconLogin style={styles.menuIconStyles} />Login</NavLink></li>
              <li style={navItemStyle}><NavLink to="/where"><IconLocation style={styles.menuIconStyles} />Location</NavLink></li>
            </ul>

*/