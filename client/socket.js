import io from 'socket.io-client';
import store, {gotNewMessageFromServer} from './store';

const socket = io(window.location.origin);

socket.on('connect', function () {
  console.log('I am now connected to the server!');

  socket.on('new-message', function (message) {
  	console.log('****New message coming through.')
    store.dispatch(gotNewMessageFromServer(message));
  });
});

export default socket;
