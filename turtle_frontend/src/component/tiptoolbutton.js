import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import TipButton from "../images/TipButton.png";
import TipText from "../images/TipText.png";
import "./tiptoolbutton.css";

function ButtonWithTip({ initialShowTip = false, toggleTip }) {
  const [showTip, setShowTip] = useState(initialShowTip);

  useEffect(() => {
    setShowTip(initialShowTip);
  }, [initialShowTip]);

  return (
    <div className="container">
      <button className="round-button" onClick={toggleTip}>
        <img src={TipButton} alt="Go to tip" width="40" height="40" />
      </button>
      <CSSTransition
        in={showTip}
        timeout={500}
        classNames="slide"
        unmountOnExit
      >
        <img
          className="tip-text"
          src={TipText}
          alt="tip text"
          width="350"
          height="464"
        />
      </CSSTransition>
    </div>
  );
}

export default ButtonWithTip;
