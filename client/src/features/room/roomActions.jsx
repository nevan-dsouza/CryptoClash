import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createRoom = createAsyncThunk(
    "room/createRoom",
    async ({ roomId, player_name }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                `api/rooms`,
                { roomId, player_name },
                config
            );

            localStorage.removeItem("room");
            localStorage.setItem("room", JSON.stringify(data));

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

export const getRoom = createAsyncThunk(
    "room/getRoom",
    async ({ roomId }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.get(
                `api/rooms/${roomId}`,
                config
            );

            localStorage.removeItem("room");
            localStorage.setItem("room", JSON.stringify(data));

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

export const joinRoom = createAsyncThunk(
    "chat/joinRoom",
    async ({ player_name, roomId }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                `api/rooms/${roomId}`, { player_name },
                config
            );

            localStorage.removeItem("room");
            localStorage.setItem("room", JSON.stringify(data));

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

export const updateRoomByGameStart = createAsyncThunk(
    "chat/updateRoomByGameStart",
    async ({ player_name, roomId }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.put(
                `api/rooms/start/${roomId}`, { player_name },
                config
            );

            localStorage.removeItem("room");
            localStorage.setItem("room", JSON.stringify(data));


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

export const updateRoomBySecretWord = createAsyncThunk(
    "chat/updateRoomBySecretWord",
    async ({ player_name, secret_word, roomId }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.put(
                `api/rooms/secret/${roomId}`, { player_name, secret_word },
                config
            );

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

export const updateRoomByGuess = createAsyncThunk(
    "chat/updateRoomByGuess",
    async ({ player_name, guess, roomId }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.put(
                `api/rooms/guess/${roomId}`, { player_name, guess },
                config
            );

            localStorage.removeItem("room");
            localStorage.setItem("room", JSON.stringify(data));

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

export const updateRoomByRoundPoints = createAsyncThunk(
    "chat/updateRoomByRoundPoints",
    async ({ roomId }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.put(
                `api/rooms/round/${roomId}`, {},
                config
            );

            localStorage.removeItem("room");
            localStorage.setItem("room", JSON.stringify(data));


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