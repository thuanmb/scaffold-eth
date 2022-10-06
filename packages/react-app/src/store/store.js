import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "./networkSlice";
import accountReducer from "./accountSlice";
import appConfigReducer from "./appConfigSlice";
import surveysReducer from "./surveysSlice";

export default configureStore({
  reducer: {
    network: networkReducer,
    account: accountReducer,
    appConfig: appConfigReducer,
    surveys: surveysReducer,
  },
});
