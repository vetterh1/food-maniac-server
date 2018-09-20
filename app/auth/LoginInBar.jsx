/* eslint-disable react/prefer-stateless-function */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["responseFacebook"] }] */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';
import Auth from './Auth';

class LoginInBar extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
  }

  onLogin() {
    this.props.auth.login();
  }

  onLogout() {
    this.props.auth.logout();
  }

  // TODO: add User info when logged in

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <NavItem>
        {!isAuthenticated() && (
          <a
            className="navbar-link"
            role="button"
            onClick={this.onLogin.bind(this)}
          >
            <FormattedMessage id="login.login_signin" />
          </a>
        )}
        {isAuthenticated() && (
          <a
            className="navbar-link"
            role="button"
            onClick={this.onLogout.bind(this)}
          >
            <FormattedMessage id="login.logout" />
          </a>
        )}
      </NavItem>
    );
  }
}

export default LoginInBar;

/*
      <NavItem>
        <LoginInBar auth={this.props.auth} />
      </NavItem>
language="en_US"
scope="public_profile,email"
responseHandler={this.responseFacebook}
xfbml={true}
version="v2.5"
class="facebook-login"
buttonText="Login With Facebook"/>
*/
