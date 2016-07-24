const $ = window.jQuery;

$(() => {
  const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(scheme + '//' + window.location.host + window.location.pathname);
  console.log("scheme + '//' + window.location.host + window.location.pathname", scheme + '//' + window.location.host + window.location.pathname);
});
