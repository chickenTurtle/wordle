import React from "react";
import { cls_keys } from "./Helpers";

const keyboard = [
  "qwertyuiopå".split(""),
  "asdfghjklöä".split(""),
  ["Enter"].concat("zxcvbnm".split(""), "<-"),
];

const Key = (props) => {
  const cls = cls_keys[props.correct] ?? "";
  return (
    <button
      onClick={props.onClick}
      data-key={props.char === "<-" ? "Backspace" : props.char}
      className={"key" + cls}
    >
      {props.char}
    </button>
  );
};

const Keyboard = (props) => {
  const { guessedChars } = props.gameState;
  return (
    <div className="keyboard">
      {keyboard.map((row, y) => {
        const r = row.map((key, x) => {
          return (
            <Key
              onClick={props.typeChar}
              key={(y, x)}
              char={key}
              correct={guessedChars[key]}
            />
          );
        });
        return (
          <div key={y} className="key-row">
            {r}
          </div>
        );
      })}
    </div>
  );
};

export default Keyboard;
