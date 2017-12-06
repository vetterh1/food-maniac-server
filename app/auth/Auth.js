import auth0 from 'auth0-js';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'foodmaniac.eu.auth0.com',
    clientID: 'lzKyAuN9mtO6q0ItFPow7wHBQsqqaj3B',
    redirectUri: process.env.HOST,
    audience: 'https://foodmaniac.eu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid',
  });

  login() {
    this.auth0.authorize();
  }
}