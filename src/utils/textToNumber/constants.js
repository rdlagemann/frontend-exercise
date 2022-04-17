export const AND = "and";
export const ZERO = "zero";
export const HUNDRED = "hundred";
const MILLION = "million";
const THOUSAND = "thousand";

export const DIGITS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

export const TEENS = {
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

export const DECADES = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const validateTextNumberFraction = (text = "") => {
  const regexp = new RegExp(`(${MILLION}|${THOUSAND})+`, "ig");
  if (!text?.trim() || regexp.test(text)) {
    throw new Error("incorrect");
  }
};

/**
 * @param {string} text
 * @returns {TextNumberFractions}
 */
export const getTextNumberFractions = (text = "") => {
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
};

/**
 * @typedef {Object} TextNumberFractions
 * @property {string} million
 * @property {string} thousand
 * @property {string} hundred
 */
