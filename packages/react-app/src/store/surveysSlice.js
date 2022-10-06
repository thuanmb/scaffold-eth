import { createSlice } from "@reduxjs/toolkit";

export const surveysSlice = createSlice({
  name: "surveys",
  initialState: {
    surveyList: [],
    isLoading: false,
  },
  reducers: {
    setSurveyList: (state, action) => {
      state.surveyList = action.payload;
    },
    setSurveyLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSurveyList, setSurveyLoading } = surveysSlice.actions;

export const getSurveyList = state => state.surveys.surveyList;

export const getSurveyLoading = state => state.surveys.isLoading;

export default surveysSlice.reducer;
