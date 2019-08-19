var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// app.set('view engine', 'ejs');
// app.set('views', './views');

let roomNum = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/main.html');
});

app.post('/main', function(req, res) {
    // res.sendfile(__dirname + '/main.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    // socket.broadcast.emit('hi');

    socket.on('leaveRoom', (num, name)=> {
        socket.leave(num, ()=> {
            console.log(name + ' leave a room ' + num);
            io.to(num).emit('leaveRoom', num, name);
        });
    });
    
    socket.on('joinRoom', (num, name)=> {
        socket.join(num, () => {
            console.log(name + ' join a room ' + num);
            io.to(num).emit('joinRoom', num, name);
        });
    });

    socket.on('chat message', (num, name, msg) => {
        roomNum = num;
        io.to(roomNum).emit('chat message', name, msg);
    });
});

http.listen(3000, function(){
    console.log('success');
});

io.emit('some event', { for: 'everyone' });
