import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';
import socket from './socket';

// const logger = applyMiddleware(loggerMiddleware);

const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';
const WRITE_MESSAGE = 'WRITE_MESSAGE';
const GOT_NEW_MESSAGE_FROM_SERVER = 'GOT_NEW_MESSAGE_FROM_SERVER';
const  WRITE_NAME = 'WRITE_NAME';

const initialState = {
	messages: [],
	newMessageEntry: '',
	newNameEntry: ''
};

export const writeName = function(inputContent){
	return {
		type: WRITE_NAME,
		newNameEntry: inputContent
	};
};

export const gotMessagesFromServer = function(messages) {
	return {
		type: GOT_MESSAGES_FROM_SERVER,
		messages: messages
	};
};

export const writeMessage = function(inputContent) {
	return {
		type: WRITE_MESSAGE,
		newMessageEntry: inputContent
	}
};

export const gotNewMessageFromServer = function(message) {
	return {
		type: GOT_NEW_MESSAGE_FROM_SERVER,
		message: message
	}
};

// our "thunk creator"
export function fetchMessages () {

  // our "thunk"
  return function thunk (dispatch) {
      return axios.get('/api/messages')
      .then(res => res.data)
      .then(messages => {
        const action = gotMessagesFromServer(messages);
        dispatch(action);
      });
  }
}

export function addMessage (content, channelId, name){
	return function thunk (dispatch) {
		return axios.post('/api/messages', { content, channelId, name })
    .then((message) => {
      dispatch(gotNewMessageFromServer(message.data));
      socket.emit('new-message', message.data);
      store.dispatch(writeMessage(''));
    });
	};
}


function reducer (state = initialState, action) {
	switch (action.type) {
		case GOT_MESSAGES_FROM_SERVER:
			return Object.assign({}, state, {messages: action.messages});
		case WRITE_MESSAGE:
			return Object.assign({}, state, {newMessageEntry: action.newMessageEntry});	
		case GOT_NEW_MESSAGE_FROM_SERVER:
			return Object.assign({}, state, {messages: state.messages.concat(action.message)});	
		case WRITE_NAME:
			return Object.assign({}, state, {newNameEntry: action.newNameEntry});			
		default:
  		return state;
	} 
}

const store = createStore(reducer, applyMiddleware(logger, thunk));

export default store;