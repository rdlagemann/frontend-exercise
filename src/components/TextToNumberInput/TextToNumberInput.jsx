import { useState } from "react";
import textToNumber from "../../utils/textToNumber";

const showOutput = (text) => {
  try {
    return textToNumber(text);
  } catch (err) {
    return "incorrect";
  }
};

function TextToNumberInput() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div>
        <p role="alert">Output: {showOutput(text)}</p>
      </div>
    </div>
  );
}

export default TextToNumberInput;
