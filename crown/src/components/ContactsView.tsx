import React, { Component } from "react";
import { BaseProps } from "../models/BaseProps";
import { BaseState } from "../models/BaseState";
import { Card, Segment, Placeholder, Button, Image } from "semantic-ui-react";
import { User } from "../models/User";
import { getDisplayNameAvatar } from "../utils/UserUtil";
import {getContactList} from '../api/bill/ContactsApi'
import { ContactList } from "../api/bill/models/ContactList";
import { Chat } from "../api/keel/models/Chat";
import { startChat } from "../api/keel/ChatApi";

const gridConfig = {
    rows: 3,
    columns: 4
}

export interface ContactsViewProps extends BaseProps {

}

export interface ContactsViewState extends BaseState {
    contacts?: User[],
    lastRenderedContact?: {
        id : string
        displayName : string
    } 
}

export default class ContactsView extends Component<ContactsViewProps, ContactsViewState> {

    state: ContactsViewState = {

    }

    render() {
        if (!this.state.contacts) {
            return this.renderPlaceHolders();
        } else {
            return this.renderContacts();
        }
    }

    async componentDidMount () {
        let lastId = undefined;
        let lastDisplayName = undefined;
        if (this.state.lastRenderedContact) {
            lastId = this.state.lastRenderedContact.id;
            lastDisplayName = this.state.lastRenderedContact.displayName;
        }
        const contactList:ContactList = await getContactList(this.props.auth.getIdToken(), lastId, lastDisplayName);
        this.updateState(contactList.users, contactList.lastEvaluatedContact);
    }

    updateState = (users: User[], lastRenderedContact: User|undefined) => {
        this.setState({contacts : users, lastRenderedContact: lastRenderedContact});
    }

    openChat = async (key:string) => {
        const contactId = key;
        const chat = await startChat(this.props.auth.getIdToken(), [contactId]);
        if (chat) {
            this.props.history.replace("/chat/" + chat.cId + "/open")
        }
    }

    renderContacts = () => {
        const contacts = this.state.contacts;
        if (!contacts) {
            return (<Segment placeholder></Segment>)
        }
        return (<Card.Group doubling itemsPerRow={3} stackable>{contacts.map((contact, i) => {
                    return (<Card key={contact.id}>
                        <Card.Content>
                            <Image
                                as="svg"
                                floated='right'
                                size='mini'
                                height="24" width="24">
                                <rect fill="#a0d36a" x="0" y="10" height="24" width="24"></rect>
                                <text fill="#ffffff" fontSize="12" textAnchor="middle" x="12" y="26">{getDisplayNameAvatar(contact.displayName)}</text>
                            </Image>
                            <Card.Header>{contact.displayName}</Card.Header>
                            <Card.Meta>{contact.email}</Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <Button key={contact.id} primary onClick={() => this.openChat(contact.id)}>Chat</Button>
                        </Card.Content>
                    </Card>
                    );
                })
            }
            </Card.Group>
        );
    }

    renderPlaceHolders = () => {
        return (<Card.Group doubling itemsPerRow={3} stackable>{Array.from(Array(gridConfig.rows), (e, i) => {
                return Array.from(Array(gridConfig.columns), (e, i) => {
                    return (<Card key={i}>
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line length='very short' />
                                    <Placeholder.Line length='medium' />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='short' />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Card.Content>
                        <Card.Content extra>
                            <Button disabled={true} primary>Chat</Button>
                        </Card.Content>
                    </Card>
                    );
                })
            }
            )}
            </Card.Group>
        );
    }
}