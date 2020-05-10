import React, { Component } from 'react'
import { Segment, Input, Form, Checkbox, Button, Message } from 'semantic-ui-react'
import { BaseProps } from '../models/BaseProps'
import { BaseState } from '../models/BaseState'
import { validate as validateEmail } from 'email-validator'
import { saveUser, getUserDetails } from '../api/bill/UserApi'

interface RegistrationViewState extends BaseState {
    termsChecked: boolean
    displayName: string
    email: string
    formValidation: boolean
    formValidationMsg: string
    displayNameEnabled: boolean
    emailEnabled: boolean
    submitEnabled: boolean
}

export class RegistrationView extends Component<BaseProps, BaseState> {
    state: RegistrationViewState = {
        termsChecked: false,
        displayName: "",
        email: "",
        formValidation: false,
        formValidationMsg: "",
        displayNameEnabled: false,
        emailEnabled: false,
        submitEnabled: false
    }

    updateTerms = (event: React.FormEvent, data: any) => {
        this.setState({ ...this.state, termsChecked: data.checked })
    }

    updateDisplayName = (event: React.FormEvent, data: any) => {
        this.setState({ ...this.state, displayName: data.value })
    }

    updateEmail = (event: React.FormEvent, data: any) => {
        this.setState({ ...this.state, email: data.value })
    }

    handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!this.state.displayName || this.state.displayName.split(" ").length != 2) {
            this.setState({ ...this.state, formValidation: true, formValidationMsg: "Invalid display name." })
            return;
        }
        if (!this.state.email || !validateEmail(this.state.email)) {
            this.setState({ ...this.state, formValidation: true, formValidationMsg: "Invalid email." })
            return;
        }
        this.setState({ 
            ...this.state, 
            formValidation: false, 
            formValidationMsg: "", 
            displayNameEnabled: false, 
            emailEnabled: false, 
            submitEnabled: false });
        const status:boolean = await saveUser(this.props.auth.getIdToken(), this.state.displayName, this.state.email);
        if (status) {
            this.props.history.replace("/chats")
        } else {
            this.enableForm("Error while submitting form. Please try again.");
        }
    }

    enableForm = (errorMessage : string | undefined) => {
        this.setState({ 
            ...this.state, 
            formValidation: false, 
            formValidationMsg: "", 
            displayNameEnabled: true, 
            emailEnabled: true, 
            submitEnabled: true });
    }

    componentDidMount = async () => {
        try {
            const user = await getUserDetails(this.props.auth.getIdToken());
            if (user) {
                this.props.auth.setUser(user)
                this.props.history.replace("/chats")
            }
        } finally {
            this.enableForm(undefined)
        }
    }

    render = () => {
        return (
            <Segment>
                <Form onSubmit={this.handleFormSubmit} error={this.state.formValidation}>
                    <Form.Field>
                        <Input
                            icon='address card outline'
                            iconPosition='left'
                            label={{ tag: true, content: 'Name' }}
                            labelPosition='right'
                            placeholder='Marco Polo'
                            onChange={this.updateDisplayName}
                            disabled={!this.state.displayNameEnabled}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            icon='at'
                            iconPosition='left'
                            label={{ tag: true, content: 'Email' }}
                            labelPosition='right'
                            placeholder='yourself@email.com'
                            onChange={this.updateEmail}
                            disabled={!this.state.emailEnabled}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label='I agree to the Terms and Conditions' onChange={this.updateTerms} />
                    </Form.Field>
                    <Message
                        error
                        header='Error'
                        content={this.state.formValidationMsg}
                    />
                    <Button type='submit' disabled={!this.state.termsChecked || !this.state.submitEnabled}>Submit</Button>
                </Form>
            </Segment>
        )
    }
}

export default RegistrationView
