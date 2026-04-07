import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import kycReducer from "./slices/kycSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    kyc: kycReducer,
  },
});
