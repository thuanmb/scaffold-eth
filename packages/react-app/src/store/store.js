import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "./networkSlice";
import accountReducer from "./accountSlice";

export default configureStore({
  reducer: {
    network: networkReducer,
    account: accountReducer,
  },
});
