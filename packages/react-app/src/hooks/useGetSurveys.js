import { useCallback } from "react";

import { useDispatch } from "react-redux";
import { useContractReader } from "eth-hooks";

import { setSurveyList, setSurveyLoading } from "../store/surveysSlice";
import { surveyListFormatter } from "../helpers/surveyUtils";

const useGetSurveys = readContracts => {
  const dispatch = useDispatch();

  const onGetSurveyListChange = useCallback(
    value => {
      if (value !== undefined) {
        dispatch(setSurveyList(value));
        dispatch(setSurveyLoading(false));
      } else {
        dispatch(setSurveyLoading(true));
      }
    },
    [dispatch],
  );
  const surveyList = useContractReader(
    readContracts,
    "SurveyContract",
    "getSurveyList",
    [],
    3,
    surveyListFormatter,
    onGetSurveyListChange,
  );

  return surveyList;
};

export default useGetSurveys;
