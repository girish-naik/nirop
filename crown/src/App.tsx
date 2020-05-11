import React, { Component } from 'react';
import './App.css';
import { BaseProps } from './models/BaseProps';
import { BaseState } from './models/BaseState';
import Main from './components/Main';

export interface AppProps extends BaseProps { }

export interface AppState extends BaseState { }


export default class App extends Component<AppProps, AppState> {

  render() {
    return (<Main {...this.props} />)
  }

}
