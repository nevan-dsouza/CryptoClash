const Room = require('../models/Room');

const createRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    console.log(`roomID: ${roomId}`)
    const room = new Room({ roomId });
    await room.save();
    res.status(201).json(room);
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
    res.sendStatus(204);
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
  createRoom ,
  getRoomById,
  updateRoom,
  deleteRoomById
};
  

