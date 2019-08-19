const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// app.set('view engine', 'html');
// app.set('views', './views');

var rooms = [];

app.get('/', (req, res) => {
  // res.render('main');
  res.sendFile(__dirname+'/main.html');
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('leaveRoom', (Roomcode, name) => {
    socket.leave(Roomcode, () => {
      console.log(name + ' leave a ' + Roomcode);
      io.to(Roomcode).emit('leaveRoom', Roomcode, name);
    });
  });


  socket.on('joinRoom', (Roomcode, name) => {
    socket.join(Roomcode, () => {
      console.log(name + ' join a ' + Roomcode);
      if(!rooms.find(c => c===Roomcode))
        rooms.push(Roomcode);
      console.log(rooms);
      io.to(Roomcode).emit('joinRoom', Roomcode, name);
    });
  });


  socket.on('chat message', (Roomcode, name, msg) => {
    // insert msg to db
    io.to(Roomcode).emit('chat message', name, msg);
  });
});


http.listen(3000, () => {
  console.log('Connect at 3000');
});