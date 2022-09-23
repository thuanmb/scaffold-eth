import { createSlice } from "@reduxjs/toolkit";

const appMode = process.env.APP_CONFIG_MODE ? process.env.APP_CONFIG_MODE : "debug";

export const appConfigSlice = createSlice({
  name: "appConfig",
  initialState: {
    appMode: appMode,
  },
  reducers: {},
});

export const isDebugMode = state => state.appConfig.appMode === "debug";

export default appConfigSlice.reducer;
