import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom'
import './App.css';
import { Segment, Grid, Header, Icon } from 'semantic-ui-react';
import PrivateMenu from './components/PrivateMenu';
import PublicMenu from './components/PublicMenu';
import ChatsView from './components/ChatsView';
import { BaseProps } from './models/BaseProps';
import { ChatView } from './components/ChatView';
import ContactsView from './components/ContactsView';
import RegistrationView from './components/RegistrationView';
import Login from './components/Login';

export interface AppProps { }

export interface AppProps extends BaseProps {
}

export interface AppState { }

const scrollSectionOverride = {
  borderRadius : "10px",
  height : "33em",
  overflowY: "scroll"
}

export default class App extends Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Header size="huge" textAlign="center"><Icon name="handshake outline" /></Header>
                <Header size="large" textAlign="center">Nirop Chat App</Header>
                <Router history={this.props.history}>
                    <Segment vertical>
                      {this.generateMenu()}
                    </Segment>
                    <Segment style={scrollSectionOverride}>
                      {this.generateCurrentPage()}
                    </Segment>
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  /*generateMenu() {
    if (this.props.auth.isAuthenticated() && this.props.auth.isRegistered()) {
      return (
        <PrivateMenu auth={this.props.auth}/>
      )
    } else {
      return (
        <PublicMenu auth={this.props.auth}/>
      )
    }
  }*/

  generateMenu() {
    return (
      <Switch>
        {(this.props.auth.isAuthenticated() && this.props.auth.isRegistered()) &&
          <Route
            path="*"
            render={props => {
              return (<PrivateMenu auth={this.props.auth} />);
            }}
          />}
        {!(this.props.auth.isAuthenticated() && this.props.auth.isRegistered()) &&
          <Route
            path="*"
            render={props => {
              return (<PublicMenu auth={this.props.auth} />);
            }}
          />}
      </Switch>
    )
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <Login auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/chats"
          exact
          render={props => {
            return (<ChatsView {...props} auth={this.props.auth} history={this.props.history} />);
          }}
        />
        <Route
          path="/chat/:chatId/open"
          exact
          render={props => {
            return (<ChatView {...props} auth={this.props.auth} history={this.props.history} />);
          }}
        />
        <Route
          path="/contacts"
          exact
          render={props => {
            return (<ContactsView {...props} auth={this.props.auth} history={this.props.history} />);
          }}
        />
        <Route
          path="/registration"
          exact
          render={props => {
            return (<RegistrationView {...props} auth={this.props.auth} history={this.props.history} />);
          }}
        />

      </Switch>
    )
  }
}
