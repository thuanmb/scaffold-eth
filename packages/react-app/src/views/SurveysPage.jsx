import React from "react";
import { PageHeader, Button } from "antd";
import { ethers } from "ethers";

import { useSelector } from "react-redux";

import { getSurveyList, getSurveyLoading } from "../store/surveysSlice";

import SurveyList from "./SurveyList";

const toHexString = jsonObj => {
  let jsonStr = JSON.stringify(jsonObj);
  let bytesArr = ethers.utils.toUtf8Bytes(jsonStr);
  let hexStr = ethers.utils.hexlify(bytesArr);
  return hexStr;
};

const SAMPLE_SURVEY_DESCRIPTOR = {
  title: "Test Survey 1",
  description: "This is a sample survey",
  question: [
    {
      id: 1,
      title: "What is your name?",
      type: "text",
      options: null,
      required: true,
    },
    {
      id: 2,
      title: "What is day of birth?",
      type: "datetime",
      options: null,
      required: false,
    },
    {
      id: 3,
      title: "What is your favourite pets?",
      type: "checkbox",
      options: [
        { id: 1, title: "Dog" },
        { id: 2, title: "Cat" },
        { id: 3, title: "Turtle" },
      ],
      required: true,
    },
    {
      id: 4,
      title: "What is your favourite color?",
      type: "select",
      options: [
        { id: 1, title: "Red" },
        { id: 2, title: "Green" },
        { id: 3, title: "Blue" },
      ],
      required: false,
    },
    {
      id: 5,
      title: "What is your favourite programming language?",
      type: "radio",
      options: [
        { id: 1, title: "C++" },
        { id: 2, title: "Java" },
        { id: 3, title: "Javascript" },
        { id: 4, title: "Golang" },
        { id: 5, title: "Python" },
      ],
      required: true,
    },
  ],
};
const SurveysPage = ({ writeContracts, tx }) => {
  const surveyData = useSelector(getSurveyList);
  const isLoading = useSelector(getSurveyLoading);
  return (
    <PageHeader
      ghost={false}
      onBack={() => window.history.back()}
      title="Title"
      subTitle="This is a subtitle"
      extra={[
        <Button
          key="3"
          onClick={async () => {
            const surveyDescriptor = toHexString(SAMPLE_SURVEY_DESCRIPTOR);
            const result = tx(writeContracts.SurveyContract.createSurvey(surveyDescriptor, 0, [], 0), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(await result);
          }}
        >
          Operation 1
        </Button>,
        <Button key="2">Operation</Button>,
        <Button key="1" type="primary">
          Primary
        </Button>,
      ]}
    >
      <div className="site-layout-content">
        <SurveyList surveyData={surveyData} isLoading={isLoading} />
      </div>
    </PageHeader>
  );
};

export default SurveysPage;
