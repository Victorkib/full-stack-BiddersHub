import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const io = new Server({
  cors: {
    origin: 'https://bidders-hub.onrender.com',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  socket.on('newUser', (userId) => {
    addUser(userId, socket.id);
    console.log(`connected User: ` + userId);
  });

  socket.on('sendMessage', ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit('getMessage', data);
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

const PORT = process.env.PORT || 4000; // Use environment variable for port
io.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
