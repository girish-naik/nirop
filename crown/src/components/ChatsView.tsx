import React, { Component } from 'react'
import { BaseProps } from "../models/BaseProps";
import { BaseState } from "../models/BaseState";
import { ChatView } from "../models/ChatView";
import { Segment, Grid, Placeholder, Card, Image, Header, Icon } from "semantic-ui-react";
import { getDisplayNameAvatar } from '../utils/UserUtil'
import { getChats } from '../api/keel/ChatApi';
import { ContactList } from '../api/bill/models/ContactList';
import { getContactList } from '../api/bill/ContactsApi';
import { User } from '../api/bill/models/User';
import convertToDisplayDateTime from '../utils/DateTimeUtils';
import { LastChat } from '../models/LastChat';

const gridConfig = {
    rows: 3,
    columns: 4
}

export interface ChatsViewState extends BaseState {
    chats?: ChatView[],
    lastChat?: LastChat
}

function getCardDescriptionStyle() {
    return { textOverflow: "elipses", overflow: "hidden", whiteSpace: "nowrap" }
}

export default class ChatsView extends Component<BaseProps, ChatsViewState> {

    state: ChatsViewState = {
    }

    componentDidMount = async () => {
        const idToken = this.props.auth.getIdToken()
        const chats = await getChats(idToken, undefined);
        if (chats && chats.chats) {
            const contacts: ContactList = await getContactList(idToken);
            if (contacts && contacts.users) {
                const mappedContacts: { [key: string]: User } = contacts.users.reduce(function (map: { [key: string]: User }, obj: User) {
                    map[obj.id] = obj;
                    return map;
                }, {});
                const chatsView: ChatView[] = chats.chats.filter(c => {
                    if (!c.participants) {
                        return false;
                    } else {
                        const filteredCount = (c.participants.filter((p) => {
                            return Object.keys(mappedContacts).indexOf(p) >= 0;
                        })).length;
                        return c.participants.length === filteredCount;
                    }
                }).map((chat) => {
                    return {
                        id: chat.cId,
                        uIds: chat.participants,
                        displayNames: chat.participants.map((p) => mappedContacts[p].displayName),
                        lastMessage: "",
                        lastUpdated: convertToDisplayDateTime(chat.uDate)
                    }
                })
                if (chatsView && chatsView.length > 0) {
                    this.setState({ chats: chatsView })
                } else {
                    this.setState({ chats: [] })
                }
            } else {
                this.setState({ chats: [] })
            }
        } else {
            this.setState({ chats: [] })
        }
    }

    render() {
        if (!this.state.chats) {
            return this.renderPlaceHolders();
        } else {
            return this.renderChats();
        }
    }

    openChat = (e: React.MouseEvent, cId: string, history: any) => {
        e.preventDefault()
        this.props.history.replace("/chat/" + cId + "/open")
    }

    renderChats = () => {
        if (this.state.chats && this.state.chats.length > 0) {
            return (<Card.Group doubling itemsPerRow={4} stackable>{this.state.chats.map((chat) => {
                return (<Card key={chat.id} onClick={(event) => this.openChat(event, chat.id, this.props.history)}>
                    <Card.Content>
                        <Image
                            as="svg"
                            floated='right'
                            size='mini'
                            height="24" width="24">
                            <rect fill="#a0d36a" x="0" y="10" height="24" width="24"></rect>
                            <text fill="#ffffff" fontSize="12" textAnchor="middle" x="12" y="26">{chat.displayNames.length > 1 ? "#" : getDisplayNameAvatar(chat.displayNames[0])}</text>
                        </Image>
                        <Card.Header>{chat.displayNames.join(",")}</Card.Header>
                        <Card.Meta>{chat.lastUpdated}</Card.Meta>
                        <Card.Description style={getCardDescriptionStyle()}>{chat.lastMessage}</Card.Description>
                    </Card.Content>
                </Card>)
            })
            }
            </Card.Group>);
        } else {
            return (<Segment placeholder>
                <Header icon>
                  <Icon name='search' />
                  You don't have any chats. Start a chat with your contacts.
                </Header>
              </Segment>)
        }
    }

    renderPlaceHolders = () => {
        return (<Grid columns={4} stackable>{Array.from(Array(gridConfig.rows), (e, i) => {
            return (<Grid.Row>{Array.from(Array(gridConfig.columns), (e, i) => {
                return (<Grid.Column>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line length='medium' />
                                <Placeholder.Line length='short' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                </Grid.Column>)
            })}
            </Grid.Row>)
        })
        }</Grid>);
    }
}