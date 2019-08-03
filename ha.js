var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var mysql = require('mysql');
var connection = mysql.createConnection({
  user:'root',
  password:'1234',
  database:'mafia17'
})
connection.connect();

var server = http.createServer(function(req, res){
        fs.readFile('index.html', 'utf8', function(err, data){
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data);
    });
}).listen(3000, function(){
    console.log('Running ~~~~~~~~~~~~');
});

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