import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "./networkSlice";
import accountReducer from "./accountSlice";
import appConfigReducer from "./appConfigSlice";

export default configureStore({
  reducer: {
    network: networkReducer,
    account: accountReducer,
    appConfig: appConfigReducer,
  },
});
