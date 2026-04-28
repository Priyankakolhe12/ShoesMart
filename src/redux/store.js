import { configureStore } from "@reduxjs/toolkit";

import cartReducer, { setupCartListener } from "./slices/cartSlice";
import kycReducer, { setupKycListener } from "./slices/kycSlice";
import recentReducer, { setupRecentListener } from "./slices/recentSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    kyc: kycReducer,
    recent: recentReducer,
  },

  devTools: import.meta.env.MODE !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["kyc/setFile"],
        ignoredPaths: ["kyc.documents"],
      },
    }),
});

/* 🔥 PERSISTENCE */
setupCartListener(store);
setupKycListener(store);
setupRecentListener(store);
