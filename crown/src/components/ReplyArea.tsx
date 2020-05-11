import { BaseProps } from "../models/BaseProps";
import { BaseState } from "../models/BaseState";
import React, { Component, RefObject } from "react";
import { Form, Input, Button, Icon, Segment, Popup, Modal, Image, HtmlInputrops } from "semantic-ui-react";
import { Link } from "react-router-dom";

export interface ReplyAreaProps extends BaseProps {
    sendMessage : any
    fileInputRef : RefObject<HTMLInputElement>
    fileInputClick : any
    fileChange : any
}

export interface ReplyAreaState extends BaseState {
    message : string,
    file : any,
    fileName : string,
    ext? : any,
    modalOpen : boolean
}

export class ReplyArea extends Component <ReplyAreaProps, ReplyAreaState> {
    constructor(props:ReplyAreaProps) {
        super(props)
        this.state = {
            message: "",
            file: null,
            fileName : "",
            ext : null,
            modalOpen: false
        }
    }

    reply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (this.state.message.trim().length > 0) {
            const msg = await this.props.sendMessage(this.state.message, this.state.ext)
            if (msg) {
                this.setState({
                    message : "",
                    file: null,
                    fileName : "",
                    ext : null,
                    modalOpen : false
                })
            }
        }
    }

    handleFileChange = (e: any) => {
        if (e.target.files[0]) {
            this.setState({
                ...this.state,
                file: URL.createObjectURL(e.target.files[0]),
                fileName : e.target.files[0].name,
                ext : e.target.files[0].type,
                modalOpen : true
            })
        } else {
            this.setState({
                ...this.state,
                file: null,
                fileName : "",
                ext : "",
                modalOpen : false
            })
        }
        console.log(this.state)
        this.props.fileChange();
    }

    handleModalClose = () => {
        this.setState({...this.state, modalOpen : false, file : null, fileName : "", ext : ""});
    }

    handleTextChange = (e:any, data:any) => {
        console.log("Changing " + data.value)
        this.setState({...this.state, message: data.value})
    }

    render() {
        return (
                <Form onSubmit={this.reply}>
                    <Modal open={this.state.modalOpen} onClose={this.handleModalClose}>
                        <Modal.Header>Upload</Modal.Header>
                        <Modal.Description>{this.state.fileName}</Modal.Description>
                        <Modal.Content>
                            <Image src={this.state.file} hidden={!this.state.file} size="small"/>
                            <Input fluid placeholder='Reply...' onChange={this.handleTextChange} value={this.state.message}/>
                            <Button onClick={this.reply}>Upload</Button>
                        </Modal.Content>
                    </Modal>
                    <input ref={this.props.fileInputRef} type="file" hidden onChange={this.handleFileChange}/>
                    <Button as='a' onClick={this.props.fileInputClick} icon='upload'/>
                    <Input placeholder='Reply...' onChange={this.handleTextChange} style={{width:"93%"}} value={this.state.message}/>
                </Form>
        )
    }
}