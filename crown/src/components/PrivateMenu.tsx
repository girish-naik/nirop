import React, { Component, MouseEvent } from 'react'
import { Menu, Icon, MenuItemProps } from 'semantic-ui-react'
import { BaseState } from '../models/BaseState'
import { BaseProps } from '../models/BaseProps'
import { Link } from 'react-router-dom'

export default class PrivateMenu extends Component<BaseProps, BaseState> {
    state = { activeItem: 'chats' }
    handleLogout = () => {
        this.props.auth.logout()
    }

    handleItemClick = (e: MouseEvent, { name }: MenuItemProps) => {
        this.setState({ activeItem: name })
    }
    render() {
        const { activeItem } = this.state
        return (
            <div>
                <Menu pointing>
                    <Menu.Item name="chats" active={activeItem === 'chats'} onClick={this.handleItemClick}>
                        <Link to="/chats">Chats <Icon name="paper plane outline" /></Link>
                    </Menu.Item>
                    <Menu.Item name="contacts" active={activeItem === 'contacts'} onClick={this.handleItemClick}>
                        <Link to="/contacts">Contacts <Icon name="users" /></Link>
                    </Menu.Item>
                    <Menu.Menu position="right">{this.props.auth.user.displayName} <Menu.Item name="logout" onClick={this.handleLogout}>Log Out</Menu.Item></Menu.Menu>
                </Menu>
            </div>
        )
    }
}