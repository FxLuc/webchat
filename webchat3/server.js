const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const siofu = require("socketio-file-upload");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(siofu.router);
const Name = '';

// chạy client được kết nối
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Gửi 1 thông báo khi có 1 người dùng kết nối
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(Name,`${user.username} đã tham gia phòng`)
      );

    // // Gửi người dùng và thông tin phòng
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

//anh
io.on("connection", function(socket){
    var uploader = new siofu();
    uploader.dir = "/path/to/save/uploads";
    uploader.listen(socket);
});


  // lắng nghe chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Được chạy khi người dùng kết nối
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(Name, `<strong>${user.username}</strong> đã rời phòng`)
      );

      // Gửi người dùng và thông tin phòng
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


