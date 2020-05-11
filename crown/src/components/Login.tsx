import * as React from 'react'
import Auth from '../auth/Auth'

interface LoginProps {
  auth: Auth
}

interface LoginState {}

export default class Login extends React.PureComponent<LoginProps, LoginState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>Please log in</h1>
      </div>
    )
  }
}