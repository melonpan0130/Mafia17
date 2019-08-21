var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');
app.set('views', './views');

var rooms = [];
var e_name, e_room;

app.get('/', (req, res) => {
  // res.render('main');
  // res.sendFile(__dirname+'/views/index.html');
  res.render('enter');
});

// upload images
app.get('/img/job/:filename', (req, res) => {
  fs.readFile('img/job/'+req.params.filename, (error, data) => {
    res.writeHead(200, { 'Content-Type': 'image/png'});
    res.end(data);
  })
})

app.post('/enterProc', (req, res) => {
  e_name = req.body.name;
  e_room = req.body.room;
  res.redirect('/gameChat');
});

app.get('/gameChat', (req, res) => {
  res.render('main', {
    name : e_name,
    Roomcode : e_room
  });
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