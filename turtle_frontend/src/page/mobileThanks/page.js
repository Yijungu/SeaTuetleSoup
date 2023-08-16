import React, { useState, useEffect } from "react";
import axios from "axios";
import "./mb_page.css";
import { useLocation } from "react-router-dom";
import Profile from "../../images/Profile.png";
import F22FBeta from "../../images/F22FBeta.png";
import CopyButton from "../../images/CopyButton.png";
import SubmitButton from "../../images/SubmitButton.png";
import GreenTurtle from "../../images/GreenTurtle.png";
import BlueSpeechBubble from "../../images/BlueSpeechBubble.png";
import WhiteSpeechBubble from "../../images/WhiteSpeechBubble.png";
import WhiteTurtle from "../../images/WhiteTurtle.png";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isNickName, setIsNickName] = useState(false);
  const endTime = localStorage.getItem("endTime");
  const [problem, setProblem] = useState("");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    const storedStartTime = new Date(localStorage.getItem("startTime"));
    const storedEndTime = new Date(localStorage.getItem("endTime"));

    const timeDifference = storedEndTime - storedStartTime;
    const timeDifferenceInSeconds = Math.round(timeDifference / 1000);

    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    const minutes = Math.floor((timeDifferenceInSeconds - hours * 3600) / 60);
    const seconds = timeDifferenceInSeconds - hours * 3600 - minutes * 60;
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

  const handleSubmitClick = async () => {
    if (nickname === "") {
      setIsNickName(true);
      setTimeout(() => {
        setIsNickName(false); // 2초 후에 복사 성공 상태를 false로 변경
      }, 800);
      return;
    }

    const user = nickname;
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/submit_problem/",
        {
          user: user,
          problem: problem,
          explanation: explanation,
        }
      );
    } catch (error) {
      console.error("There was an error!", error);
    }
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false); // 2초 후에 복사 성공 상태를 false로 변경
    }, 800);
  };

  if (!endTime) {
    return (
      <div className="centered-message_m">
        문제를 포기하거나 정답을 맞히면 볼 수 있습니다!
      </div>
    );
  } else {
    return (
      <div className="container_m">
        <div className="desktop3_m">
          <div className="up_bar_m">
            <img
              className="F22F_main_m"
              src={F22FBeta}
              alt="F22FBeta"
              onClick={handleLogoClick}
            />

            <div className="nickname_profile_main_m">
              <img
                className="profile_photo_main_m"
                src={Profile}
                alt="Profile"
              />

              <p className="nickname_m">{nickname} 님</p>
            </div>
          </div>
          <div className="overall_layout_m">
            {userAnswer && (
              <div className="AI_answer_layout_m">
                <div className="user_answer_box_tag_m">
                  <img
                    className="My_m"
                    src={BlueSpeechBubble}
                    alt="BlueSpeechBubble"
                    width="20"
                    height="18"
                    style={{ margin: "10px" }}
                  />
                  <img
                    className="My_m"
                    src={WhiteSpeechBubble}
                    alt="BlueSpeechBubble"
                    width="20"
                    height="18"
                    style={{ margin: "10px" }}
                  />
                  <img
                    className="My_m"
                    src={BlueSpeechBubble}
                    alt="BlueSpeechBubble"
                    width="20"
                    height="18"
                    style={{ margin: "10px" }}
                  />
                  <img
                    className="My_m"
                    src={WhiteSpeechBubble}
                    alt="BlueSpeechBubble"
                    width="20"
                    height="18"
                    style={{ margin: "10px" }}
                  />
                </div>
                <div className="AI_answer_box_m">
                  <p className="AI_answer_m">{userAnswer}</p>
                </div>
              </div>
            )}

            <div className="AI_answer_layout_m">
              <div className="AI_answer_box_tag_m">
                <img
                  className="MY_m"
                  src={GreenTurtle}
                  alt="BlueSpeechBubble"
                  width="20"
                  height="15"
                  style={{ margin: "10px" }}
                />
                <img
                  className="MY_m"
                  src={WhiteTurtle}
                  alt="BlueSpeechBubble"
                  width="20"
                  height="15"
                  style={{ margin: "10px" }}
                />
                <img
                  className="MY_m"
                  src={GreenTurtle}
                  alt="BlueSpeechBubble"
                  width="20"
                  height="15"
                  style={{ margin: "10px" }}
                />
                <img
                  className="MY_m"
                  src={WhiteTurtle}
                  alt="BlueSpeechBubble"
                  width="20"
                  height="15"
                  style={{ margin: "10px" }}
                />
              </div>
              <div className="AI_answer_box_m">
                <p className="AI_answer_m">{story}</p>
              </div>
            </div>

            <div className="my_play_box_m">
              <div className="copy_m">
                <img
                  className="copybutton_m"
                  src={CopyButton}
                  alt="CopyButton"
                  width="32"
                  height="30"
                  onClick={handleCopy}
                />
              </div>
              <div className="copy_phrase_m">
                <span className="my_play_3_m">
                  <div className="line_m">
                    {userAnswer &&
                      `축하합니다! ${totalQuestionsAsked}번째 질문에서 정답을 맞혔습니다!`}
                    {!userAnswer &&
                      `다음 ${n + 1}번째 수프레시피를 노려보세요!`}
                    <br />
                    {n + 1}번째 수프레시피는 오늘 밤 자정에 찾아옵니다.
                  </div>
                  [My Log]
                  <br />
                  {`정답 횟수: ${correctAnswers} 포기 횟수: ${giveUpCount}`}
                  <br />
                  가장 처음 풀었던 수프 번호: {firstN}
                  <br />
                  도전한 게임 횟수 : {gameAttempts}
                  <br />
                  물어본 총 질문 개수: {totalQuestionsAsked}
                </span>
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
            </div>
            <div className="my_sumbit_box_m">
              <div className="copy_m">
                <img
                  className="copybutton_m"
                  src={SubmitButton}
                  alt="SubmitButton"
                  width="30"
                  height="30"
                  onClick={handleSubmitClick}
                />
              </div>
              <span className="submit_text_m">
                더 좋은 바다 거북 수프 문제가 있다면 자유롭게 적어주세요! <br />
                추후 문제에 반영하겠습니다.
              </span>
              <div className="submit_input_box_m">
                <div className="submit_input_box_one_m">
                  <textarea
                    className="submit_problem_box_m"
                    type="text"
                    placeholder="문제와 힌트를 입력해주세요."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                  />
                </div>
                <div className="submit_input_box_one_m">
                  <textarea
                    className="submit_problem_box_m"
                    type="text"
                    placeholder="정답과 해설을 입력해주세요."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </div>
              </div>

              <Modal
                isOpen={submitSuccess}
                onRequestClose={() => setSubmitSuccess(false)}
                overlayClassName="CopyAlertOverlay"
                className="CopyAlertContent"
                contentLabel="Copy alert"
              >
                <h2>제출완료</h2>
              </Modal>
              <Modal
                isOpen={isNickName}
                onRequestClose={() => setIsNickName(false)}
                overlayClassName="CopyAlertOverlay"
                className="submitAlertContent"
                contentLabel="Copy alert"
              >
                <h2>
                  닉네임을 설정해주세요.
                  <br /> 메인 화면에서 설정이 가능합니다.
                </h2>
              </Modal>
            </div>
          </div>

          <div className="footer_m">
            <p className="Bank_m">카카오뱅크 3333153034882 김영서</p>
            <p className="Bank_m">Copyright 2023. F22F. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }
}
