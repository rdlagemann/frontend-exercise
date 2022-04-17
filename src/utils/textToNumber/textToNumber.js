import stateMachine from "./stateMachine";
import { getTextNumberFractions } from "./constants";

const MI = Math.pow(10, 6);
const K = Math.pow(10, 3);

/**
 * Parse a integer described as text to number
 * @param {string} text Text representing a number between `0 ("zero")` and `999,999,999 ("nine hundred ninety nine million nine hundred ninety nine thousand nine hundred and ninety nine")`
 * @returns {number}
 * @throws incorrect
 */
export default function textToNumber(text) {
  const { million, thousand, hundred } = getTextNumberFractions(text);

  const millionAsNumber = stateMachine(million);
  const thousandAsNumber = stateMachine(thousand);
  const hundredAsNumber = stateMachine(hundred, {
    allowZero: !million && !thousand,
    allowStartWithAnd: million || thousand,
  });

  return millionAsNumber * MI + thousandAsNumber * K + hundredAsNumber;
}
