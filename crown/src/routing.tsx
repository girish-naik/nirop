import React from 'react'
import Auth from './auth/Auth'
import { Router, Route } from 'react-router-dom'
import Callback from './components/Callback'
import * as History from 'history'
import App from './App';
const history = History.createBrowserHistory();

const auth = new Auth(history)

const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  } else {
    history.replace("loginfail")
  }
  console.log("Callback completed")
}

export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <div>
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props)
            return <Callback />
          }}
        />
        <Route
          path="/"
          render={props => {
            return <App auth={auth} {...props} />
          }}
        />
      </div>
    </Router>
  )
}
