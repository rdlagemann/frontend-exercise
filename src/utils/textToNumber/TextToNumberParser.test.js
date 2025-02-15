import { DECADES, DIGITS, TEENS, ZERO } from "./constants";
import TextToNumberParser from "./TextToNumberParser";

describe("TextToNumberParser :: one digit numbers", () => {
  const cases = [];
  Object.keys(DIGITS).forEach((key) => {
    cases.push([key, DIGITS[key]]);
  });

  test.each(cases)("%s should return %d", (text, expected) => {
    expect(new TextToNumberParser(text).parse()).toBe(expected);
  });

  it("should return 0 if zero is allowed", () => {
    expect(new TextToNumberParser(ZERO, { allowZero: true }).parse()).toBe(0);
  });

  it("should throw if zero is not allowed", () => {
    expect(() => new TextToNumberParser(ZERO).parse()).toThrow("incorrect");
  });
});

describe("TextToNumberParser :: two digits numbers", () => {
  const cases = [];
  Object.keys(TEENS).forEach((key) => {
    cases.push([key, TEENS[key]]);
  });

  Object.keys(DECADES).forEach((key) => {
    cases.push([key, DECADES[key]]);
  });

  Object.keys(DECADES).forEach((decade) => {
    Object.keys(DIGITS).forEach((digit) => {
      cases.push([`${decade} ${digit}`, DECADES[decade] + DIGITS[digit]]);
    });
  });

  test.each(cases)("%s should return %d", (text, expected) => {
    expect(new TextToNumberParser(text).parse()).toBe(expected);
  });
});

describe("TextToNumberParser :: three digits numbers", () => {
  const cases = [];
  Object.keys(DIGITS).forEach((key) => {
    cases.push([`${key} hundred`, DIGITS[key] * 100]);
  });

  Object.keys(DIGITS).forEach((key) => {
    Object.keys(DECADES).forEach((decade) => {
      cases.push([
        `${key} hundred ${decade}`,
        DIGITS[key] * 100 + DECADES[decade],
      ]);
    });
  });

  Object.keys(DIGITS).forEach((digitFirst) => {
    Object.keys(DECADES).forEach((decade) => {
      Object.keys(DIGITS).forEach((digitLast) => {
        cases.push([
          `${digitFirst} hundred ${decade} ${digitLast}`,
          DIGITS[digitFirst] * 100 + DECADES[decade] + DIGITS[digitLast],
        ]);
      });
    });
  });

  test.each(cases)("%s should return %d", (text, expected) => {
    expect(new TextToNumberParser(text).parse()).toBe(expected);
  });
});

describe("TextToNumberParser :: `and` keyword", () => {
  test.each([
    ["one hundred and one", 101],
    ["one hundred one", 101],
    ["one hundred and fifty", 150],
    ["one hundred fifty", 150],
    ["one hundred and fifty one", 151],
    ["one hundred fifty one", 151],
    ["nine hundred ninety nine", 999],
    ["nine hundred and ninety nine", 999],
  ])("should be optional", (text, expected) => {
    expect(new TextToNumberParser(text).parse()).toBe(expected);
  });

  test.each([
    ["and"],
    ["one and"],
    ["and fifity"],
    ["and one"],
    ["one hundred and"],
    ["fifty and two"],
  ])("should throw when `and` is incorrect positioned", (text) => {
    expect(() => new TextToNumberParser(text).parse()).toThrow("incorrect");
  });
  const allowAndCases = [
    ["and one", 1],
    ["and fifty", 50],
    ["and one hundred", 100],
    ["and fifty two", 52],
  ];

  test.each(allowAndCases)(
    "should work properly when it's allowed to start with `and` ",
    (text, expected) => {
      expect(
        new TextToNumberParser(text, { allowStartWithAnd: true }).parse()
      ).toBe(expected);
    }
  );

  test.each(allowAndCases)(
    "should throw when it's not allowed to start with `and` ",
    (text) => {
      expect(() =>
        new TextToNumberParser(text, { allowStartWithAnd: false }).parse()
      ).toThrow("incorrect");
    }
  );
});

describe("TextToNumberParser :: incorrect inputs", () => {
  test.each([
    ["asdadsa"],
    ["1"],
    ["$%&#"],
    ["one one"],
    ["one thousand and"],
    ["fifty eleven"],
    ["eleven and one"],
    ["eleven eleven"],
    ["ten and one"],
    ["one million two million"],
  ])("should throw", (text) => {
    expect(() => new TextToNumberParser(text).parse()).toThrow("incorrect");
  });
});
