import React, { Component, MouseEvent } from 'react'
import { BaseProps } from '../models/BaseProps';
import { BaseState } from '../models/BaseState';
import { Segment, Grid, Header, Icon, MenuItemProps, Menu } from 'semantic-ui-react';
import { Router, Route, Switch } from 'react-router-dom';
import ChatsView from './ChatsView';
import { ChatView } from './ChatView';
import ContactsView from './ContactsView';
import RegistrationView from './RegistrationView';
import Login from './Login';

interface MainProps extends BaseProps {
}

interface MainState extends BaseState {
    activeItem: any,
    chat: boolean,
    contacts: boolean
}

const scrollSectionOverride = {
    borderRadius: "10px",
    height: "33em",
    overflowY: "scroll",
    padding: "1rem"
}

export class Main extends Component<MainProps, MainState> {

    state = {
        activeItem: 'chats',
        chat: false,
        contacts: false

    }

    constructor(props: MainProps) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleItemClick = (e: MouseEvent, data: MenuItemProps) => {
        this.setState({ ...this.state, activeItem: data.name })
        this.props.history.replace("/" + data.name)
    }

    handleLogin() {
        this.props.auth.login()
    }

    handleLogout() {
        this.props.auth.logout()
    }

    handleRegistrationSuccess = () => {
        this.setState({ ...this.state, chat: true, contacts: true })
        this.props.history.replace("/chats")
    }

    render() {
        return (<Segment vertical>
                    <Grid container stackable>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <Header size="huge" textAlign="center"><Icon name="handshake outline" /></Header>
                                <Header size="large" textAlign="center">Nirop Chat App</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <Grid>
                                    <Grid.Row columns={2}>
                                        <Router history={this.props.history}>
                                            <Grid.Column width={2}>
                                                {this.generateMenu()}
                                            </Grid.Column>
                                            <Grid.Column style={scrollSectionOverride} width={12}>
                                                {this.generateCurrentPage()}
                                            </Grid.Column>
                                        </Router>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>)
    }

    generateMenu() {
        const { activeItem } = this.state
        return (<Menu text vertical>
            {this.props.auth.isRegistered() ? <Menu.Item header>{this.props.auth.user.displayName}</Menu.Item> : ""}
            <Menu.Item name="chats" active={activeItem === 'chats'} onClick={this.handleItemClick} disabled={!this.state.chat}/>
            <Menu.Item name="contacts" active={activeItem === 'contacts'} onClick={this.handleItemClick} disabled={!this.state.contacts}/>
            {this.props.auth.isAuthenticated() ?
                (<Menu.Item name="logout" onClick={this.handleLogout}>Log Out</Menu.Item>)
                : (<Menu.Item name="login" onClick={this.handleLogin}>Log In</Menu.Item>)}
        </Menu>)
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
                        return (<RegistrationView {...props} handleRegistrationSuccess={this.handleRegistrationSuccess} auth={this.props.auth} history={this.props.history} />);
                    }}
                />

            </Switch>
        )
    }
}

export default Main
