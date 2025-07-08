import { configureStore } from "@reduxjs/toolkit";
import { noteReducer } from "../src/Redux/NoteAppRedux";

const reducer = {
  noteReducer,
};

export const store = configureStore({
  reducer: reducer,
});
