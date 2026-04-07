import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: {},
  preview: {},
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setFile: (state, action) => {
      const { key, file, preview } = action.payload;
      state.files[key] = file;
      state.preview[key] = preview;
    },

    removeFile: (state, action) => {
      delete state.files[action.payload];
      delete state.preview[action.payload];
    },
  },
});

export const { setFile, removeFile } = kycSlice.actions;
export default kycSlice.reducer;
