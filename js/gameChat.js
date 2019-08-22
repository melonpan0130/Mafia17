import { request } from "http";

$(() => {
  const name = prompt('What your name');
  const Roomcode = prompt('Write room code or create new room code');
  const socket = io();

  socket.emit('joinRoom', Roomcode, name);

  $('form').submit(() => {
    socket.emit('chat message', Roomcode, name, $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', (name, msg) => {
    $('#messages').append($('<li>').text(name + '  :  ' +
      msg));
  });

  socket.on('leaveRoom', (Roomcode, name) => {
    $('#messages').append($('<li>').text(name + '    leaved '
      + Roomcode + ' :('));
  });

  socket.on('joinRoom', (Roomcode, name) => {
    $('#messages').append($('<li>').text(name + '    joined '
      +Roomcode + ':)'));
  });
});