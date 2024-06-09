import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import TipButton from "../images/KeyButton.png";
import TipText from "../images/KeyText.png";
import "./keybutton.css";

function ButtonWithTip({ initialShowTip, toggleTip }) {
  const [showTip, setShowTip] = useState(initialShowTip);

  useEffect(() => {
    setShowTip(initialShowTip);
  }, [initialShowTip]);

  return (
    <div className="container">
      <button className="round-button_key" onClick={toggleTip}>
        <img src={TipButton} alt="Go to tip" width="40" height="40" />
      </button>
      <CSSTransition
        in={showTip}
        timeout={500}
        classNames="slide"
        unmountOnExit
      >
        <img
          className="key-text"
          src={TipText}
          alt="tip text"
          width="260"
          height="590"
        />
      </CSSTransition>
    </div>
  );
}

export default ButtonWithTip;
