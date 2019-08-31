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
        db.query('SELECT * FROM player WHERE roomcode = ?'
        , [Roomcode]
        , function(err, players) {
          console.log(name + ' join a ' + Roomcode);
          console.log(players);

          io.to(Roomcode).emit('joined', Roomcode, name, players);
        });

        // RoomCode가 새로운 방인가?
        /*
        var isNewRoom = rooms.filter((room)=>{return room.room == Roomcode});
        console.log(isNewRoom);
        if(!isNewRoom)
          rooms.push({ room : Roomcode, member : [name]});
        else
          isNewRoom.member.push(name);
        console.log(rooms);
        */


        // save cookie for reload.
        // console.log(messages[0]);
        // console.log(messages[0].room);
        // console.log(messages[0].uname);

        // console.log(chatting.uname+' : '+chatting.msg);
        
      });
    });
  });


  socket.on('chat message', (Roomcode, name, msg) => {
    // insert msg to db
    db.query('insert into test(room, uname, msg) values(?, ?, ?)' // add time
    ,[Roomcode, name, msg]
    , function(err, rows, fields) {
      // do something
    });
    io.to(Roomcode).emit('chat message', name, msg);
  });
});

http.listen(3000, () => {
  console.log('Connect at 3000');
});