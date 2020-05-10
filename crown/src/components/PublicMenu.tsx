import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { BaseProps } from '../models/BaseProps';
import { BaseState } from '../models/BaseState';

export default class PublicMenu extends Component<BaseProps, BaseState> {
  
  handleLogin = () => {
    this.props.auth.login();
  }

  handleLogout = () => {
    this.props.auth.logout();
  }

  render() {
    return (
        <div>
            <Menu pointing>
                <Menu.Item name="chats"><Icon disabled name="paper plane outline"/> Chats</Menu.Item>
                <Menu.Item name="contacts"><Icon disabled name="users"/> Contacts</Menu.Item>
                <Menu.Menu position="right">{
                  this.props.auth.isAuthenticated() ? 
                  (<Menu.Item name="logout" onClick={this.handleLogout}>Log Out</Menu.Item>)
                  :(<Menu.Item name="login" onClick={this.handleLogin}>Log In</Menu.Item>)
                }
                </Menu.Menu>
            </Menu>
        </div>
      )
  }
}