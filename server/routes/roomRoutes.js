const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router
    .post('/', roomController.createRoom)
    .post('/:roomId', roomController.joinRoomById)
    .get('/:roomId', roomController.getRoomById)
    .put('/secret/:roomId', roomController.updateRoomBySecretWord)
    .put('/start/:roomId', roomController.updateRoomByGameStart)
    .put('/guess/:roomId', roomController.updateRoomByGuess)
    .put('/round/:roomId', roomController.updateRoomByRoundAndPoints)
    .put('/:id', roomController.updateRoom)
    .delete('/:roomId', roomController.deleteRoomById);

// module.exports = {
//     createRoom: router.post,
//     getRoomById: router.get,
//     updateRoom: router.put,
//     deleteRoomById: router.delete,
// };

module.exports = router
