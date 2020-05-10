import { BaseProps } from "../models/BaseProps";
import { BaseState } from "../models/BaseState";
import React, { Component } from "react";
import { Form, Input } from "semantic-ui-react";

export interface ReplyAreaProps extends BaseProps {
    sendMessage : any
}

export interface ReplyAreaState extends BaseState {
    message? : string
}

export class ReplyArea extends Component <ReplyAreaProps, ReplyAreaState> {
    reply = (e: React.FormEvent) => {
        e.preventDefault()
        this.props.sendMessage(this.state.message)
    }
    render() {
        return (
            <Form onSubmit={this.reply}>
                <Input fluid icon='reply' placeholder='Reply...' />
            </Form>
        )
    }
}