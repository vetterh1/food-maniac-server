/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */

const _version = '2017-01-20 16:00 - add_new_item';

import React from 'react';
import MainAppBar from './MainAppBar';
import Version from './Version';
import Radium, { StyleRoot } from 'radium';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { red500 } from 'material-ui/styles/colors';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { RouteTransition } from 'react-router-transition';

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
            <RouteTransition
              pathname={this.props.location.pathname}
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
            >
              {this.props.children}
            </RouteTransition>
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


              // transitionAppear={true}
              // transitionAppearTimeout={500}
