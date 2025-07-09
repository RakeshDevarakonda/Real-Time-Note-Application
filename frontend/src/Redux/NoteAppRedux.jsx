import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],
  selectedNote: null,
  userDetail: null,
  newNoteTitle: "",
  activeUsers: [],
};

const noteSlice = createSlice({
  name: "notes",
  initialState: initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    addNote: (state, action) => {
      state.notes.unshift(action.payload);
    },
    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetail = action.payload;
    },
    setNewNoteTitle: (state, action) => {
      state.newNoteTitle = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    updateNoteContent: (state, action) => {
      if (state.selectedNote) {
        state.selectedNote.content = action.payload;
      }
    },
    updateContributors: (state, action) => {
      if (state.selectedNote) {
        state.selectedNote.contributors = action.payload;
      }
    },
  },
});

export const noteReducer = noteSlice.reducer;

export const {
  updateContributors,
  setNewNoteTitle,
  setUserDetails,
  setSelectedNote,
  addNote,
  setNotes,
  setActiveUsers,
  updateNoteContent,
} = noteSlice.actions;

export const noteSelector = (state) => state.noteReducer;
