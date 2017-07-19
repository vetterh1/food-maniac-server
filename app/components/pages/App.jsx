/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import MainAppBar from '../navigation/MainAppBar';
import Footer from '../utils/Footer';
import AlertSimulateMode from '../utils/AlertSimulateMode';


const styles = {
  pageContainer: {
    // background: 'url("images/pasta_alpha30_qty50.jpg") no-repeat center center fixed',
    // backgroundSize: 'cover',
  },
};

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div style={styles.pageContainer}>
        <MainAppBar location={this.props.location} router={this.props.router} route={this.props.route} />
        <AlertSimulateMode />
        {this.props.children}
        <Footer />
        <Alert stack={{ limit: 3, spacing: 8 }} position="bottom" timeout={5000} effect="stackslide" />
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
        <Footer />
    </div>
*/