"use client"

import { createSlice } from "@reduxjs/toolkit";

const variantIdSlice = createSlice({
  name: "variantId",
  initialState: "", // Use an empty string as the initial state
  reducers: {
    setVariantData(state, action) {
      return action.payload; // Update the state with the payload (a string)
    },
  },
});

export const { setVariantData } = variantIdSlice.actions;
export default variantIdSlice.reducer;

