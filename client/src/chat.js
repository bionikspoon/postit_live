const moment = require('moment');
const $ = require('jquery');

$(() => {
  const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${scheme}//${window.location.host}${window.location.pathname}`);
  const $form = $('#chatform').first();
  const $handle = $('#handle').first();
  const $message = $form.find('#message').first();
  const $chat = $('#chat').first();
  const $td = $('<td></td>');

  init($chat);
  setInterval(update($chat), 15 * 1000);

  socket.onmessage = message => {
    const data = JSON.parse(message.data);
    const $tr = $('<tr></tr>');

    const timestamp = moment(data.timestamp);

    const $temp = $td.clone()
                     .addClass('timestamp')
                     .data('timestamp', timestamp)
                     .text(timestamp.fromNow());
    window.$td = $temp;
    $tr.append($temp);
    $tr.append($td.clone().text(data.handle));
    $tr.append($td.clone().text(data.message));

    $chat.append($tr);
  };

  $form.submit(() => {
    const message = { handle: $handle.val(), message: $message.val() };
    socket.send(JSON.stringify(message));
    $message.val('').focus();
    return false;
  });
});

function init($chat) {
  $chat
    .find('> tbody > tr > td.timestamp')
    .each(function each() {
      const $self = $(this);
      const timestamp = moment($self.text());
      $self.data('timestamp', timestamp).text(timestamp.fromNow()).removeClass('cloak');
    });
}

function update($chat) {
  return () => {
    $chat
      .find('> tbody > tr > td.timestamp')
      .each(function each() {
        const $self = $(this);
        const timestamp = $self.data('timestamp');
        $self.text(timestamp.fromNow());
      });
  };
}
