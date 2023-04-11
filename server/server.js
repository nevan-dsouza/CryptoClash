require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const playerRoutes = require('./routes/playerRoutes');
const roomRoutes = require('./routes/roomRoutes');
const wordRoutes = require('./routes/wordRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the build folder from the client
app.use(express.static('client/build'));

// Parse JSON requests
app.use(express.json());

const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = process.env.ATLAS_URI;
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

run().catch(console.dir);

// mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log(err));


// API endpoint to generate random words
app.use('/api/words', wordRoutes);


// API endpoints for player management
app.post('/api/players', playerRoutes.createPlayer);
app.get('/api/players/:id', playerRoutes.getPlayerById);
app.put('/api/players/:id', playerRoutes.updatePlayer);
app.delete('/api/players/:id', playerRoutes.deletePlayerById);

// API endpoints for room management
app.post('/api/rooms', roomRoutes.createRoom);
app.get('/api/rooms/:id', roomRoutes.getRoomById);
app.put('/api/rooms/:id', roomRoutes.updateRoom);
app.delete('/api/rooms/:id', roomRoutes.deleteRoomById);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Event listener for 'join room' event
  socket.on('join room', ({ playerName, team, roomId }) => {
    console.log(`Client ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit('player joined', { playerName, team, playerId: socket.id });
  });

  // Event listener for 'secret word submit' event
  socket.on('secret word submit', ({ secretWord, round, roomId }) => {
    io.to(roomId).emit('secret word received', { secretWord, round });
  });

  // Event listener for 'codemasters failed' event
  socket.on('codemasters failed', (round, roomId) => {
    io.to(roomId).emit('codemasters failed', round);
  });

  // Event listener for 'guess submitted' event
  socket.on('guess submitted', ({ guess, round, team, roomId }) => {
    const secretWord = socket.secretWords[round - 1];
    const guessResult = utils.checkSecretWord(secretWord, guess);
    io.to(roomId).emit('guess result', { guess, result: guessResult, round, team });
    if (guessResult === 'correct') {
      io.to(roomId).emit('game over', { winningTeam: team });
    }
  });

  // Event listener for 'send message' event
  socket.on('send message', ({ message, playerName, team, roomId }) => {
    io.to(roomId).emit('message received', { message, playerName, team });
  });

  // Event listener for 'disconnect' event
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
    io.to(socket.roomId).emit('player left', { playerId: socket.id });
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
