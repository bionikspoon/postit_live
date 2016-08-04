const debug = require('debug')('app:utils:socket');

export default class Socket {
  constructor(store, location, timeout = 500) {
    const { dispatch } = store;
    const { protocol, host, pathname } = location;
    const scheme = protocol === 'https:' ? 'wss:' : 'ws:';
    this.dispatch = dispatch;
    this.store = store;
    this.path = `${scheme}//${host}${pathname}`;
    this.conn = null;
    this.timeout = timeout;

    this.open = this.open.bind(this);
    this.send = this.send.bind(this);
    this.onopen = this.onopen.bind(this);
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.onerror = this.onerror.bind(this);
  }

  open() {
    debug('open this=', this);
    const conn = new WebSocket(this.path);

    conn.onopen = this.onopen;
    conn.onmessage = this.onmessage;
    conn.onclose = this.onclose;
    conn.onerror = this.onerror;
    this.conn = conn;
  }

  send(data) {
    debug('send data=', data);
    this.conn.send(data);
  }

  onopen(event) {
    debug('onopen event=', event);
  }

  onmessage(event) {
    debug('onmessage event=', event);
  }

  onclose(event) {
    debug('onclose event=', event);

    this.conn = null;
    if (!event.wasClean) setTimeout(this.open, this.timeout);
  }

  onerror(event) {
    debug('onerror event=', event);
  }
}
