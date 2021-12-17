const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors')


// mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://often127:D3c0DeD.doc@often127.3eupw.mongodb.net/final?retryWrites=true&w=majority')
  .then(() => console.log('mongodb connected'))  
  .catch( error => handleError(error))


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
require('./routes/index')(app)
app.use( express.static( "public" ) );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.on('join_room', room_id => {
    Array.from(socket.rooms)
    .filter( it => it !== socket.id)
    .forEach( id => {
      socket.leave(id)
      socket.removeAllListeners(`chat`)
    })
    socket.join(room_id)
    io.sockets.in(room_id).emit('chat_message', { room: room_id, sender: 'FALO system', from: '', msg: "join"})
  })
  
  socket.on('chat', data => {
    Array.from(socket.rooms)
      .filter(it => it !== socket.id)
      .forEach(id => {
        io.sockets.in(id).emit('chat_message', data)
      })
  })

  socket.on('disconnect', () => {
    console.log(socket.id + ' ==== diconnected');
    socket.removeAllListeners()
  })
})

http.listen(3000, () => {
  console.log(`Socket.IO server running at http://localhost:3000/`);
});

module.exports = app;