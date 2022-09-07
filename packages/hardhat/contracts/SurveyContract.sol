pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "../libraries/stringUtils.sol";

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
  using StringUtils for string;

  uint256 public nonce = 0;
  mapping(address => Survey[]) public surveysMap;
  mapping(uint256 => Response[]) public responsesMap;

  event CreateSurvey(uint256 id, string mode, string descriptor, address[] pollsters, uint expireAt);
  event SubmitResponse(uint256 id, uint256 surveyId, address pollster, string answer);

  constructor() { }

  function getSurveyModeFromString(string memory modeStr) private pure returns(SurveyMode) {
    if (modeStr.equals("public")) {
      return SurveyMode.Public;
    }
    if (modeStr.equals("private")) {
      return SurveyMode.Private;
    }
    return SurveyMode.Unknown;
  }

  function getSurveyModeString(SurveyMode mode) private pure returns(string memory) {
    if (mode == SurveyMode.Public) {
      return "public";
    }
    if (mode == SurveyMode.Private) {
      return "private";
    }
    return "unknown";
  }

  modifier validMode(string memory modeStr, uint pollstersLen) {
    SurveyMode mode  = getSurveyModeFromString(modeStr);
    require(mode != SurveyMode.Unknown, "SurveyContract::validMode - invalid survey mode. It must be either [public, private].");
    if (mode == SurveyMode.Private && pollstersLen == 0) {
      revert("SurveyContract::validMode - at least one pollster must be assigned into survey on private mode.");
    }
    _;
  }

  function createSurvey(string memory descriptor, string memory surveyMode, address[] memory pollsters, uint expireAt) public validMode(surveyMode, pollsters.length) {
    uint256 id = nonce;
    SurveyMode mode = getSurveyModeFromString(surveyMode);
    Survey memory survey = Survey(id, block.timestamp, mode, descriptor, pollsters, expireAt);
    surveysMap[msg.sender].push(survey);

    emit CreateSurvey(id, surveyMode, descriptor, pollsters, expireAt);
    nonce++;
  }

  function getSurveyList() public view returns(Survey[] memory) {
    return surveysMap[msg.sender];
  }

  function submitResponse(uint256 surveyId, string memory answer) public {
    uint256 id = nonce;
    Response memory resp = Response(id, block.timestamp, surveyId, msg.sender, answer);
    responsesMap[surveyId].push(resp);
    emit SubmitResponse(id, surveyId, msg.sender, answer);
    nonce++;
  }

  function getResponsesBySurvey(uint256 surveyId) public view returns(Response[] memory) {
    return responsesMap[surveyId];
  }
}
