import React, { Component } from "react";
import { BaseProps } from "../models/BaseProps";
import { BaseState } from "../models/BaseState";
import { ReplyArea } from "./ReplyArea";
import { MessagesView } from "./MessagesView";
import { Segment } from "semantic-ui-react";
import { User } from "../models/User";

export interface ChatProps extends BaseProps {
    match: {
        params: {
          cId: string
        }
      }
}

export interface ChatState extends BaseState {
    cId : string
    messages? : any[]
    senders : {
        [key:string] : User
    }
}

const mockUsers = {
    "1" : {
        id : "1",
        displayName : "Girish Naik",
        email : "crazygirishnaik@gmail.com",
        color : "#a0d36a"
    }, 
    "2" : {
        id : "2",
        displayName : "Shantala Gaitonde",
        email : "shantalag4@gmail.com",
        color : "#a0006a"
    }
}

const mockMessages =[
    {
        id : "1",
        sId : "1",
        message : "Hello Sir!",
        createdDate : "5 minutes ago"
    },{
        id : "2",
        sId : "2",
        message : "Hello!",
        createdDate : "4 minutes ago"
    }, {
        id : "3",
        sId : "1",
        message : "Welcome to the new app",
        createdDate : "3 minutes ago"
    }, {
        id : "4", 
        sId : "2",
        message : "This is so cool",
        createdDate : "2 minutes ago"
    }, {
        id : "5",
        sId : "1",
        message : "Glad that you like it",
        createdDate : "1 minute ago"
    }
]

export class ChatView extends Component<ChatProps, ChatState> {
    sendMessage = () => {

    }
    render () {
        return (
            <Segment vertical>
                <MessagesView senders={mockUsers} messages={mockMessages}/>
                <ReplyArea auth={this.props.auth} sendMessage={this.sendMessage}/>
            </Segment> 
        );
    }
}