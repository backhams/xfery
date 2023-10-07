import { configureStore } from "@reduxjs/toolkit";
import variantReducer from "./Slice"; // Import your existing variant slice
import toggleReducer from "./toggleSlice"; // Import the new useClient slice

const store = configureStore({
    reducer: {
        variant: variantReducer,
        toggle: toggleReducer, // Add the new useClient reducer
    },
});

export default store;
