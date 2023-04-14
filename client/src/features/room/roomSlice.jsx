import { createSlice } from "@reduxjs/toolkit";

import {
    createRoom,
    getRoom,
    joinRoom,
    updateRoomByGameStart,
    updateRoomBySecretWord,
    updateRoomByGuess,
    updateRoomByRoundPoints

  } from "./roomActions";

  // initialize userToken from local storage
const room = JSON.parse(localStorage.getItem("room"))
? JSON.parse(localStorage.getItem("room"))
: null;


const initialState = {
    loading: false,
    room,
    success: null,
    error: null,
  };

  const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
      deleteRoom: (state) => {
        state.loading = false;
        state.room = null;
        state.success = null;
        state.error = null;
      },
    },
    extraReducers: {
      // create room
      [createRoom.pending]: (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      },
      [createRoom.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.room = payload;
        state.success = true;
      },
      [createRoom.rejected]: (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.room = null;
        state.success = null;
      },

      // get room
      [getRoom.pending]: (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      },
      [getRoom.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.room = payload;
        state.success = true;
      },
      [getRoom.rejected]: (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.room = null;
        state.success = null;
      },


       // join room
       [joinRoom.pending]: (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      },
      [joinRoom.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.room = payload;
        state.success = true;
      },
      [joinRoom.rejected]: (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.room = null;
        state.success = null;
      },


      // updateRoom By Game Start
      [updateRoomByGameStart.pending]: (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      },
      [updateRoomByGameStart.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.room = payload;
        state.success = true;
      },
      [updateRoomByGameStart.rejected]: (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = null;
      },


      // updateRoom By Secret Word
      [updateRoomBySecretWord.pending]: (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      },
      [updateRoomBySecretWord.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.room = payload;
        state.success = true;
      },
      [updateRoomBySecretWord.rejected]: (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = null;
      },


      // updateRoom By Guess
      [updateRoomByGuess.pending]: (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      },
      [updateRoomByGuess.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.room = payload;
        state.success = true;
      },
      [updateRoomByGuess.rejected]: (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = null;
      },
  
      // updateRoom By Round Points
      [updateRoomByRoundPoints.pending]: (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      },
      [updateRoomByRoundPoints.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.room = payload;
        state.success = true;
      },
      [updateRoomByRoundPoints.rejected]: (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = null;
      },
    },
  });
  
  export const { deleteRoom } = roomSlice.actions;
  
  export default roomSlice.reducer;
  