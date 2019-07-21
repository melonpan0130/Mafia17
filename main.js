var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(request, response) {
    response.sendFile(__dirname+'/test.html');
});

io.on('connection', function(socket) {
    console.log('a user connected.');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    io.emit('some event', { for: 'everyone' });
    socket.broadcast.emit('hi');

    socket.on('chat message', function(msg) {
        // console.log('message : '+msg);
        io.emit('chat message', msg);
    }); 
});

http.listen(3000, function() {
    console.log('success');
});