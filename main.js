var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/main.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.broadcast.emit('hi');

    socket.on('chat message', function(data){
        io.emit('chat message', data.msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.emit('some event', { for: 'everyone' });
