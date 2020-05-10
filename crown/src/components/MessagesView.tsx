import React, { Component, RefObject } from "react";
import { Segment, Comment, Placeholder, Image } from "semantic-ui-react";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { getDisplayNameAvatar } from "../utils/UserUtil";

const viewConfig = {
    rows: 5
}

const avatarCssOverride = {
    borderRadius : "unset",
    width : "35px",
    height : "35px"
}

const scrollSectionOverride = {
    borderRadius : "10px",
    height : "25rem",
    overflowY: "scroll"
}

export interface MessagesViewProps {
    messages: Message[],
    senders: {
        [key: string]: User
    }
}
export interface MessagesViewState {
    messages?: Message[]
}

export class MessagesView extends Component<MessagesViewProps, MessagesViewState> {
    messagesEndRef:RefObject<HTMLDivElement>|undefined = undefined;
    constructor (props: MessagesViewProps) {
        super(props)
        this.messagesEndRef = React.createRef()
    }

    state: MessagesViewState = {
    }

    componentDidMount = () => {
        this.setState({
            messages: this.props.messages
        })
    }

    render() {
        if (!this.state.messages) {
            return this.renderPlaceholders();
        } else {
            return this.renderMessages();
        }
    }

    scrollToMyRef = () => {
        if (this.messagesEndRef && this.messagesEndRef.current) {
            console.log("Updated" + this.messagesEndRef.current)
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    renderMessages = () => {
        if (this.state.messages && this.state.messages.length > 0) {
            return (
                <Segment style={scrollSectionOverride}>
                    {this.state.messages.map((e, i) => {
                        return (
                            <Comment.Group key={e.id}>
                                <Comment>
                                    <Image
                                        as="svg"
                                        floated='left'
                                        verticalAlign='top'
                                        size='mini'
                                        height="24" width="24"
                                        style={avatarCssOverride}
                                        className='avatar'>
                                        <rect fill={this.props.senders[e.sId].color} x="0" y="10" height="24" width="24"></rect>
                                        <text fill="#ffffff" fontSize="12" textAnchor="middle" x="12" y="26">{getDisplayNameAvatar(this.props.senders[e.sId].displayName)}</text>
                                    </Image>
                                    <Comment.Content>
                                        <Comment.Author>{this.props.senders[e.sId].displayName}</Comment.Author>
                                        <Comment.Metadata>{e.createdDate}</Comment.Metadata>
                                        <Comment.Text>{e.message}</Comment.Text>
                                        <Comment.Actions>
                                            <Comment.Action key={e.id}>Delete</Comment.Action>
                                        </Comment.Actions>
                                    </Comment.Content>
                                </Comment>
                            </Comment.Group>
                        )
                    })}
                    <div ref={this.messagesEndRef} />
                </Segment>
            );
        }
    }

    componentDidUpdate() {
        this.scrollToMyRef();
    }

    renderPlaceholders = () => {
        return (<Segment placeholder>
            {Array.from(Array(viewConfig.rows), (e, i) => {
                return (<Placeholder fluid key={i}>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                </Placeholder>)
            })}
        </Segment>);
    }


}