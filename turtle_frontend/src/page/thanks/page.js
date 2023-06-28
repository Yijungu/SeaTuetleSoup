import React, { useState, useEffect } from "react";
import axios from "axios";
import "./page.css";
import { useLocation } from "react-router-dom";

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
    <div className="e106_70">
      <div className="e218_230">
        <div className="e172_65">
          <div className="ei172_65_152_95"></div>
        </div>
        <span className="user_answer">{userAnswer}</span>
      </div>
      <div className="e154_160">
        <div className="e154_144"></div>
        <div className="e154_146"></div>
        <span className="my_play">N번째 추측만에 정답을 맞혔습니다!</span>
        <span className="my_play_2">[나의 플레이]</span>
        <span className="my_play_3">
          가장 처음 풀었던 바다거북수프 번호: n 도전한 게임 횟수: n
        </span>
        <span className="my_play_4">정답 횟수: 6 포기 횟수: 0</span>
        <span className="my_play_5">지금까지 물어본 총 질문 개수: n</span>
        <span className="my_play_6">
          N+1번째 바다거북은 오늘 밤 자정(한국 시간 기준)에 찾아옵니다.
        </span>
      </div>
      <div className="e218_229">
        <div className="e168_85">
          <div className="ei168_85_5790_5636"></div>
        </div>
      </div>
      <div className="e172_178">
        <div className="e172_179">
          <div className="ei172_179_327_14292"></div>
          <div className="ei172_179_327_14293"></div>
        </div>
        <span className="AI_answer">{stroy}</span>
      </div>
      <div className="e218_202">
        <div className="e155_107">
          <div className="ei155_107_5790_5062"></div>
        </div>
      </div>
      <div className="e218_216">
        <div className="e218_217">
          <span className="nickname">thisis2jun9 님</span>
          <div className="e218_219">
            <div className="ei218_219_125_158"></div>
          </div>
        </div>
        <p className="About">About</p>
        <p className="QnA">QnA</p>
        <p className="Log">Log</p>
        <div className="e218_221">
          <div className="ei218_221_144_2659"></div>
        </div>
        <span className="F22F">F22F</span>
      </div>
    </div>
  );
}
