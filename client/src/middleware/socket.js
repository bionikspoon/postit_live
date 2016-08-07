import { updateConnectionStatus } from '../modules/live';
import * as socketActions from '../modules/socket';
import Socket from '../utils/socket';
import { CONNECTION_OPENED, CONNECTION_CLOSED, CONNECTION_RECONNECTING } from '../constants/ConnectionStatus';
import _ from 'lodash';
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
    const action = updateConnectionStatus({ connectionStatus: CONNECTION_OPENED });
    this.dispatch(action);

    debug('dispatched type=%s payload=', action.type, action.payload);
  }

  onclose(event) {
    super.onclose(event);

    const connectionStatus = event.wasClean ? CONNECTION_CLOSED : CONNECTION_RECONNECTING;
    const action = updateConnectionStatus({ connectionStatus });
    const state = this.store.getState();

    if (connectionStatus !== state.live.meta.connectionStatus) {
      this.dispatch(action);
      debug('dispatched type=%s payload=', action.type, action.payload);
    }
  }
}

export default function connect(store) {
  const { protocol, host } = window.location;
  const pathname = `${window.location.pathname.split('/').slice(0, 3).join('/')}/`;
  const socket = new LiveSocket(store, { protocol, host, pathname });
  const middlewareActions =
    _.values(socketActions)
      .map(action => action.toString())
      .filter(action => !action.startsWith('function'));

  socket.open();
  return next => action => {
    if (!middlewareActions.includes(action.type)) return next(action);

    socket.send(JSON.stringify(action));

    return next(action);
  };
}
