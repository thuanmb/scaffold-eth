pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

enum SurveyMode {
  Public,
  Private,
  Unknown
}

struct Survey {
  uint256 id;
  uint createdAt;
  SurveyMode mode;
  string descriptor;
  address[] pollsters;
  uint expireAt;
}

struct Response {
  uint256 id;
  uint createdAt;
  uint256 surveyId;
  address pollster;
  string answer;
}

contract SurveyContract {

  uint256 public nonce = 1;
  mapping(uint256 => Survey) public surveysByIdMap;
  mapping(address => uint256[]) public surveysByCreatorMap;
  mapping(uint256 => Response[]) public responsesMap;
  mapping(uint256 => mapping(address => bool)) public submittedSurveyMap;

  event CreateSurvey(uint256 id, uint mode, string descriptor, address[] pollsters, uint expireAt);
  event SubmitResponse(uint256 id, uint256 surveyId, address pollster, string answer);

  constructor() { }

  function getSurveyModeFromUint(uint surveyMode) private pure returns(SurveyMode) {
    if (surveyMode == 0) {
      return SurveyMode.Public;
    }
    if (surveyMode == 1) {
      return SurveyMode.Private;
    }
    return SurveyMode.Unknown;
  }

  function createSurvey(string memory descriptor, uint surveyMode, address[] memory pollsters, uint expireAt) public {
    uint256 id = nonce;
    SurveyMode mode  = getSurveyModeFromUint(surveyMode);

    require(mode != SurveyMode.Unknown, "SurveyContract::validMode - invalid survey mode. It must be either [0 (public), 1 (private)].");
    if (mode == SurveyMode.Private && pollsters.length == 0) {
      revert("SurveyContract::validMode - at least one pollster must be assigned into survey on private mode.");
    }

    Survey memory survey = Survey(id, block.timestamp, mode, descriptor, pollsters, expireAt);
    surveysByIdMap[id] = survey;
    surveysByCreatorMap[msg.sender].push(id);

    emit CreateSurvey(id, surveyMode, descriptor, pollsters, expireAt);
    nonce++;
  }

  function getSurveyList() public view returns(Survey[] memory) {
    uint256[] memory surveyIds = surveysByCreatorMap[msg.sender];
    Survey[] memory surveyList = new Survey[](surveyIds.length);
    for (uint i = 0; i < surveyIds.length;) {
      uint256 id = surveyIds[i];
      surveyList[i] = surveysByIdMap[id];
      unchecked {
        ++i;
      }
    }
    return surveyList;
  }

  function submitResponse(uint256 surveyId, string memory answer) public {
    // step 1: validate - each sender can only submit the survey once
    require(!submittedSurveyMap[surveyId][msg.sender], "SurveyContract::submitResponse - sender already summitted response.");

    // step 2: validate - the private survey only accept the response from its pollsters
    Survey memory survey = surveysByIdMap[surveyId];

    require(survey.id > 0, "SurveyContract::submitResponse - survey does not exist!");
    if (survey.mode == SurveyMode.Private) {
      bool found = false;
      for (uint i = 0; i < survey.pollsters.length;) {
        address pollster = survey.pollsters[i];
        if (pollster == msg.sender) {
          found = true;
          break;
        }
        unchecked {
          ++i;
        }
      }

      require(found, "SurveyContract::submitResponse - sender does not allow to submit this survey!");
    }

    // step 3: validate - if the survey has the deadline, the response must be submitted before that
    if (survey.expireAt > 0) {
      require(block.timestamp < survey.expireAt, "SurveyContract::submitResponse - the survey is ended.");
    }

    // step 4: prepare the response
    uint256 id = nonce;
    Response memory resp = Response(id, block.timestamp, surveyId, msg.sender, answer);

    // step 5: store the response into the survey
    responsesMap[surveyId].push(resp);

    // step 6: mark the sender as submitted for this survey
    submittedSurveyMap[surveyId][msg.sender] = true;

    // step 7: emit the success event and increase the nonce
    emit SubmitResponse(id, surveyId, msg.sender, answer);
    nonce++;
  }

  function getResponsesBySurvey(uint256 surveyId) public view returns(Response[] memory) {
    return responsesMap[surveyId];
  }
}
