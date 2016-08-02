import * as types from '../constants/SocketActionTypes';
import Socket from '../utils/socket';

class LiveSocket extends Socket {
  onmessage(event) {
    super.onmessage(event);

    const action = JSON.parse(event.data);
    this.dispatch(action);

    console.debug('onmessage action=', action);
  }
}

export default function connect(store) {
  const socket = new LiveSocket(store, window.location);
  const middlewareActions = Object.keys(types).map(type => types[type]);

  socket.open();
  return next => action => {
    if (!middlewareActions.includes(action.type)) return next(action);

    socket.send(JSON.stringify(action));

    return next(action);
  };
}
