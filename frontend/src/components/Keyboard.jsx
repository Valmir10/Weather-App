import React from "react";
import "../styles/Keyboard.css";

const keys = [
  ["A","B","C","D","E","F"],
  ["G","H","I","J","K","L"],
  ["M","N","O","P","Q","R"],
  ["S","T","U","V","W","X"],
  ["Y","Z","Å","Ä","Ö"],
  ["SPACE","⌫","SEARCH"]
];

export default function Keyboard({ onKeyPress }) {
  return (
    <div className="keyboard-container">
      {keys.map((row, i) => (
        <div className="keyboard-row" key={i}>
          {row.map((key) => (
            <button
              key={key}
              className="keyboard-key"
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
