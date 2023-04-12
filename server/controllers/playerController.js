const Player = require('../models/Player');

const createPlayer = async (req, res) => {
  try {
    const { name } = req.body;
    const player = new Player({ name });
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).send('Player not found');
    }
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const deletePlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findByIdAndDelete(id);
    if (!player) {
      return res.status(404).send('Player not found');
    }
    res.status(200).send('Player deleted!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const updatePlayerById = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update player' });
  }
};

module.exports = {
  createPlayer,
  getPlayerById,
  deletePlayerById,
  updatePlayerById
}
