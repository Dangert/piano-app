import React from 'react';
import SignUser from '../SignUser/SignUser';
const Routes = require('../../modules/routes.js');

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInUsername: '',
      signInPassword: '',
      usernameExists: false
    }
  }

  onUsernameChange = async (event) => {
    const username = event.target.value;
    const exists = await this.usernameExists(username);
    this.setState({signInUsername: username, usernameExists: exists})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  onSubmitSignup = () => {
    const { signInUsername, signInPassword, usernameExists } = this.state;
    if (!signInUsername || !signInPassword || usernameExists) {
      return;
    }
    const { loadUser, onRouteChange } = this.props;
    fetch('https://guess-the-note-api.herokuapp.com/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword
      })
    })
    .then(response => response.json())
    .then(user => {
      if (user.id) {
        loadUser(user);
        onRouteChange(Routes.HOME);
      }
    })
    .catch(console.log)
  }

  usernameExists = async (username) => {
    if (!username) {
      return false;
    }
    const exists = await fetch('https://guess-the-note-api.herokuapp.com/users/exist/' + username, {
      method: 'GET'})
      .then(response => response.json())
      .then(data => {
        return (data.exists === 'true')
      })
      .catch(console.log);
    return exists;
  }

  render() {
    const { usernameExists } = this.state;
    return (
      <SignUser title='Sign Up' onSubmit={this.onSubmitSignup}
      onUsernameChange={this.onUsernameChange} onPasswordChange={this.onPasswordChange}
      error={usernameExists ? "username already exists": null} hasSignupBtn={false}/>
    )
  }
}

export default Signup;
