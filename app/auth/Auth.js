/* eslint-disable class-methods-use-this */

import * as log from 'loglevel';
import { browserHistory } from 'react-router';
import auth0 from 'auth0-js';
import { loglevelServerSend } from '../utils/loglevel-serverSend';
import stringifyOnce from '../utils/stringifyOnce';


const logAuth = log.getLogger('logAuth');
loglevelServerSend(logAuth); // a setLevel() MUST be run AFTER this!
logAuth.setLevel('debug');
logAuth.debug('--> entering Auth.jsx');


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
    this.auth0.authorize();
  }


  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('handleAuthentication() 1');
        console.log(stringifyOnce(authResult, null, 2));
        logAuth.log(stringifyOnce(authResult, null, 2));
        this.setSession(authResult);
        browserHistory.replace('/');
      } else if (err) {
        browserHistory.replace('/');
        logAuth.error(`Error: ${err.error}. Check the console for further details.`);
        alert(`Error: ${err.error}. Check the console for further details.`);
        // TODO: better error message to user than alert!
      } else {
        console.log('handleAuthentication() 2');
        console.log(stringifyOnce(authResult, null, 2));
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
    browserHistory.replace('/');
  }



  isAuthenticated() {
    // Check whether the current time is past the access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}