import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextToNumberInput from "./TextToNumberInput";

describe("TextToNumberInput", () => {
  it("should render with default props", () => {
    expect(() => render(<TextToNumberInput />)).not.toThrow();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Output: 0");
  });

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
    ["two thousand and forty five", 2045],
    ["three million one hundred thousand and ninety", 3100090],
    [
      "nine hundred ninety nine million nine hundred ninety nine thousand nine hundred and ninety nine",
      999_999_999,
    ],
  ])(`should properly convert %s to %d`, (text, expected) => {
    render(<TextToNumberInput />);
    const input = screen.getByRole("textbox");
    userEvent.type(input, text);
    expect(screen.getByRole("alert")).toHaveTextContent(`Output: ${expected}`);
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
  ])(`should show error text when input is incorrect`, (text) => {
    render(<TextToNumberInput />);
    const input = screen.getByRole("textbox");
    userEvent.type(input, text);
    expect(screen.getByRole("alert")).toHaveTextContent("Output: incorrect");
  });
});
