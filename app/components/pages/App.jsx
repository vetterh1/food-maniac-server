/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */

import React from 'react';
import MainAppBar from '../navigation/MainAppBar';
import Version from '../utils/Version';
// import Radium, { StyleRoot } from 'radium';
import injectTapEventPlugin from 'react-tap-event-plugin';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { RouteTransition } from 'react-router-transition';

const styles = {
  pageContainer: {
    fontSize: '1.5em',
  },
};

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


// @Radium
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
      <div>
        <div style={styles.pageContainer}>
          <MainAppBar />
          <RouteTransition
            pathname={this.props.location.pathname}
            atEnter={{ translateX: 100 }}
            atLeave={{ translateX: -100 }}
            atActive={{ translateX: 0 }}
            mapStyles={style => ({ transform: `translateX(${style.translateX}%)` })}
          >
            {this.props.children}
          </RouteTransition>
          <Version />
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object,
};


export default App;


              // transitionAppear={true}
              // transitionAppearTimeout={500}
