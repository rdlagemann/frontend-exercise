import textToNumber from "./textToNumber";

describe("textToNumber", () => {
  test.each([[""], ["  "], [" \n"], [null], [undefined]])(
    `should return default N/A`,
    (input) => {
      expect(textToNumber(input)).toBe("N/A");
    }
  );

  test.each([
    ["zero", 0],
    ["one", 1],
    ["one hundred", 100],
    ["one thousand", 1_000],
    ["one thousand one", 1_001],
    ["one thousand one hundred and one", 1_101],
    ["one million", 1_000_000],
    ["one million one thousand", 1_001_000],
    ["one million one thousand one hundred", 1_001_100],
    ["one million one thousand one hundred and one", 1_001_101],
    ["fifty four", 54],
    ["two thousand and forty five", 2_045],
    ["three million one hundred thousand and ninety", 3_100_090],
    [
      "nine hundred ninety nine million nine hundred ninety nine thousand nine hundred and ninety nine",
      999_999_999,
    ],
  ])(`should properly convert %s to %d`, (input, expected) => {
    expect(textToNumber(input)).toBe(expected);
  });

  test.each([
    ["zero zero"],
    ["one one"],
    ["hundred hundred"],
    ["thousand one million"],
    ["thousand thousand"],
    ["one hundred one hundred and one"],
    ["and one one million one thousand one hundred"],
    ["four fifty"],
    ["ninety ninety million one hundred thousand"],
    [
      "nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred and ninety nine",
    ],
  ])(`should throw`, (input) => {
    expect(() => textToNumber(input)).toThrow("incorrect");
  });
});
