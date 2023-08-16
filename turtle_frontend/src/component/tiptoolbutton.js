import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import TipButton from "../images/TipButton.png";
import TipText from "../images/TipText.png";
import "./tiptoolbutton.css";

function ButtonWithTip() {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="container">
      <button className="round-button" onClick={() => setShowTip(!showTip)}>
        <img src={TipButton} alt="Go to tip" width="50" height="40" />
      </button>
      <CSSTransition
        in={showTip}
        timeout={500}
        classNames="slide"
        unmountOnExit
      >
        {/* <div className="tip-box">
          <p className="tip_text">TIP</p>
          <p className="tip_text">
            1. 글자가 이상하게 나와요.
            <br /> - chrome을 이용할 시 자동연어번역을 꺼주세요.
          </p>
          <p className="tip_text">
            2. 영어 번역이 이상하게 나와요.
            <br /> - 영어 칸 안에 보시면 리롤버튼이 있습니다. 그것을 눌러 의미가
            잘 전달되는 영어 번역으로 변경해주세요.
            <br /> - 더블체크 버튼을 누르면 바뀐 번역에 대한 답을 얻을 수
            있습니다.
            <br /> - 만약 영어 번역이 리롤을 돌려도 의미가 제대로 전달되지
            않는다면 질문을 정리해서 다시 입력해주세요.
          </p>
          <p className="tip_text">
            3. 정답을 입력하고 싶어요.
            <br /> - 버튼을 오른쪽으로 슬라이드를 하거나 입력 칸을 누르고 탭을
            누른다면 버튼을 전환할 수 있습니다..
          </p>
        </div> */}
        <img
          className="tip-text"
          src={TipText}
          alt="tip text"
          width="248"
          height="720"
        />
      </CSSTransition>
    </div>
  );
}

export default ButtonWithTip;
