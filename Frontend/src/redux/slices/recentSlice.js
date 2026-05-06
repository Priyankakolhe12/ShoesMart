import { createSlice } from "@reduxjs/toolkit";

/* LOAD */
const loadRecent = () => {
  try {
    const data = localStorage.getItem("recent");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const recentSlice = createSlice({
  name: "recent",
  initialState: {
    items: loadRecent(),
  },
  reducers: {
    addRecent: (state, action) => {
      const product = action.payload;

      state.items = state.items.filter((i) => i.id !== product.id);
      state.items.unshift(product);
      state.items = state.items.slice(0, 6);
    },
  },
});

export const { addRecent } = recentSlice.actions;
export default recentSlice.reducer;

/* LISTENER */
export const setupRecentListener = (store) => {
  store.subscribe(() => {
    try {
      const state = store.getState();
      localStorage.setItem("recent", JSON.stringify(state.recent.items));
    } catch (e) {
      console.error("Recent save failed", e);
    }
  });
};
