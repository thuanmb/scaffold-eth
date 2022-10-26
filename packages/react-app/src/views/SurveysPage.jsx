import React from "react";
import { PageHeader, Button } from "antd";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { getSurveyList, getSurveyLoading } from "../store/surveysSlice";

import SurveyList from "./SurveyList";

const SurveysPage = ({ mainnetProvider, blockExplorer }) => {
  const surveyData = useSelector(getSurveyList);
  const isLoading = useSelector(getSurveyLoading);
  const history = useHistory();

  const onCreateNewSurvey = () => {
    history.push("/createSurvey");
  };
  return (
    <PageHeader
      ghost={false}
      // onBack={() => window.history.back()}
      title="Your Surveys"
      extra={[
        <Button key="1" type="primary" onClick={onCreateNewSurvey}>
          Create New Survey
        </Button>,
      ]}
    >
      <div className="site-layout-content">
        <SurveyList
          surveyData={surveyData}
          isLoading={isLoading}
          mainnetProvider={mainnetProvider}
          blockExplorer={blockExplorer}
        />
      </div>
    </PageHeader>
  );
};

export default SurveysPage;
