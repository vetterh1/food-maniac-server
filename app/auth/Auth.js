/* eslint-disable class-methods-use-this */

import { browserHistory } from 'react-router';
import auth0 from 'auth0-js';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'foodmaniac.eu.auth0.com',
    clientID: 'lzKyAuN9mtO6q0ItFPow7wHBQsqqaj3B',
    redirectUri: `${process.env.HOST}/callback`,
    audience: 'https://foodmaniac.eu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid',
  });



  login() {
    console.log('Auth.login()');
    this.auth0.authorize();
  }


  handleAuthentication() {
    console.log('{ Auth.handleAuthentication()');
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        console.log('} Auth.handleAuthentication() --> OK');
        browserHistory.replace('/');
      } else if (err) {
        browserHistory.replace('/');
        console.log(err);
        console.log('} Auth.handleAuthentication() --> KO');
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    browserHistory.replace('/');
  }



  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    browserHistory.replace('/rate');
  }



  isAuthenticated() {
    // Check whether the current time is past the access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}