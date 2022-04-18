import TokenReader from "./TokenReader";
import { ZERO, DIGITS, TEENS, DECADES, AND, HUNDRED } from "./constants";

const DEFAULT_CONFIG = {
  initialState: 0,
  allowZero: false,
  allowStartWithAnd: false,
  TokenReader,
};

export default class TextToNumberParser {
  /**
   * State machine implementation that converts text into number.
   * The text should represent integer numbers with max length of 3 digits.
   * @param {string} text String representation of a number (min: `"zero"`, max: `"nine hundred ninety nine"`)
   * @param {StateMachineConfig} config
   */
  constructor(text, config) {
    this.text = text;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
    this.state = this.config.initialState;
    this.token = null;
    this.tokenReader = new this.config.TokenReader(text);
  }

  /**
   * Parse `text` into number
   * @returns {number}
   * @throws incorrect
   */
  parse() {
    this._nextToken();

    if (!this.token) {
      return this._end();
    }

    if (this.config.allowZero && this.token === ZERO) {
      return this._end();
    }

    if (this.config.allowStartWithAnd && this.token === AND) {
      this._nextToken();
    }

    if (DIGITS[this.token]) {
      return this._readDigit();
    }

    if (TEENS[this.token]) {
      return this._readTeen();
    }

    if (DECADES[this.token]) {
      return this._readDecade();
    }

    this._invalid();
  }

  _readDigit() {
    this.state = DIGITS[this.token];

    this._nextToken();

    if (!this.token) {
      return this._end();
    }

    if (this.token === HUNDRED) {
      return this._readHundred();
    }

    this._invalid();
  }

  _readHundred() {
    this.state *= 100;

    this._nextToken();

    if (!this.token) {
      return this._end();
    }

    if (this.token === AND) {
      this._nextToken();
    }

    if (DIGITS[this.token]) {
      return this._readHundredDigit();
    }

    if (TEENS[this.token]) {
      return this._readTeen(this.token);
    }

    if (DECADES[this.token]) {
      return this._readDecade();
    }

    this._invalid();
  }

  _readDecade() {
    this.state += DECADES[this.token];

    this._nextToken();

    if (!this.token) {
      return this._end();
    }

    if (DIGITS[this.token]) {
      this.state += DIGITS[this.token];
      return this._end();
    }

    this._invalid();
  }

  _readTeen() {
    this.state += TEENS[this.token];
    return this._end();
  }

  _readHundredDigit() {
    this.state += DIGITS[this.token];
    return this._end();
  }

  _nextToken() {
    this.token = this.tokenReader.nextToken();
  }

  _end() {
    this._nextToken();
    if (this.token !== null) {
      this._invalid();
    }
    return this.state;
  }

  _invalid() {
    throw Error("incorrect");
  }
}
