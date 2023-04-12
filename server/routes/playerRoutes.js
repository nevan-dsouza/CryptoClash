const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router
    .post('/', playerController.createPlayer)
    .get('/:id', playerController.getPlayerById)
    .put('/:id', playerController.updatePlayerById)
    .delete('/:id', playerController.deletePlayerById);

// module.exports = {
//     createPlayer: router.post,
//     getPlayerById: router.get,
//     updatePlayer: router.put,
//     deletePlayerById: router.delete,
// }

module.exports = router;
