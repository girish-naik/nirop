import React, { Component, RefObject } from "react";
import { BaseProps } from "../models/BaseProps";
import { BaseState } from "../models/BaseState";
import { ReplyArea } from "./ReplyArea";
import { MessagesView } from "./MessagesView";
import { Segment } from "semantic-ui-react";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Message as MessageVO} from "../api/mantle/models/Message";
import { fetchMessages, sendMessage, deleteMessage, saveFile, fetchMessage } from "../api/mantle/MessageApi";
import { getChat } from "../api/keel/ChatApi";
import { getContactList } from "../api/bill/ContactsApi";
import { SendMessageResponse } from "../api/mantle/models/SendMessageResponse";

export interface ChatProps extends BaseProps {
    match: {
        params: {
            chatId: string
        }
    }
}

export interface ChatState extends BaseState {
    cId : string
    messages : Message[]
    senders : {
        [key:string] : User
    }
}

export class ChatView extends Component<ChatProps, ChatState> {
    fileRef:RefObject<HTMLInputElement>;
    constructor (props: ChatProps) {
        super(props)
        this.state.cId = props.match.params.chatId;
        this.fileRef = React.createRef()
    }

    state = {
        cId : "",
        messages : [],
        senders : {}
    }

    sendMessage = async (message: string, ext: string) => {
        const cId = this.state.cId;
        const msg:SendMessageResponse|undefined = await sendMessage(this.props.auth.getIdToken(), {cId, message, ext});
        if (msg) {
            let msgUrl = msg.url;
            if (msg.url && this.fileRef && this.fileRef.current && this.fileRef.current.files) {
                await saveFile(msg.url, this.fileRef.current.files[0])
                const savedMsg:Message|undefined = await fetchMessage(this.props.auth.getIdToken(), msg.mId);
                msgUrl = savedMsg ? savedMsg.url : msgUrl;
            }
            let messages:Message[] = this.state.messages;
            messages.push({
                ...msg,
                id : msg.mId,
                createdDate : msg.cDate,
                url : msgUrl,
                ext : msg.ext
            });
            this.setState({...this.state, messages : messages})
        }
        return msg;
    }

    handleDelete = async (mId: string) => {
        const done:boolean = await deleteMessage(this.props.auth.getIdToken(), mId);
        if (done) {
            this.setState({...this.state, messages : this.state.messages.filter((message:Message) => message.id !== mId)})
        }
    }

    fileInputClick = (event: Event) => {
        if (this.fileRef && this.fileRef.current) {
            this.fileRef.current.click();
        }
    }

    fileChange = (event:React.FormEvent, data:any) => {
        if (this.fileRef && this.fileRef.current) {
            console.log(this.fileRef.current.files);
        } 
    }

    componentDidMount = async () => {
        const contacts = await getContactList(this.props.auth.getIdToken())
        if (contacts) {
            const chat = await getChat(this.props.auth.idToken, this.state.cId)
            if (chat) {
                const senders : {[key:string]: User} = contacts.users.filter((user) => {
                    if (chat.participants.indexOf(user.id) >= 0) {
                        return true;
                    }
                    return false;
                }).reduce((returnMap:{[key:string]: User}, user: User) => {
                    returnMap[user.id] = user;
                    user.color = "#"+((1<<24)*Math.random()|0).toString(16);
                    return returnMap;
                }, {})
                const user = this.props.auth.getUser();
                senders[user.uId] = this.props.auth.user;
                const messageView = await fetchMessages(this.props.auth.getIdToken(), this.state.cId);
                console.log(messageView);
                if (messageView && messageView.messages) {
                    console.log(messageView);
                    const messages : Message[] = messageView.messages.map((msg: MessageVO) => {
                            return {
                                ...msg,
                                id : msg.mId,
                                createdDate : msg.cDate
                        }
                    });
                    this.setState({cId : this.state.cId, senders : senders, messages: messages.reverse()});
                }
            }
        }
    }

    render () {
        return (
            <Segment vertical>
                <MessagesView handleDelete={this.handleDelete} auth={this.props.auth} senders={this.state.senders} messages={this.state.messages}/>
                <ReplyArea auth={this.props.auth} sendMessage={this.sendMessage} fileInputRef={this.fileRef} 
                    fileInputClick={this.fileInputClick} fileChange={this.fileChange}/>
            </Segment> 
        );
    }
}