const Room = require('../models/Room');
const Player = require('../models/Player');
const getValidationArray = require('../utils/validateGuess');

const createRoom = async (req, res) => {
  try {
    const { roomId, player_name } = req.body;

    var room_ = await Room.findOne({ roomId });
    if (room_) {
      return res.status(404).send({ message: 'Room already exists! Join it!' });
    }

    var player = await Player.findOne({ name: player_name });

    const room = new Room({ roomId, players: [player], teamAssignments: [{ codemasters: { players: [player] } }] });
    await room.save();

    const newRoom = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();

    res.status(201).json(newRoom);

  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const joinRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { player_name } = req.body;

    var player = await Player.findOne({ name: player_name });
    if (!player) {

      player = new Player({ name:player_name  });
      await player.save();

      // return res.status(404).send({message: 'Player not found'});
    }

    player = await Player.findOne({ name: player_name });


    var room = await Room.findOne({ roomId });
    if (!room) {
       room = new Room({ roomId, players: [player], teamAssignments: [{ codemasters: { players: [player] } }] });
      await room.save();
    }


    // check if user exists in chat
    var playerAlreadyExists = await Room.findOne({
      $and: [
        { roomId: roomId },
        {
          players: { $in: [player._id] },
        },
      ],
    });

    if (playerAlreadyExists ) {

      const newRoom = await Room.findOne({ roomId }).populate({
        path: "players",
        model: "Player",
      })
        .exec();

      return res.status(200).send(newRoom);
    }


    console.log('not reaching here')

    const teamAssignments = room.teamAssignments;
    const number_of_code_masters = room.teamAssignments[teamAssignments.length - 1].codemasters.players.length;
    const number_of_decoders = room.teamAssignments[teamAssignments.length - 1].decoders.players.length;

    if (number_of_code_masters <= number_of_decoders) {
      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { "teamAssignments.$[element].codemasters.players": { _id: player._id }, players: player }
        },

        {
          arrayFilters: [
            {
              "element.round": 1,
            },
          ],
        },
        { returnOriginal: false }
      );
    }
    else {
      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { "teamAssignments.$[element].decoders.players": { _id: player._id }, players: player }
        },
        {
          arrayFilters: [
            {
              "element.round": 1,
            },
          ],
        },
        { returnOriginal: false }
      );
    }

    var newRoom = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();

    res.status(201).send(newRoom);
    res.end()

  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    var room = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();

    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    res.json(room);
  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const deleteRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOneAndDelete({ roomId });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    res.status(200).send({ message: 'Room Deleted' });
  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const updateRoomByGameStart = async (req, res) => {
  try {

    const { player_name } = req.body;
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    var player = await Player.findOne({ name: player_name });
    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }

    const no_of_players = room.players.length;

    // No players on other team --- if players has 1 element
    if (no_of_players <= 1) {
      return res.status(404).send({ message: 'No Members on other team!' });
    }

    const teamAssignments = room.teamAssignments;
    const round = room.teamAssignments[teamAssignments.length - 1].round;

    var playerIsCodeMaster = await Room.aggregate([{ $project: { teamAssignments: { $arrayElemAt: ['$teamAssignments', -1] } } },
    { $match: { 'teamAssignments.codemasters.players': { $in: [player._id] } } }])

    if (playerIsCodeMaster.length != 0) {

      var alreadyStarted = await Room.aggregate([{ $project: { teamAssignments: { $arrayElemAt: ['$teamAssignments', -1] } } },
      { $match: { 'teamAssignments.codemasters.start_game': { $eq: true } } }])
    }
    else {

      var alreadyStarted = await Room.aggregate([{ $project: { teamAssignments: { $arrayElemAt: ['$teamAssignments', -1] } } },
      { $match: { 'teamAssignments.decoders.start_game': { $eq: true } } }])
    }

    if (alreadyStarted.length != 0) {

      var newRoom = await Room.findOne({ roomId }).populate({
        path: "players",
        model: "Player",
      })
        .exec();

      // return res.status(200).send({room: newRoom, message: 'Game already started!'});
      return res.status(200).send(newRoom);
    }

    else {

      if (playerIsCodeMaster.length != 0) {

        await Room.findOneAndUpdate(
          { roomId },
          {
            "teamAssignments.$[element].codemasters.start_game": true
          },
          {
            arrayFilters: [
              {
                "element.round": round,
              },
            ],
          },
          { returnOriginal: false }
        );

      }

      else {

        await Room.findOneAndUpdate(
          { roomId },
          {
            "teamAssignments.$[element].decoders.start_game": true
          },
          {
            arrayFilters: [
              {
                "element.round": round,
              },
            ],
          },
          { returnOriginal: false }
        );

      }

    }


    var newRoom = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();

    const codemasters_started = newRoom.teamAssignments[teamAssignments.length - 1].codemasters.start_game;
    const decoders_started = newRoom.teamAssignments[teamAssignments.length - 1].decoders.start_game;

    // var countDownDate = new Date();
    // countDownDate.setSeconds(countDownDate.getSeconds() + 60);

    // var count_down_passed = false
    // var now = new Date();
    // now.setHours(0, 0, 0, 0);

    // // countDown is passed
    // if (countDownDate < now) {
    //   console.log("Selected date is in the past");
    //   count_down_passed = true
    // } else {
    //   console.log("Selected date is NOT in the past");
    // }

    if (codemasters_started == decoders_started) {

      await Room.findOneAndUpdate(
        { roomId },
        {
          "teamAssignments.$[element].codemasters.start_time": Date.now(),
          "teamAssignments.$[element].codemasters.time_remaining_in_secs": 30,
        },
        {
          arrayFilters: [
            {
              "element.round": round,
            },
          ],
        },
        { returnOriginal: false }
      );

    }

    var newRoom = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();
    return res.status(201).send(newRoom);


  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const updateRoomBySecretWord = async (req, res) => {
  try {

    const { secret_word, player_name } = req.body;
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    var player = await Player.findOne({ name: player_name });
    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }

    const teamAssignments = room.teamAssignments;
    const round = room.teamAssignments[teamAssignments.length - 1].round;
    const start_time = room.teamAssignments[teamAssignments.length - 1].codemasters.start_time;

    var now = new Date();

    // countDown is passed
    // if ((now.getTime() - 30000) > start_time.getTime()) {
    //   // console.log("Selected date is in the past");

    //   await Room.findOneAndUpdate(
    //     { roomId },
    //     {
    //       "teamAssignments.$[element].codemasters.time_remaining_in_secs": 0,
    //     }
    //     ,
    //     {
    //       arrayFilters: [
    //         {
    //           "element.round": round,
    //         },
    //       ],
    //     },
    //     { returnOriginal: false }
    //   );
    //   var newRoom = await Room.findOne({ roomId }).populate({
    //     path: "players",
    //     model: "Player",
    //   })
    //   .exec();
    //   // return res.status(201).send({ room: newRoom, message: "Time's Up!" });
    //   return res.status(201).send(newRoom);

    // }


    // console.log("Selected date is NOT in the past");

    const word_exists = room.teamAssignments[teamAssignments.length - 1].codemasters.secret_word[0];

    var playerIsCodeMaster = await Room.aggregate([{ $project: { teamAssignments: { $arrayElemAt: ['$teamAssignments', -1] } } },
    { $match: { 'teamAssignments.codemasters.players': { $in: [player._id] } } }])

    if (playerIsCodeMaster.length == 0) {
      return res.status(404).send({ message: 'Player is not code master' });
    }

    if (word_exists) {
      return res.status(404).send({ message: 'Word already exists' });
    }

    else {
      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { "teamAssignments.$[element].codemasters.secret_word": secret_word },
          "teamAssignments.$[element].codemasters.time_remaining_in_secs": null,
          "teamAssignments.$[element].decoders.start_time": Date.now(),
          "teamAssignments.$[element].decoders.time_remaining_in_secs": 60,
        },
        {
          arrayFilters: [
            {
              "element.round": round,
            },
          ],
        },
        { returnOriginal: false }
      );

    }
    var newRoom = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();
    return res.status(201).send(newRoom);


  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const updateRoomByGuess = async (req, res) => {
  try {

    const { guess, player_name } = req.body;
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    var player = await Player.findOne({ name: player_name });
    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }

    const teamAssignments = room.teamAssignments;
    const no_of_guesses = room.teamAssignments[teamAssignments.length - 1].decoders.guesses.length;
    const secret_word = room.teamAssignments[teamAssignments.length - 1].codemasters.secret_word[0];
    const round = room.teamAssignments[teamAssignments.length - 1].round;

    var playerIsDecoder = await Room.aggregate([{ $project: { teamAssignments: { $arrayElemAt: ['$teamAssignments', -1] } } },
    { $match: { 'teamAssignments.decoders.players': { $in: [player._id] } } }])

    if (playerIsDecoder.length == 0) {
      return res.status(404).send({ message: 'Player is not decoder' });
    }
    const start_time = room.teamAssignments[teamAssignments.length - 1].decoders.start_time;
    var now = new Date();

    // countDown is passed
    // if ((now.getTime() - 60000) > start_time.getTime()) {
    //   // console.log("Selected date is in the past");

    //   await Room.findOneAndUpdate(
    //     { roomId },
    //     {
    //       "teamAssignments.$[element].decoders.time_remaining_in_secs": 0,
    //     }
    //     ,
    //     {
    //       arrayFilters: [
    //         {
    //           "element.round": round,
    //         },
    //       ],
    //     },
    //     { returnOriginal: false }
    //   );
    //   var newRoom = await Room.findOne({ roomId }).populate({
    //     path: "players",
    //     model: "Player",
    //   })
    //   .exec();
    //   // return res.status(201).send({ room: newRoom, message: "Time's Up!" });
    //   return res.status(201).send(newRoom);

    // }

    if (no_of_guesses >= 5) {

      await Room.findOneAndUpdate(
        { roomId },
        {
          "teamAssignments.$[element].decoders.time_remaining_in_secs": 0,
        }
        ,
        {
          arrayFilters: [
            {
              "element.round": round,
            },
          ],
        },
        { returnOriginal: false }
      );
      var newRoom = await Room.findOne({ roomId });
      // return res.status(201).send({ room: newRoom, message: "Guess limit reached!" });
      return res.status(201).send(newRoom);
    }

    else {

      var guess_output = getValidationArray(guess, secret_word)

      const guessObj = {
        guess,
        // player: player._id,
        guess_output
      }

      // console.log('guess_output', guessObj)

      await Room.findOneAndUpdate(
        { roomId },
        {
          "teamAssignments.$[element].decoders.time_remaining_in_secs": (Math.abs((now.getSeconds()) - (start_time.getSeconds() + 60)) % 60),
          $push: { "teamAssignments.$[element].decoders.guesses": guessObj }
        },
        {
          arrayFilters: [
            {
              "element.round": round,
            },
          ],
        },
        { returnOriginal: false }
      );
    }

    // for correct guess end round
    const incorrect_guess = guess_output.some(letter => letter == '-' || letter == 'O')
    if (!incorrect_guess) {

      await Room.findOneAndUpdate(
        { roomId },
        {
          "teamAssignments.$[element].decoders.time_remaining_in_secs": null,
        }
        ,
        {
          arrayFilters: [
            {
              "element.round": round,
            },
          ],
        },
        { returnOriginal: false }
      );

      var newRoom = await Room.findOne({ roomId }).populate({
        path: "players",
        model: "Player",
      })
        .exec();
      // return res.status(201).send({ room: newRoom, message: "Correct Guess" });
      return res.status(201).send(newRoom);
    }
    var newRoom = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();
    return res.status(201).send(newRoom);

  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const updateRoomByRoundAndPoints = async (req, res) => {
  try {

    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }

    const teamAssignments = room.teamAssignments;
    const decoders_ = room.teamAssignments[teamAssignments.length - 1].decoders;
    const codemasters_ = room.teamAssignments[teamAssignments.length - 1].codemasters;
    const round = room.teamAssignments[teamAssignments.length - 1].round;

    // update scores logic
    const decoders_win = decoders_.guesses.length > 1 ? decoders_.guesses.some(guessObj => !guessObj.guess_output.includes('-')) : false

    // create new Assignment
    if (round < 6) {

      var newTeamAssignment = {
        codemasters: {
          players: round != 3 ? codemasters_.players : decoders_.players,
          secret_word: [],
          team_score: round != 3 ? (decoders_win ? codemasters_.team_score : (codemasters_.team_score + 10)) : (decoders_win ? (decoders_.team_score + 10) : decoders_.team_score)
        },

        decoders: {
          players: round != 3 ? decoders_.players : codemasters_.players,
          guesses: [],
          team_score: round != 3 ? (decoders_win ? (decoders_.team_score + 10) : decoders_.team_score) : (decoders_win ? codemasters_.team_score : (codemasters_.team_score + 10))
        },

        round: round + 1
      }

      await Room.findOneAndUpdate(
        { roomId },
        {
          $push: { teamAssignments: newTeamAssignment }
        },
        { returnOriginal: false }
      );

    }
    // update points on last assignment and game over
    else {

      await Room.findOneAndUpdate(
        { roomId },
        {
          gameOver: true, winner: ((decoders_win ? codemasters_.team_score : (codemasters_.team_score + 10)) > (decoders_win ? (decoders_.team_score + 10) : decoders_.team_score)) ? "codemasters" : "decoders",
          "teamAssignments.$[element].codemasters.team_score": (decoders_win ? codemasters_.team_score : (codemasters_.team_score + 10)),
          "teamAssignments.$[element].decoders.team_score": (decoders_win ? (decoders_.team_score + 10) : decoders_.team_score)
        },
        {
          arrayFilters: [
            {
              "element.round": round,

            },
          ],
        }, { returnOriginal: false }
      );

    }

    var newRoom = await Room.findOne({ roomId }).populate({
      path: "players",
      model: "Player",
    })
      .exec();
    return res.status(201).send(newRoom);

  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (ex) {
    for (field in ex.errors) {
      res.status(400).send(ex.errors[field].message);
    }
    res.end();
    return;
  }
};

module.exports = {
  createRoom,
  joinRoomById,
  getRoomById,
  deleteRoomById,
  updateRoomByGameStart,
  updateRoomBySecretWord,
  updateRoomByGuess,
  updateRoomByRoundAndPoints,
  updateRoom
};


