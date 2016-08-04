import * as types from '../constants/SocketActionTypes';
import * as actions from '../actions/liveActions';
import Socket from '../utils/socket';
import { CONNECTION_OPENED, CONNECTION_CLOSED, CONNECTION_RECONNECTING } from '../constants/ConnectionStatus';
const debug = require('debug')('app:middleware:socket');

class LiveSocket extends Socket {
  onmessage(event) {
    super.onmessage(event);

    const action = JSON.parse(event.data);
    this.dispatch(action);

    debug('dispatched type=%s payload=', action.type, action.payload);
  }

  onopen(event) {
    super.onopen(event);
    const action = actions.updateConnectionStatus({ connectionStatus: CONNECTION_OPENED });
    this.dispatch(action);

    debug('dispatched type=%s payload=', action.type, action.payload);
  }

  onclose(event) {
    super.onclose(event);

    const connectionStatus = event.wasClean ? CONNECTION_CLOSED : CONNECTION_RECONNECTING;
    const action = actions.updateConnectionStatus({ connectionStatus });
    this.dispatch(action);

    debug('dispatched type=%s payload=', action.type, action.payload);
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
