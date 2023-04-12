const Room = require('../models/Room');
const Player = require('../models/Player');


const createRoom = async (req, res) => {
  try {
    const { roomId, player_name } = req.body;
    console.log(`roomID: ${roomId}`)

    var player = await Player.findOne({ name: player_name });

    const room = new Room({ roomId, players: [player], teamAssignments: [{ codemasters: { players: [player] } }] });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const joinRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { player_name } = req.body;

    var room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).send('Room not found');
    }

    var player = await Player.findOne({ name: player_name });
    if (!player) {
      return res.status(404).send('Player not found');
    }

    const teamAssignments = room.teamAssignments;
    const number_of_code_masters = room.teamAssignments[teamAssignments.length - 1].codemasters.players.length;
    const number_of_decoders = room.teamAssignments[teamAssignments.length - 1].decoders.players.length;

    if (number_of_code_masters <= number_of_decoders) {
      room = await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { players: player },
          // $push: { teamAssignments: [{ codemasters: { players: [player] } }] },
        },
        { returnOriginal: false }
      )
    }
    else{
      room = await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { players: player },
          $push: { teamAssignments: [{ decoders: { players: [player] } }] },
        },
        { returnOriginal: false }
      )
    }

    console.log('code masters no.', room.teamAssignments[teamAssignments.length - 1].codemasters.players.length)
    console.log('decoders no.', room.teamAssignments[teamAssignments.length - 1].decoders.players.length)

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).send('Room not found');
    }
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const deleteRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOneAndDelete({ roomId });
    if (!room) {
      return res.status(404).send('Room not found');
    }
    res.status(200).send('Room Deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

module.exports = {
  createRoom,
  joinRoomById,
  getRoomById,
  updateRoom,
  deleteRoomById
};


