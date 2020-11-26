import React from 'react';
import SignUser from '../SignUser/SignUser';
const Routes = require('../../modules/routes.js');

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.tryAgainError = 'Please try again';
    this.credentialsError = 'Incorrect username or password';
    this.state = {
      signInUsername: '',
      signInPassword: '',
      error: ''
    }
  }

  onUsernameChange = (event) => {
    this.setState({signInUsername: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  onSubmitSignin = () => {
    const { signInUsername, signInPassword } = this.state;
    const { loadUser, onRouteChange } = this.props;
    if (!signInUsername || !signInPassword) {
      return;
    }
    fetch('https://guess-the-note-api.herokuapp.com/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword
      })
    })
      .then(response => response.json())
      .then(user => {
        if (user === 'credentials error') {
          this.setState({error: this.credentialsError})
        }
        else if (user === 'fetch error') {
          this.setState({error: this.tryAgainError})
        }
        else if (user.id) {
          this.setState({error: ''})
          loadUser(user);
          onRouteChange(Routes.HOME);
        }
      })
      .catch(console.log)
  }

  render() {
    const { onRouteChange } = this.props;
    const { error } = this.state;
    return (
      <SignUser title='Sign In' onUsernameChange={this.onUsernameChange}
      onPasswordChange={this.onPasswordChange} onSubmit={this.onSubmitSignin}
      error={error} hasSignupBtn={true} onSignup={() => onRouteChange(Routes.SIGN_UP)}/>
    )
  }
}


export default Signin;
