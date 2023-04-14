require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io");
// const db = require('./utils/db');

const playerRoutes = require('./routes/playerRoutes');
const roomRoutes = require('./routes/roomRoutes');
const wordRoutes = require('./routes/wordRoutes');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Serve the build folder from the client
app.use(express.static('client/build'));

// Parse JSON requests
app.use(express.json());

mongoose.connect('mongodb+srv://nevan-dsouza:dkTVqsEL8YR2Uamb@cyrptoclash.frozmvu.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

  
// mongoose.connect('mongodb+srv://nevan-dsouza:dkTVqsEL8YR2Uamb@cyrptoclash.frozmvu.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log(err));

app.get('/test', async (req, res) => {
  res.status(200).send('server running');
  res.end();
});


// API endpoint to generate random words
app.use('/api/words', wordRoutes);

// API endpoints for player management
app.use('/api/players', playerRoutes);

// API endpoints for room management
app.use('/api/rooms', roomRoutes);


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Socket.io event handlers
// io.on('connection', (socket) => {
//   console.log(`Client ${socket.id} connected`);

//   // Event listener for 'join room' event
//   socket.on('join room', ({ playerName, team, roomId }) => {
//     console.log(`Client ${socket.id} joined room ${roomId}`);
//     socket.join(roomId);
//     io.to(roomId).emit('player joined', { playerName, team, playerId: socket.id });
//   });

//   // Event listener for 'secret word submit' event
//   socket.on('secret word submit', ({ secretWord, round, roomId }) => {
//     io.to(roomId).emit('secret word received', { secretWord, round });
//   });

//   // Event listener for 'codemasters failed' event
//   socket.on('codemasters failed', (round, roomId) => {
//     io.to(roomId).emit('codemasters failed', round);
//   });

//   // Event listener for 'guess submitted' event
//   socket.on('guess submitted', ({ guess, round, team, roomId }) => {
//     const secretWord = socket.secretWords[round - 1];
//     const guessResult = utils.checkSecretWord(secretWord, guess);
//     io.to(roomId).emit('guess result', { guess, result: guessResult, round, team });
//     if (guessResult === 'correct') {
//       io.to(roomId).emit('game over', { winningTeam: team });
//     }
//   });

//   // Event listener for 'send message' event
//   socket.on('send message', ({ message, playerName, team, roomId }) => {
//     io.to(roomId).emit('message received', { message, playerName, team });
//   });

//   // Event listener for 'disconnect' event
//   socket.on('disconnect', () => {
//     console.log(`Client ${socket.id} disconnected`);
//     io.to(socket.roomId).emit('player left', { playerId: socket.id });
//   });
// });

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
