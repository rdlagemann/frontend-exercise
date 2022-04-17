import TokenReader from "../tokenReader/TokenReader";
import { ZERO, DIGITS, TEENS, DECADES, AND, HUNDRED } from "./constants";

/**
 * @type {StateMachineConfig}
 */
const DEFAULT_CONFIG = {
  initialState: 0,
  allowZero: false,
  allowStartWithAnd: false,
  TokenReader,
};

/**
 * State machine implementation that converts text into number.
 * The text should represent integer numbers with max length of 3 digits.
 * @param {string} str String representation of a number (min: `"zero"`, max: `"nine hundred ninety nine"`)
 * @param {StateMachineConfig} config
 * @returns {number} A number representation of `str`
 * @throws incorrect
 */
export default function textToNumberStateMachine(
  str = "",
  config = DEFAULT_CONFIG
) {
  const _config = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  const { initialState, allowZero, allowStartWithAnd } = _config;
  let state = initialState;
  let token = null;
  const tokenReader = new _config.TokenReader(str);

  return run();

  function run() {
    nextToken();

    if (!token) {
      return end();
    }

    if (allowZero && token === ZERO) {
      return end();
    }

    if (allowStartWithAnd && token === AND) {
      nextToken();
    }

    if (DIGITS[token]) {
      return readDigit(token);
    }

    if (TEENS[token]) {
      return readTeen(token);
    }

    if (DECADES[token]) {
      return readDecade(token);
    }

    invalid();
  }

  function readDigit(currentToken) {
    state = DIGITS[currentToken];

    nextToken();

    if (!token) {
      return end();
    }

    if (token === HUNDRED) {
      return readHundred(token);
    }

    invalid();
  }

  function readHundred() {
    state *= 100;

    nextToken();

    if (!token) {
      return end();
    }

    if (token === AND) {
      nextToken();
    }

    if (DIGITS[token]) {
      return readHundredDigit(token);
    }

    if (TEENS[token]) {
      return readTeen(token);
    }

    if (DECADES[token]) {
      return readDecade(token);
    }

    invalid();
  }

  function readDecade(currentToken) {
    state += DECADES[currentToken];

    nextToken();

    if (!token) {
      return end();
    }

    if (DIGITS[token]) {
      state += DIGITS[token];
      return end();
    }

    invalid();
  }

  function readTeen(currentToken) {
    state += TEENS[currentToken];
    return end();
  }

  function readHundredDigit(token) {
    state += DIGITS[token];
    return end();
  }

  function nextToken() {
    token = tokenReader.nextToken();
  }

  function end() {
    if (tokenReader.nextToken() !== null) {
      invalid();
    }
    return state;
  }

  function invalid() {
    throw Error("incorrect");
  }
}

/**
 * @typedef {Object} StateMachineConfig
 * @property {number} initialState
 * @property {boolean} allowZero
 * @property {boolean} allowStartWithAnd
 * @property {typeof TokenReader} TokenReader
 */
