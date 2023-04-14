import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createPlayer = createAsyncThunk(
  "player/createPlayer",
  async ({ name }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/players/`,
        { name },
        config
      );

      console.log('data', data)
      // store user's token in local storage
      localStorage.setItem("playerInfo", JSON.stringify(data));

      return data;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const getPlayerByName = createAsyncThunk(
  "player/createPlayer",
  async ({ name }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/players/name`,
        { name },
        config
      );
      
      // store user's token in local storage
      localStorage.setItem("playerInfo", JSON.stringify(data));

      return data;
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getPlayerByID = createAsyncThunk(
  "player/getPlayerByID",
  async (args, { getState, rejectWithValue }) => {
    try {

        // get user data from store
        const { name } = getState();

      // configure authorization header with user's token
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.get(`/api/players/${name}`, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updatePlayer = createAsyncThunk(
  "player/updatePlayer",
  async ({ name }, { getState, rejectWithValue }) => {
    try {
      // get user data from store
      const { player } = getState();

      // configure authorization header with user's token
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.put(`/api/players/${player._id}`, { name }, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const deletePlayer = createAsyncThunk(
  "player/deletePlayer",
  async (arg, { getState, rejectWithValue }) => {
    try {
      // get user data from store
      const { player } = getState();

      // configure authorization header with user's token
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.delete(`/api/players/${player._id}`, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
