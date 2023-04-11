const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  teamAssignments: [{ type: Object }],
  winner: { type: String },
  gameOver: { type: Boolean, default: false },
  guesses: [{ type: Object }],
  secretWord: [{ type: String }],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
