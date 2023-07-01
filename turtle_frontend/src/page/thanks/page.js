import React, { useState, useEffect } from "react";
import axios from "axios";
import "./page.css";
import { useLocation } from "react-router-dom";
import Profile from "../../images/Profile.png";
import CopyButton from "../../images/CopyButton.png";
import SpoonForkButton from "../../images/SpoonForkButton.png";

export default function Thanks() {
  const location = useLocation();
  const [stroy, setStory] = useState("");
  const [n, setN] = useState(0);
  const userAnswer = location.state?.userAnswer || ""; // state가 없는 경우를 대비해서 기본값을 제공합니다
  const gameAttempts = Number(localStorage.getItem("gameAttempts"));
  const correctAnswers = Number(localStorage.getItem("correctAnswers"));
  const giveUpCount = Number(localStorage.getItem("giveUpCount"));
  const totalQuestionsAsked = Number(
    localStorage.getItem("totalQuestionsAsked")
  );
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getStory/")
      .then((response) => {
        const data = response.data;
        setStory(data.story);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getNnumber/")
      .then((response) => {
        const data = response.data;
        setN(data.n);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div className="container">
      <div className="desktop3">
        <div className="overall_layout">
          <div className="user_answer_box">
            <div className="user_answer_box_tag">사용자 정답</div>
            <span className="user_answer">{userAnswer}</span>
          </div>
          <div className="AI_answer_box">
            <div className="AI_answer_box_tag">AI 정답</div>
            <span className="AI_answer">{stroy}</span>
          </div>
          <div className="my_play_box">
            <div className="copy_phrase">
              <span className="my_play">
                {n}번째 추측만에 정답을 맞혔습니다!
              </span>
              <span className="my_play_2">[나의 플레이]</span>
              <span className="my_play_3">
                가장 처음 풀었던 바다거북수프 번호: {n} 도전한 게임 횟수:{" "}
                {gameAttempts}
              </span>
              <span className="my_play_4">
                정답 횟수: {correctAnswers} 포기 횟수: {giveUpCount}
              </span>
              <span className="my_play_5">
                물어본 총 질문 개수: {totalQuestionsAsked}
              </span>
              <span className="my_play_6">
                {n + 1}번째 바다거북은 오늘 밤 자정(한국 시간 기준)에
                찾아옵니다.
              </span>
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
          </div>
        </div>
        <div className="top_bar">
          <div className="profile">
            <span className="nickname">{nickname} 님</span>
            <div className="e125_157">
              <img
                className="profile_photo"
                src={Profile}
                alt="Profile"
                width="25"
                height="25"
              />
            </div>
          </div>

          <div className="menu">
            <p className="About_3">About</p>
            <p className="QnA_3">QnA</p>
            <p className="Log_3">Log</p>
          </div>
        </div>

        <button className="F22F">F22F</button>
      </div>
    </div>
  );
}
