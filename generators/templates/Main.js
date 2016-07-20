require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import skygear from 'skygear';


let skygearImage = require('../images/skygear.png');

class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      user: 'Not Logged in'
    };
  }

  doLogin() {
    let username = this.refs.username.value;
    let password = this.refs.password.value;

    skygear.loginWithUsername(username, password).then(() => {
      this.setState({
        'user': 'Logged in as '+username
      });
    }, () => {
      this.setState({
        'user': 'Login fails'
      });
    });
  }

  doSignup() {
    let username = this.refs.username.value;
    let password = this.refs.password.value;

    skygear.signupWithUsername(username, password).then(() => {
      this.setState({
        'user': 'Signup as '+username
      });
    }, () => {
      this.setState({
        'user': 'Signup fails'
      });
    });
  }

  doLogout() {
    skygear.logout().then(() => {
      this.setState({
        'user': 'Logged out'
      });
    });
  }

  render() {
    return (
      <div className="index">
        <img src={skygearImage} alt="Skygear Generator" />
        <div className="notice">
          <form
            method="POST"
            action="#"
            onSubmit={(e) => {
              e.preventDefault();
              this.doLogin();
            }}
          >
            <p>{this.state.user}</p>
            <p>
              <input
                type="username"
                ref="username"
                placeholder="Username"
              />&nbsp;
              <input
                type="password"
                ref="password"
                placeholder="Password"
              />
            </p>
            <p>
              <input
                type="submit"
                value="Login"
              />
              <span> or </span>
              <input
                type="submit"
                value="Signup"
                onSubmit={(e) => {
                  e.preventDefault();
                  this.doSignup();
                }}
              />
            </p>
          </form>
          <p><input
            type="submit"
            value="Logout"
            onClick={(e) => {
              e.preventDefault();
              this.doLogout();
            }}
          /></p>
        </div>
        <div className="notice">
          Please edit <code>src/components/Main.js</code> to get started!
        </div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
