import React, { Component } from 'react';
import store, { writeMessage, gotNewMessageFromServer, addMessage } from '../store';
import axios from 'axios';
import socket from '../socket';

export default class NewMessageEntry extends Component {
  constructor(){
    super();
    this.state = store.getState();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
  }
  
  componentWillUnmount(){
    this.unsubscribe();
  }

  handleChange(e){
    console.log(e.target.value);
    const action = writeMessage(e.target.value);
    store.dispatch(action);
  }

  handleSubmit(e){
    e.preventDefault();
    store.dispatch(addMessage(this.state.newMessageEntry, this.props.channelId, this.state.newNameEntry));
  }

  render () {
    return (
      <form id="new-message-form" onChange={this.handleChange} onSubmit={this.handleSubmit}>
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            type="text"
            name="content"
            placeholder="Say something nice..."
            value={this.state.NewMessageEntry}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit" >Chat!</button>
          </span>
        </div>
      </form>
    );
  }
}
