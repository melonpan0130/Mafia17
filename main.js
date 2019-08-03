var app = require('express')();
var http = require('http').createServer(app);
// var io = require('socket.io')(http);
var socketio = require('socket.io');
var fs = require('fs'); 
// connect to mysql
var mysql = require('mysql');
var db = mysql.createConnection({
  user:'root',
  password:'1234',
  database:'mafia17'
})
db.connect();


/*
app.get('/', function(request, response) {
    response.sendFile(__dirname+'/main.html');
    // redirect /room/:code
});

app.get('/room/:code', function(request, response) {

});
*/

var server = require('http').createServer(function(req, res){
    fs.readFile('index.html', 'utf8', function(err, data){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(data);
});
}).listen(3000, function(){
console.log('Running ~~~~~~~~~~~~');
});
/*
io.on('connection', function(socket) {
    console.log('a user connected.');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // socket.broadcast.emit('hi');

    socket.on('chat message', function(data) {
        // console.log('message : '+msg);
        var room = data.room;
        socket.join(room);
        chat.to(room).emit('chat message', data);
    }); 
});

*/
var io = socketio.listen(server);
var chat=io.sockets.on('connection', function(socket){
        socket.on('sMsg', function(data){
        var room = data.room;
        connection.query("INSERT INTO test (room, uname, msg) VALUES (?, ?, ?)", [
            data.room, data.name, data.msg
          ], function(){
            //console.log('Data Insert OK');
        });
        socket.join(room);
        chat.to(room).emit('rMsg', data);
    });
});

// io.emit('some event', { for: 'everyone' });
/*
http.listen(3000, function() {
    console.log('success');
});*/