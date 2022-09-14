import { createSlice } from "@reduxjs/toolkit";

import { INITIAL_NETWORK, NETWORKS } from "../constants";

export const networkSlice = createSlice({
  name: "network",
  initialState: {
    selectedNetwork: INITIAL_NETWORK,
    targetNetwork: NETWORKS[INITIAL_NETWORK],
  },
  reducers: {
    setSelectedNetwork: (state, action) => {
      state.selectedNetwork = action.payload;
      state.targetNetwork = NETWORKS[action.payload];
    },
  },
});

export const { setSelectedNetwork } = networkSlice.actions;

export const getTargetNetwork = state => state.network.targetNetwork;

export default networkSlice.reducer;
