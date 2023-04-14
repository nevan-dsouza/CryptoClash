import { configureStore } from "@reduxjs/toolkit";

import playerReducer from "../features/player/playerSlice";
import roomReducer from "../features/room/roomSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    room: roomReducer,
  },
});
