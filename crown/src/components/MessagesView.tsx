import React, { Component, RefObject } from "react";
import { Segment, Comment, Placeholder, Image, Modal } from "semantic-ui-react";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { getDisplayNameAvatar } from "../utils/UserUtil";
import { BaseState } from "../models/BaseState";
import { BaseProps } from "../models/BaseProps";
import convertToDisplayDateTime from "../utils/DateTimeUtils";

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

export interface MessagesViewProps extends BaseProps {
    messages: Message[],
    senders: {
        [key: string]: User
    },
    handleDelete : any
}

export interface MessagesViewState extends BaseState {
    file : string,
    modalOpen : boolean
}

export class MessagesView extends Component<MessagesViewProps, MessagesViewState> {
    messagesEndRef:RefObject<HTMLDivElement>|undefined = undefined;
    constructor (props: MessagesViewProps) {
        super(props)
        this.messagesEndRef = React.createRef()
        this.state = {
            file : "",
            modalOpen : false
        }
    }

    render() {
        if (!this.props.messages) {
            return this.renderPlaceholders();
        } else {
            return this.renderMessages();
        }
    }

    scrollToMyRef = () => {
        if (this.messagesEndRef && this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    handleModalClose = () => {
        this.setState({file : "", modalOpen : false})
    }

    openModal = (url: any) => {
        this.setState({file : url, modalOpen : true})   
    }

    handleDelete = (id: string) => {
        this.props.handleDelete(id)
    }

    renderMessages = () => {
        if (this.props.messages && this.props.messages.length > 0) {
            return (
                <Segment style={scrollSectionOverride}>
                    <Modal open={this.state.modalOpen} onClose={this.handleModalClose}>
                        <Modal.Header>File View</Modal.Header>
                        <Modal.Content>
                            <Image src={this.state.file} size="large"/>
                        </Modal.Content>
                    </Modal>
                    {this.props.messages.map((e, i) => {
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
                                        {e.ext ? <Image src={e.url} size="small" onLoad={this.scrollToMyRef} onClick={() => {this.openModal(e.url)}}/> : ""}
                                        <Comment.Text>{e.message}</Comment.Text>
                                        <Comment.Actions>
                                            <Comment.Action>{convertToDisplayDateTime(e.createdDate)}</Comment.Action>
                                            {e.sId === this.props.auth.getUser().uId ? <Comment.Action key={e.id} onClick={() => this.handleDelete(e.id)}>Delete</Comment.Action> : ""}
                                        </Comment.Actions>
                                    </Comment.Content>
                                </Comment>
                            </Comment.Group>
                        )
                    })}
                    <div ref={this.messagesEndRef} />
                </Segment>
            );
        } else {
            return (<Segment style={scrollSectionOverride}></Segment>)
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