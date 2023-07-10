import React, { useState, useEffect } from "react";
import axios from "axios";
import "./page.css";
import { useLocation } from "react-router-dom";
import Profile from "../../images/Profile.png";
import CopyButton from "../../images/CopyButton.png";
import SpoonForkButton from "../../images/SpoonForkButton.png";
import TurtleIcon from "../../images/TurtleIcon.png";
import UserIcon from "../../images/UserIcon.png";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { motion } from "framer-motion";

export default function Thanks() {
  const location = useLocation();
  const [story, setStory] = useState("");
  const [n, setN] = useState(0);
  const [firstN, setFirstN] = useState(0);
  const navigate = useNavigate();
  const userAnswer = location.state?.userAnswer || ""; // state가 없는 경우를 대비해서 기본값을 제공합니다
  const gameAttempts = Number(localStorage.getItem("gameAttempts"));
  const correctAnswers = Number(localStorage.getItem("correctAnswers"));
  const giveUpCount = Number(localStorage.getItem("giveUpCount"));
  const totalQuestionsAsked = Number(
    localStorage.getItem("totalQuestionsAsked")
  );
  const [nickname, setNickname] = useState("");
  const [copyText, setCopyText] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const endTime = localStorage.getItem("endTime");

  useEffect(() => {
    const storedStartTime = new Date(localStorage.getItem("startTime"));
    const storedEndTime = new Date(localStorage.getItem("endTime"));
    // const storedEndTime = new Date();
    const timeDifference = storedEndTime - storedStartTime;
    const timeDifferenceInSeconds = Math.round(timeDifference / 1000);
    // console.log(storedEndTime);
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    const minutes = Math.floor((timeDifferenceInSeconds - hours * 3600) / 60);
    const seconds = timeDifferenceInSeconds - hours * 3600 - minutes * 60;
    console.log(hours, "시간", minutes, "분", seconds, "초");
    setWorkTime(`${hours}시간 ${minutes}분 ${seconds}초`);
  }, []);

  // 각 텍스트를 state에 저장
  useEffect(() => {
    setCopyText(
      `${n}번째 바다거북수프 문제를 풀었습니다! \n질문 횟수: ${totalQuestionsAsked} \n소요 시간: ${workTime}`
    );
  }, [n, gameAttempts, correctAnswers, giveUpCount, totalQuestionsAsked]);

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
        if (localStorage.getItem("FirstN")) {
          setFirstN(localStorage.getItem("FirstN"));
        } else {
          setFirstN(n);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false); // 2초 후에 복사 성공 상태를 false로 변경
    }, 500);
    // 복사가 완료된 후 알림 메시지를 표시하거나 다른 작업을 수행할 수 있습니다.
  };

  const handleLogoClick = async () => {
    navigate("/");
  };
  if (!endTime) {
    return (
      <div className="centered-message">
        문제를 포기하거나 정답을 맞히면 볼 수 있습니다!
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="desktop3">
          <div className="overall_layout">
            {userAnswer && (
              <div className="user_answer_layout">
                <div className="user_answer_box_tag">
                  <p className="MY">MY</p>
                </div>
                <div className="user_answer_box">
                  <p className="user_answer">{userAnswer}</p>
                </div>
              </div>
            )}

            <div className="Ai_answer_layout">
              <div className="AI_answer_box_tag">
                <p className="MY">AI</p>
              </div>
              <div className="AI_answer_box">
                <p className="AI_answer">{story}</p>
              </div>
            </div>

            <div className="my_play_box">
              <div className="copy_phrase">
                <span className="my_play_3">
                  축하합니다! {totalQuestionsAsked}번째 질문에서 정답을
                  맞혔습니다!
                  <br />
                  {n + 1}번째 수프레시피는 오늘 밤 자정(한국 시간 기준)에
                  찾아옵니다.
                  <br />
                  <br />
                  [My Log]
                  <br />
                  정답 횟수:{correctAnswers} 포기 횟수:{giveUpCount}
                  <br />
                  가장 처음 풀었던 수프 번호: {firstN}
                  <br />
                  도전한 게임 횟수 : {gameAttempts}
                  <br />
                  물어본 총 질문 개수: {totalQuestionsAsked}
                </span>
              </div>
              <div className="copy">
                <img
                  className="copybutton"
                  src={CopyButton}
                  alt="CopyButton"
                  width="25"
                  height="25"
                  onClick={handleCopy}
                />
              </div>

              <Modal
                isOpen={copySuccess}
                onRequestClose={() => setCopySuccess(false)}
                overlayClassName="CopyAlertOverlay"
                className="CopyAlertContent"
                contentLabel="Copy alert"
              >
                <h2>복사 완료</h2>
              </Modal>

              {/* <div className="user_soup">
                  <img
                    src={SpoonForkButton}
                    alt="SpoonForkButton"
                    width="25"
                    height="25"
                  />
                </div> */}
            </div>
          </div>
          <div className="border_line">
            <div>
              <p className="nickname">{nickname} 님</p>
            </div>
            <div>
              <img
                className="profile_photo"
                src={Profile}
                alt="Profile"
                width="25"
                height="25"
              />
            </div>
          </div>

          <button className="F22F" onClick={handleLogoClick}>
            F22F
          </button>
        </div>
      </div>
    );
  }
}
