import { MILLION, THOUSAND } from "./constants";
import TextToNumberParser from "./TextToNumberParser";

/**
 * Parse a integer described as text to number
 * @param {string} text Text representing a number between `0 ("zero")` and `999,999,999 ("nine hundred ninety nine million nine hundred ninety nine thousand nine hundred and ninety nine")`
 * @returns {number}
 * @throws incorrect
 */
export default function textToNumber(text = "") {
  if (!validateTextToNumber(text)) {
    return "N/A";
  }

  const _text = text.trim().toLocaleLowerCase();
  const { million, thousand, hundred } = extractTextNumberFractions(_text);

  const millionAsNumber = new TextToNumberParser(million).parse();
  const thousandAsNumber = new TextToNumberParser(thousand).parse();
  const hundredAsNumber = new TextToNumberParser(hundred, {
    allowZero: !million && !thousand,
    allowStartWithAnd: million || thousand,
  }).parse();

  return (
    millionAsNumber * Math.pow(10, 6) +
    thousandAsNumber * Math.pow(10, 3) +
    hundredAsNumber
  );
}

function validateTextToNumber(text) {
  return typeof text === "string" && text.trim().length > 0;
}

/**
 * @param {string} text
 * @returns {TextNumberFractions}
 */
function extractTextNumberFractions(text = "") {
  let million = "";
  let thousand = "";
  let hundred = "";

  let millionSplitted = "";
  let thousandSplitted = [];

  let targetText = text.trim();

  if (targetText.includes(MILLION)) {
    millionSplitted = targetText
      .split(new RegExp(`${MILLION}(.*)`, "s"))
      .map((i) => i.trim());
    million = millionSplitted[0] || million;
    validateTextNumberFraction(million);
    targetText = millionSplitted[1];
  }

  if (targetText && targetText.includes(THOUSAND)) {
    thousandSplitted = targetText
      .split(new RegExp(`${THOUSAND}(.*)`, "s"))
      .map((i) => i.trim());
    thousand = thousandSplitted[0] || thousand;
    validateTextNumberFraction(thousand);
    targetText = thousandSplitted[1];
  }

  hundred = targetText;
  if (hundred) validateTextNumberFraction(hundred);

  return {
    million,
    thousand,
    hundred,
  };
}

function validateTextNumberFraction(text = "") {
  const regexp = new RegExp(`(${MILLION}|${THOUSAND})+`, "ig");
  if (!text?.trim() || regexp.test(text)) {
    throw new Error("incorrect");
  }
}

/**
 * @typedef {Object} TextNumberFractions
 * @property {string} million
 * @property {string} thousand
 * @property {string} hundred
 */
