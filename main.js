var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser');

var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'mafia17'
});

db.connect();

app.use(bodyParser.urlencoded({ extended: false }));

app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('views', './views');

var rooms = [];

app.get('/', (req, res) => {
  /*
  db.query('SELECT * from test', function(err, rows, fields) {
    if (!err)
      console.log('The solution is: ', rows);
    else
      console.log('Error while performing Query.', err);
  });
  */
  res.render('main');
});

// upload images
app.get('/img/job/:filename', (req, res) => {
  fs.readFile('img/job/'+req.params.filename, (error, data) => {
    res.writeHead(200, { 'Content-Type': 'image/png'});
    res.end(data);
  });
});

io.on('connection', (socket) => {
  console.log('connection');

  socket.on('disconnect', () => {
    // db.end();
    console.log('user disconnected');
  });

  socket.on('leave', (Roomcode, name) => {
    socket.leave(Roomcode, () => {
      db.query('DELETE FROM player WHERE roomcode = ? AND name = ?'
      , [Roomcode, name]
      , () => {
        console.log(name + ' leave a ' + Roomcode);
        io.to(Roomcode).emit('leaveRoom', Roomcode, name);
      });
    });
  });

  socket.on('joinRoom', (Roomcode, name) => {
    socket.join(Roomcode, () => {
      
      db.query('INSERT INTO player VALUES( ?, ? )'
      , [Roomcode, name]
      , ()=> {
        db.query('SELECT * FROM player WHERE roomcode = "'+Roomcode+'"'
        , function(err, players) {
          console.log(name + ' join a ' + Roomcode);
          console.log(players.rows);

          io.to(Roomcode).emit('joined', Roomcode, name, players);
        });
      });
    });
  });


  socket.on('chat message', (Roomcode, name, msg) => {
    // insert msg to db
    db.query('insert into test(room, uname, msg) values(?, ?, ?)' // add time
    ,[Roomcode, name, msg]
    , function(err, rows, fields) {
      // do something
      console.log(rows);
    });
    io.to(Roomcode).emit('chat message', name, msg);
  });

  socket.on('starting', (Roomcode)=> {
    db.query('SELECT name FROM player WHERE roomcode = ?'
    ,[Roomcode]
    , function(err, players) {
      io.to(Roomcode).emit('gamestart', players);
    });
  });

  // socket.on('chat at night', (Roomcode, job, name, msg)=> {
  //   io.to(Roomcode).emit('')
  // })

  socket.on('chat at night', (Roomcode, name, msg)=> {
    console.log('night');
    io.emit(Roomcode).emit('chat at night', name, msg);
  });

  socket.on('chat at will', (Roomcode, name, msg)=> {

  })

}); // connection

http.listen(3000, () => {
  console.log('Connect at 3000');
});