const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Nhận username và room từ URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Tham gia chatroom
socket.emit('joinRoom', { username, room });

// Nhận room và users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message từ server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
  inputMessage(message);

  // cuộn xuống
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Gửi tin nhắn
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // instance.listenOnInput(document.getElementById("siofu_input"));
  // Nội dung tin nhắn
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }
  // Gửi tin nhắn đến server
  socket.emit('chatMessage', msg);

  // Xóa input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//
chatForm.addEventListener('siofu_inputt', (e) => {
  e.preventDefault();
  // Nội dung tin nhắn
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }
  // Gửi tin nhắn đến server
  socket.emit('chatMessage', msg);

  // Xóa input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Xuất div tin nhan (tên, thời gian, tin nhắn)
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerHTML += `${message.username} | <span> ${message.time} </span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Thêm tên phòng vào room
function outputRoomName(room) {
  roomName.innerText = room;
}

// Thêm user
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Nhắc người dùng trước khi rời khỏi phòng trò chuyện
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Bạn có chắc muốn rời phòng ?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
