/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */

import React from 'react';
import MainAppBar from '../navigation/MainAppBar';
import Version from '../utils/Version';
import injectTapEventPlugin from 'react-tap-event-plugin';

const styles = {
  pageContainer: {
    background: 'rgba(255,255,255,1) url("images/pasta_alpha30_qty50.jpg") no-repeat left top',
  },
};

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }

  render() {
    return (
      <div style={styles.pageContainer}>
        <MainAppBar />
        {this.props.children}
        <Version />
      </div>
    );
  }
}

export default App;

/*
    For transitions: enclose children in routeTransistion

     import { RouteTransition } from 'react-router-transition';
     <div style={styles.pageContainer}>
        <MainAppBar  />
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
*/