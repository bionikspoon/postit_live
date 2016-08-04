import * as types from '../constants/SocketActionTypes';
import Socket from '../utils/socket';

class LiveSocket extends Socket {
  onmessage(event) {
    super.onmessage(event);

    const action = JSON.parse(event.data);
    this.dispatch(action);

    console.debug('onmessage dispatched type=%s payload=', action.type, action.payload);
  }
}

export default function connect(store) {
  const { protocol, host, pathname } = window.location;
  const socket = new LiveSocket(store, { protocol, host, pathname: `${pathname.split('/').slice(0, 3).join('/')}/` });
  const middlewareActions = Object.keys(types).map(type => types[type]);

  socket.open();
  return next => action => {
    if (!middlewareActions.includes(action.type)) return next(action);

    socket.send(JSON.stringify(action));

    return next(action);
  };
}
