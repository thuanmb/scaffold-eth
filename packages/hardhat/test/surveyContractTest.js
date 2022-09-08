const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const toHexString = (jsonObj) => {
  let jsonStr = JSON.stringify(jsonObj);
  let bytesArr = ethers.utils.toUtf8Bytes(jsonStr);
  let hexStr = ethers.utils.hexlify(bytesArr);
  return hexStr;
};

const toJSONObj = (hexStr) => {
  let bytesArr = ethers.utils.arrayify(hexStr);
  let jsonStr = ethers.utils.toUtf8String(bytesArr);
  let jsonObj = JSON.parse(jsonStr);
  return jsonObj;
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

const SAMPLE_RESPONSE_ANSWER = [
  {
    questionId: 1,
    answer: "Survey Master",
  },
  {
    questionId: 2,
    answer: "1993-08-02 00:00:00+07:00",
  },
  {
    questionId: 3,
    answer: [
      { id: 1, title: "Dog" },
      { id: 2, title: "Cat" },
    ],
  },
  {
    questionId: 4,
    answer: { id: 2, title: "Green" },
  },
  {
    questionId: 5,
    answer: { id: 4, title: "Golang" },
  },
];

let currentNonce = 1;
let publicSurveyId;
let privateSurveyId;

describe("Test ETH Poller", function() {
  let surveyContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("SurveyContract", function() {
    it("Should deploy SurveyContract", async function() {
      const SurveyContract = await ethers.getContractFactory("SurveyContract");

      surveyContract = await SurveyContract.deploy();
    });

    describe("createSurvey()", function() {
      it("Should revert the survey creation with error invalid survey descriptor", async function() {});
      it("Should revert the survey creation with error invalid survey mode", async function() {});

      it("Should be able to create a new survey", async function() {
        const surveyDescriptor = toHexString(SAMPLE_SURVEY_DESCRIPTOR);
        const surveyMode = 0; // "public"

        const expectedId = currentNonce;
        const expectedDescriptor = surveyDescriptor;

        expect(await surveyContract.createSurvey(surveyDescriptor, surveyMode, [], 0))
          .to.emit(surveyContract, "CreateSurvey")
          .withArgs(expectedId, surveyMode, expectedDescriptor, [], 0);

        publicSurveyId = expectedId;
        currentNonce++;

        const surveyList = await surveyContract.getSurveyList();
        expect(surveyList.length).to.equal(1);
        expect(toJSONObj(surveyList[0]["descriptor"])).to.deep.equal(SAMPLE_SURVEY_DESCRIPTOR);
      });

      it("Should be able to create another survey", async function() {
        const [owner] = await ethers.getSigners();

        const surveyDescriptor = toHexString({ title: "Test Survey 2", question: [] });
        const surveyMode = 1; // private
        const pollsters = [await owner.getAddress()];
        const expireAt = parseInt(new Date().getTime() / 1000 + 30);

        const expectedId = currentNonce;
        const expectedDescriptor = surveyDescriptor;

        expect(await surveyContract.createSurvey(surveyDescriptor, surveyMode, pollsters, expireAt))
          .to.emit(surveyContract, "CreateSurvey")
          .withArgs(expectedId, surveyMode, expectedDescriptor, pollsters, expireAt);

        privateSurveyId = expectedId;
        currentNonce++;

        const surveyList = await surveyContract.getSurveyList();
        expect(surveyList.length).to.equal(2);
        expect(toJSONObj(surveyList[0]["descriptor"])["title"]).to.equal("Test Survey 1");
        expect(toJSONObj(surveyList[1]["descriptor"])["title"]).to.equal("Test Survey 2");
      });

      it("Should not be able to submit the private survey", async function() {
        const [owner, otherAccount] = await ethers.getSigners();
        await expect(surveyContract.connect(otherAccount).submitResponse(privateSurveyId, "0x00")).to.be.revertedWith(
          "SurveyContract::submitResponse - sender does not allow to submit this survey!"
        );
      });

      it("Should not be able to submit the response after it is expired", async function() {
        // create another survey which end right after that
        const surveyDescriptor = toHexString(SAMPLE_SURVEY_DESCRIPTOR);
        const surveyMode = 0; // public
        const expireAt = parseInt(new Date().getTime() / 1000);

        const expectedId = currentNonce;

        expect(await surveyContract.createSurvey(surveyDescriptor, surveyMode, [], expireAt))
          .to.emit(surveyContract, "CreateSurvey")
          .withArgs(expectedId, surveyMode, surveyDescriptor, [], expireAt);
        currentNonce++;

        await network.provider.send("evm_increaseTime", [1 /* 1 second */]);
        await network.provider.send("evm_mine");

        // try submit the ended survey
        await expect(surveyContract.submitResponse(expectedId, "0x00")).to.be.revertedWith(
          "SurveyContract::submitResponse - the survey is ended."
        );
      });

      it("Should be able to submit the response", async function() {
        const [owner] = await ethers.getSigners();

        const surveyDescriptor = toHexString(SAMPLE_SURVEY_DESCRIPTOR);
        const answer = toHexString(SAMPLE_RESPONSE_ANSWER);

        const expectedResponseId = currentNonce;
        const expectedPollster = await owner.getAddress();

        expect(await surveyContract.submitResponse(publicSurveyId, answer))
          .to.emit(surveyContract, "SubmitResponse")
          .withArgs(expectedResponseId, publicSurveyId, expectedPollster, answer);

        currentNonce++;

        const responseList = await surveyContract.getResponsesBySurvey(publicSurveyId);
        expect(responseList.length).to.equal(1);
        expect(toJSONObj(responseList[0]["answer"])).to.deep.equal(SAMPLE_RESPONSE_ANSWER);
      });

      it("Should not be able to submit the response twice", async function() {
        await expect(surveyContract.submitResponse(publicSurveyId, "0x00")).to.be.revertedWith(
          "SurveyContract::submitResponse - sender already summitted response."
        );
      });
    });
  });
});
