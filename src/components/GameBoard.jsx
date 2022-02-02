import React from "react";
import { cls_keys } from "./Helpers";

const Square = (props) => {
  const filled = props.char !== "" ? " filled " : "";
  return (
    <div className={"square" + cls_keys[props.correct] + filled}>
      {props.char}
    </div>
  );
};

const GameBoard = (props) => {
  const { keys, guesses, shakeRow } = props.gameState;
  return (
    <div className="game-board">
      {keys.map((row, y) => {
        const r = row.map((char, x) => {
          return <Square key={(y, x)} char={char} correct={guesses[y][x]} />;
        });
        const shake = shakeRow === y ? " shake " : "";
        return (
          <div key={y} className={shake + "row"}>
            {r}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
