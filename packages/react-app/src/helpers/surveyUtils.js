import { ethers } from "ethers";

const SURVEY_MODE_MAP = new Map([
  [0, "Public"],
  [1, "Private"],
]);

const SUPPORTED_QUESTION_TYPE = ["text", "datetime", "checkbox", "select", "radio"];

const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

export const toHexString = jsonObj => {
  let jsonStr = JSON.stringify(jsonObj);
  let bytesArr = ethers.utils.toUtf8Bytes(jsonStr);
  let hexStr = ethers.utils.hexlify(bytesArr);
  return hexStr;
};

export const toJSONObj = hexStr => {
  let bytesArr = ethers.utils.arrayify(hexStr);
  let jsonStr = ethers.utils.toUtf8String(bytesArr);
  let jsonObj = JSON.parse(jsonStr);
  return jsonObj;
};

export const fromUnixTimestampToTimestamp = unixTimestamp => {
  const dt = new Date(unixTimestamp * 1000);
  return `${dt.getFullYear()}-${padL(dt.getMonth() + 1)}-${padL(dt.getDate())} ${padL(dt.getHours())}:${padL(
    dt.getMinutes(),
  )}:${padL(dt.getSeconds())}`;
};

export const getSurveyModeLabel = mode => {
  if (!SURVEY_MODE_MAP.has(mode)) {
    return "Unknown";
  }
  return SURVEY_MODE_MAP.get(mode);
};

export const validateSurveyDescriptor = descriptor => {
  const title = descriptor["title"];
  const description = descriptor["description"];
  const question = descriptor["question"];
  if (typeof title !== "string" || title.length === 0) {
    return false;
  }
  if (typeof description !== "string") {
    return false;
  }
  if (question.constructor !== Array || question.length === 0) {
    return false;
  }

  for (let i = 0; i < question.length; i++) {
    const questionItem = question[i];
    if (typeof questionItem["id"] !== "number") {
      return false;
    }
    if (typeof questionItem["title"] !== "string" || questionItem["title"].length === 0) {
      return false;
    }
    if (typeof questionItem["id"] !== "number") {
      return false;
    }
    if (typeof questionItem["required"] !== "boolean") {
      return false;
    }
    if (!SUPPORTED_QUESTION_TYPE.includes(questionItem["type"])) {
      return false;
    }

    if (["checkbox", "select", "radio"].includes(questionItem["type"])) {
      if (questionItem["options"].constructor !== Array || question.length === 0) {
        return false;
      }

      for (let optIdx = 0; optIdx < questionItem["options"].length; optIdx++) {
        const option = questionItem["options"][optIdx];
        if (typeof option["id"] !== "number") {
          return false;
        }
        if (typeof option["title"] !== "string" || option["title"].length === 0) {
          return false;
        }
      }
    }
  }

  return true;
};

export const surveyListFormatter = surveyData => {
  const data = [];
  if (surveyData == null) {
    return data;
  }
  for (const item of surveyData) {
    const descriptorJSON = toJSONObj(item["descriptor"]);
    if (!validateSurveyDescriptor(descriptorJSON)) {
      continue;
    }
    const id = item["id"].toString();

    const title = descriptorJSON["title"];
    const description = descriptorJSON["description"];

    const createdAtUnixTimestamp = item["createdAt"].toNumber();
    const createdAt = fromUnixTimestampToTimestamp(createdAtUnixTimestamp);

    const expiredAtUnixTimestamp = item["expireAt"].toNumber();
    const expireAt = expiredAtUnixTimestamp !== 0 ? fromUnixTimestampToTimestamp(expiredAtUnixTimestamp) : null;

    const surveyMode = getSurveyModeLabel(item["mode"]);
    const pollsters = item["pollsters"];

    data.push({
      id,
      title,
      description,
      createdAt,
      expireAt,
      surveyMode,
      pollsters,
    });
  }

  return data;
};
