/* eslint-disable react/prefer-stateless-function */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["responseFacebook"] }] */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
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
          <NavLink
            className="navbar-link"
            role="button"
            tag={Link}
            onClick={this.onLogin.bind(this)}
          >
            <FormattedMessage id="login.login_signin" />
          </NavLink>
        )}
        {isAuthenticated() && (
          <NavLink
            className="navbar-link"
            role="button"
            tag={Link}
            onClick={this.onLogout.bind(this)}
          >
            <FormattedMessage id="login.logout" />
          </NavLink>
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
