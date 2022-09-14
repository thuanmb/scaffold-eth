import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    address: null,
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress } = accountSlice.actions;

export const getAddress = state => state.account.address;

export default accountSlice.reducer;
