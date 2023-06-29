import React, { useState, useEffect } from "react";
import axios from "axios";
import "./page.css";
import { useLocation } from "react-router-dom";
import CopyButton from "../../images/CopyButton.png"
import SpoonForkButton from "../../images/SpoonForkButton.png"

export default function Thanks() {
  const location = useLocation();
  const [stroy, setStory] = useState("");
  const userAnswer = location.state?.userAnswer || ""; // state가 없는 경우를 대비해서 기본값을 제공합니다

  useEffect(() => {
    axios
      .get("http://localhost:8000/getStory/")
      .then((response) => {
        const data = response.data;
        setStory(data.story);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div className="desktop3">
      <div className="overall_layout">
          <div className="user_answer_box">
          <span className="user_answer">{userAnswer}</span>
        </div>

        <div className="AI_answer_box"></div>
        <span className="AI_answer">{stroy}</span>
      
        <div className="my_play_box">
        <div className="copy_phrase">
        <span className="my_play">N번째 추측만에 정답을 맞혔습니다!</span>
        <span className="my_play_2">[나의 플레이]</span>
        <span className="my_play_3">
          가장 처음 풀었던 바다거북수프 번호: n 도전한 게임 횟수: n </span>
        <span className="my_play_4">정답 횟수: 6 포기 횟수: 0</span>
        <span className="my_play_5">지금까지 물어본 총 질문 개수: n</span>
        <span className="my_play_6">N+1번째 바다거북은 오늘 밤 자정(한국 시간 기준)에 찾아옵니다.</span>
        </div>

          <div className="copy">
          <img
              className="copybutton"
              src={CopyButton}
              alt="CopyButton"
              width="25"
              height="25"
            />
          </div>

          <div className="user_soup">
          <img
              src={SpoonForkButton}
              alt="SpoonForkButton"
              width="25"
              height="25"
            />
          </div>
      </div>

      <div className="top_bar">
      <span className="F22F">F22F</span>

        <div className="profile">
          <span className="nickname">thisis2jun9 님</span>
          <div className="profile_photo"></div>
        </div>

        <div className="menu">
        <p className="About">About</p>
        <p className="QnA">QnA</p>
        <p className="Log">Log</p>
        </div>
      </div>
      </div>
    </div>
  );
}
