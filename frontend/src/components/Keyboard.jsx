import React from "react";
import "../styles/Keyboard.css";

const Keyboard = ({ onKeyPress }) => {
  const keys = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"],
  ];

  return (
    <div className="keyboard-wrapper">
      <div className="keyboard">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className="key"
                onClick={() => onKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        {/* special keys */}
        <div className="keyboard-row">
          <button className="key wide" onClick={() => onKeyPress("SPACE")}>
            SPACE
          </button>

          <button className="key" onClick={() => onKeyPress("⌫")}>
            ⌫
          </button>

          <button className="key search" onClick={() => onKeyPress("SEARCH")}>
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
