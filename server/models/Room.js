const mongoose = require('mongoose');

// const roomSchema = new mongoose.Schema({
//   roomId: { type: String, required: true, unique: true },
//   players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
//   teamAssignments: [{ type: Object }],
//   winner: { type: String },
//   gameOver: { type: Boolean, default: false },
//   guesses: [{ type: Object }],
//   secretWord: [{ type: String }],
//   created: { type: Date, default: Date.now }
// });


const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  teamAssignments: [
    {
      codemasters: {
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
        secret_word: { type: String },
        team_score: {
          type: Number,
          default: 0,
        }
      },
      decoders: {
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
        guesses: [{
          guess: { type: String },
          player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
          correct_letters: [{ type: String, maxLength: 1 }],
          misplaced_letters: [{ type: String, maxLength: 1 }]
        }],
        team_score: {
          type: Number,
          default: 0,
        }
      },
      round: {
        type: Number,
        default: 1,
      },
      time_stamp: { type: Date, default: Date.now },
    },
  ],
  winner: { type: String },
  gameOver: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);
