const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router
    .post('/', roomController.createRoom)
    .post('/:roomId', roomController.joinRoomById)
    .get('/:roomId', roomController.getRoomById)
    .put('/:id', roomController.updateRoom)
    .delete('/:roomId', roomController.deleteRoomById);

// module.exports = {
//     createRoom: router.post,
//     getRoomById: router.get,
//     updateRoom: router.put,
//     deleteRoomById: router.delete,
// };

module.exports = router
