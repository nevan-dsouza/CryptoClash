import { createSlice } from "@reduxjs/toolkit";
import {
  createPlayer,
  getPlayerByID,
  getPlayerByName,
  updatePlayer,
  deletePlayer,
} from "./playerActions";

// initialize userToken from local storage
const playerInfo = JSON.parse(localStorage.getItem("playerInfo"))
  ? JSON.parse(localStorage.getItem("playerInfo"))
  : null;

const initialState = {
  loading: false,
  playerInfo,
  success: false,
  error: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("playerInfo"); // delete token from storage
      state.loading = false;
      state.userInfo = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: {
    // create player
    [createPlayer.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    [createPlayer.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.playerInfo = payload;
      state.success = true;

    },
    [createPlayer.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },

    //getPlayer
    [getPlayerByID.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    [getPlayerByID.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.playerInfo = payload;
      state.success = true;

    },
    [getPlayerByID.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },

    //getPlayer By Name
    [getPlayerByName.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    [getPlayerByName.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.playerInfo = payload;
      state.success = true;

    },
    [getPlayerByName.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },

     //updatePlayer
     [updatePlayer.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    [updatePlayer.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.playerInfo = payload;
      state.success = true;

    },
    [updatePlayer.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },


     //deletePlayer
     [deletePlayer.pending]: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    [deletePlayer.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.playerInfo = null;
      state.success = true;

    },
    [deletePlayer.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },

  },
});

export const { logout } = playerSlice.actions;

export default playerSlice.reducer;
