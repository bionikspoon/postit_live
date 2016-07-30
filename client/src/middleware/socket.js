import * as types from '../constants/SocketActionTypes';

export default function connect(store) {
  const socket = createSocket(store, window.location);
  const middlewareActions = Object.keys(types).map(type => types[type]);

  return next => action => {
    if (!middlewareActions.includes(action.type)) return next(action);

    socket.send(JSON.stringify(action));

    return next(action);
  };
}

function createSocket({ dispatch }, { protocol, host, pathname }) {
  const scheme = protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${scheme}//${host}${pathname}`);
  return Object.assign(socket, { onclose, onerror, onmessage: onmessage(dispatch), onopen });
}

function onclose(event) {
  console.log("onclose event", event);
}

function onerror(event) {
  console.log("onerror event", event);
}

function onmessage(dispatch) {
  return function(event) {
    const data = JSON.parse(event.data);
    dispatch(data);
  };
}

function onopen(event) {
  console.log("onopen event", event);
}
