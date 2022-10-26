import React, { useCallback, useState } from "react";
import { PageHeader, Button } from "antd";
import { ethers } from "ethers";

import { TextInlineEdit } from "../components/InlineEdit";

import "./SurveyCreatePage.css";

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
const SurveyCreatePage = ({ writeContracts, tx }) => {
  const [surveyTitle, setSurveyTitle] = useState("Survey Title");
  const [surveyDescription, setSurveyDescription] = useState("Description");

  const onCreateNewSurvey = useCallback(async () => {
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
  }, [writeContracts, tx]);
  return (
    <PageHeader ghost={false} onBack={() => window.history.back()} title="Create Survey">
      <div className="scp-page">
        <div className="scp-page__content">
          <div className="scp-page__body">
            <TextInlineEdit className="h3" value={surveyTitle} setValue={setSurveyTitle} />
            <TextInlineEdit value={surveyDescription} setValue={setSurveyDescription} />
          </div>
        </div>
      </div>
    </PageHeader>
  );
};

export default SurveyCreatePage;
