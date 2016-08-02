import * as types from '../constants/SocketActionTypes';

class Socket {
  constructor(store, location) {
    const { dispatch } = store;
    const { protocol, host, pathname } = location;

    const scheme = protocol === 'https:' ? 'wss:' : 'ws:';
    this.dispatch = dispatch;
    this.path = `${scheme}//${host}${pathname}`;
    this.conn = null;

    this.open = this.open.bind(this);
    this.send = this.send.bind(this);
    this.onopen = this.onopen.bind(this);
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.onerror = this.onerror.bind(this);
  }

  open() {
    console.debug('open this=', this);
    const conn = new WebSocket(this.path);
    conn.onopen = this.onopen;
    conn.onmessage = this.onmessage;
    conn.onclose = this.onclose;
    conn.onerror = this.onerror;
    this.conn = conn;
  }

  send(data) {
    console.debug('send data=', data);
    this.conn.send(data);
  }

  onopen(event) {
    console.debug('onopen event=', event);
  }

  onmessage(event) {
    console.debug('onmessage event=', event);

    const data = JSON.parse(event.data);
    console.debug('onmessage data=', data);
    this.dispatch(data);
  }

  onclose(event) {
    console.debug('onclose event=', event);

    this.conn = null;
    if (!event.wasClean) setTimeout(this.open, 500);
  }

  onerror(event) {
    console.debug('onerror event=', event);
  }
}

export default function connect(store) {
  const socket = new Socket(store, window.location);
  const middlewareActions = Object.keys(types).map(type => types[type]);

  socket.open();
  return next => action => {
    if (!middlewareActions.includes(action.type)) return next(action);

    socket.send(JSON.stringify(action));

    return next(action);
  };
}
