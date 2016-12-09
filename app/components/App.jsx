const _version = '0.2.3';


import Radium, { StyleRoot } from 'radium';

import React from 'react';
import { Link } from 'react-router';
import NavLink from './NavLink';
import MainAppBar from './MainAppBar';
import MainChoiceContainer from './MainChoiceContainer';


import IconHome from 'material-ui/svg-icons/action/home'; // Icons list: https://material.io/icons/
import IconLocation from 'material-ui/svg-icons/communication/location-on';
import IconLogin from 'material-ui/svg-icons/action/account-circle';

import Version from './Version';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MaterialUiTest from './MaterialUiTest';
import { blue500, red500, greenA200 } from 'material-ui/styles/colors';
import FormsyTest1 from './FormsyTest1';


// import FormItem from './FormItem';
// import * as actionsItem from '../actions/FormActions';
// import { connect } from 'react-redux';
// const SmartFormItem = connect(state => state, actionsItem)(FormItem);
//      <SmartFormItem {...props} />

/*
    [c.BREAKPOINT_SMALL]: {
      fontSize: '20px',
    },
    [c.BREAKPOINT_LARGE]: {
      fontSize: '90px',
    },
*/
/*
body {
    background-color: lightblue;
}

@media (min-width: 480px) {
    body {
        background-color: lightgreen;
    }
}*/


const styles = {
  pageContainer: {
    fontSize: '2em',
  },

  mainChoiceContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    listStyle: 'none',
    fontWeight: '700',
    fontSize: '4rem',
    lineHeight: '1.2',
    backgroundColor: 'lightblue',
    '@media only screen and (max-width: 680px)': {
      backgroundColor: 'lightgreen',
      fontSize: '2.6em',
    },
  },
  mainChoiceItem: {
    background: 'tomato',
  },


  bigIconStyles: {
    width: 200,
    height: 200,
  },
  conStyles: {
    width: 16,
    height: 16,
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


const navStyle = {
  listStyle: 'none',
};

const navItemStyle = {
  marginLeft: '30px !important',
};

const marginRight = {
  marginRight: '10px !important',
};


@Radium
class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }

  render() {
    return (
      <StyleRoot>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={styles.pageContainer}>
            <MainAppBar />
            <MainChoiceContainer />

            <ul role="navigation" style={navStyle}>
              <li style={navItemStyle}><Link to="/"><IconHome style={styles.menuIconStyles} />Home</Link></li>
              <li style={navItemStyle}><NavLink to="/login"><IconLogin style={styles.menuIconStyles} />Login</NavLink></li>
              <li style={navItemStyle}><NavLink to="/where"><IconLocation style={styles.menuIconStyles} />Location</NavLink></li>
            </ul>

            { this.props.children }
            <Version version={_version} />
            <MaterialUiTest />
            <FormsyTest1 />
          </div>
        </MuiThemeProvider>
      </StyleRoot>
    );
  }
}
export default App;
