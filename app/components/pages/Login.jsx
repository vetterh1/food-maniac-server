/* eslint class-methods-use-this: ["error", { "exceptMethods": ["responseFacebook"] }] */

import React from 'react';
import FacebookLogin from '../utils/FacebookLogin';

class Login extends React.Component {

  responseFacebook(response) {
    console.log(response);
  }

/*
<FacebookLogin
socialId="327120524301121"
language="en_US"
scope="public_profile,email"
responseHandler={this.responseFacebook}
xfbml={true}
version="v2.5"
class="facebook-login"
buttonText="Login With Facebook"/>
*/

  render() {
    return (
      <div>
        <h1>Login</h1>
        <FacebookLogin
          socialId="327120524301121"
          language="en_US"
          responseHandler={this.responseFacebook}
          xfbml /* equivalent to xfbml={true} */
          version="v2.5"
          class="facebook-login"
          buttonText="Login With Facebook"
        />
      </div>
    );
  }
}

export default Login;
