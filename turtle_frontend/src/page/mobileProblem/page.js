import React, { useState, useEffect } from "react";
import axios from "axios";
import QnA from "../../component/qna_m";
import "./mb_page.css";
import F22FBeta from "../../images/F22FBeta.png";
import { useNavigate } from "react-router-dom";
import Profile from "../../images/Profile.png";
import SendButton from "../../images/SendButton.png";
import Loading from "../../component/loading_m";
import { motion } from "framer-motion";
import Modal from "react-modal";
import ScrollToTopButton from "../../component/scrollbutton";
import ButtonWithTip from "../../component/tiptoolbutton_m";
import KeyButton from "../../component/keybutton_m";
import Draggable from "react-draggable";

export default function Problem() {
  const [showTipOne, setShowTipOne] = useState(false);
  const [showTipTwo, setShowTipTwo] = useState(false);
  const [text, setText] = useState("");
  const [qnas, setQnas] = useState([]);
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameAttempts, setGameAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [giveUpCount, setGiveUpCount] = useState(0);
  const [totalQuestionsAsked, setTotalQuestionsAsked] = useState(0);
  const [updateState, setUpdateState] = useState(false);
  const [tabPressed, setTabPressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hintmodalIsOpen, setHintModalIsOpen] = useState(false);
  const [text_t, setText_t] = useState("");
  const [author, setAuthor] = useState("");
  const [main_character, setMainCharacter] = useState("");
  const [text_question, setText_Question] = useState(
    "어떤 대상에 대해 알고 싶으신가요?"
  );
  const [question_step, setQuestion_Step] = useState(true);
  const [givup, setGiveUp] = useState(false);
  const [question_2step_text, setQuestion_2step_Text] = useState("");
  const [hintText, setHintText] = useState("힌트 A: 기본적인 힌트");
  const [hintText2, setHintText2] = useState("힌트 B: 결정적인 힌트");
  const [hint, setHint] = useState("없음");
  const [hint2, setHint2] = useState("없음");
  const [background_text, setBackGroudText] = useState("정답을 입력하세요");
  const [background_question_text, setBackgroundQuestionText] =
    useState("주어를 넣어 질문을 입력하세요.");
  const [answerloding_text, setAnswerLodingText] =
    useState("정답을 확인중입니다.");
  const [position, setPosition] = useState({ x: 2, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getNnumber/")
      .then((response) => {
        const data = response.data;
        setN(data.n);
      });
  }, []);
  useEffect(() => {
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}`;
    let lastTime = localStorage.getItem("startTime");
    if (lastTime) {
      lastTime = new Date(lastTime);
      const lastDate = `${lastTime.getFullYear()}-${
        lastTime.getMonth() + 1
      }-${lastTime.getDate()}`;
      if (lastDate !== currentDate) {
        localStorage.setItem("startTime", now);
        localStorage.setItem("endTime", "");
      }
    } else {
      localStorage.setItem("startTime", now);
      localStorage.setItem("endTime", "");
    }
  }, []);

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  useEffect(() => {
    // 현재 날짜를 구한다
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}`;

    // 이전에 저장한 날짜를 불러온다
    const savedDate = localStorage.getItem("date");
    const savedGameAttempts = Number(localStorage.getItem("gameAttempts"));
    const savedCorrectAnswers = Number(localStorage.getItem("correctAnswers"));

    const savedGiveUpCount = Number(localStorage.getItem("giveUpCount"));
    const savedTotalQuestionsAsked = Number(
      localStorage.getItem("totalQuestionsAsked")
    );

    // 날짜가 다르면 모든 값을 초기화한다
    if (savedDate !== currentDate) {
      setGameAttempts(savedGameAttempts + 1);
      setTotalQuestionsAsked(0);
      // localStorage.setItem("date", currentDate);
    } else {
      // 같은 날이면 localStorage에 저장된 값을 불러온다
      setGameAttempts(savedGameAttempts || 1);
      setTotalQuestionsAsked(savedTotalQuestionsAsked || 0);
    }

    setCorrectAnswers(savedCorrectAnswers);

    setGiveUpCount(savedGiveUpCount || 0);
  }, []);

  // useEffect(() => {
  //   console.log(qnas);
  // }, [qnas]);

  // 값들이 변경될 때마다 localStorage에 저장한다
  useEffect(() => {
    localStorage.setItem("gameAttempts", gameAttempts);
    localStorage.setItem("giveUpCount", giveUpCount);
    localStorage.setItem("correctAnswers", correctAnswers);
    localStorage.setItem("totalQuestionsAsked", totalQuestionsAsked);
  }, [gameAttempts, correctAnswers, giveUpCount, totalQuestionsAsked]);

  const saveQnas = (qnas) => {
    localStorage.setItem("qnas", JSON.stringify(qnas));
  };

  useEffect(() => {
    const savedQnas = JSON.parse(localStorage.getItem("qnas"));
    const savedDate = localStorage.getItem("date");

    const now = new Date();
    const currentDate = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}`;

    if (savedQnas && savedDate === currentDate) {
      setQnas(savedQnas);
    } else {
      localStorage.removeItem("qnas");
      localStorage.setItem("date", currentDate);
      setShowTipTwo(true);
    }
  }, []);

  useEffect(() => {
    if (updateState) {
      if (givup) {
        navigate("/mobileExplanation", { state: { userAnswer: "" } });
        setUpdateState(false);
      } else {
        navigate("/mobileExplanation", { state: { userAnswer: text_t } });
        // 상태 업데이트 완료 표시
        setUpdateState(false);
      }
    }
  }, [updateState, text]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getQuestion/")
      .then((response) => {
        const data = response.data;
        setQuestion(data.question);
        setAuthor(data.author);
        setMainCharacter(data.main_character);
        setHint(
          data.hints && data.hints.length > 0 ? data.hints[0].hint : null
        );
        setHint2(
          data.hints && data.hints.length > 1 ? data.hints[1].hint : null
        );
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  useEffect(() => {
    if (tabPressed) {
      setText_Question("정답을 말해주세요.");
    } else {
      if (question_step) {
        setText_Question("질문을 완성해주세요.");
      } else {
        setText_Question("어떤 대상에 대해 알고 싶으신가요?");
      }
    }
  }, [tabPressed, question_step]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleLogoClick = async () => {
    navigate("/");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      setTabPressed(!tabPressed);
      if (position.x == 24) {
        setTimeout(() => setPosition({ x: 5, y: 0 }));
        updateColor();
      } else {
        setTimeout(() => setPosition({ x: 24, y: 0 }));
        updateColor();
      }
      // setQuestion_Step(false);
    }
    if (e.key === "Escape") {
      // setQuestion_Step(false);
    }
  };

  const handleCheck = () => {
    setTabPressed(!tabPressed);
    if (position.x == 24) {
      setTimeout(() => setPosition({ x: 4, y: 0 }));
      updateColor();
    } else {
      setTimeout(() => setPosition({ x: 24, y: 0 }));
      updateColor();
    }
  };

  const handleGiveUpClick = async () => {
    closeModal();
    const lastGiveUpDate = localStorage.getItem("lastGiveUpDate");
    const lastCorrectDate = localStorage.getItem("lastCorrectDate");
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}`;
    localStorage.setItem("endTime", now);
    // 마지막으로 정답을 맞춘 날짜와 현재 날짜를 비교하기
    if (lastGiveUpDate !== currentDate && lastCorrectDate !== currentDate) {
      // 현재 날짜를 마지막으로 정답을 맞춘 날짜로 저장

      localStorage.setItem("lastGiveUpDate", currentDate);

      // 실패 횟수를 증가
      setGiveUpCount(giveUpCount + 1);
    }
    setGiveUp(true);
    setUpdateState(true);
  };

  const handleSendClick = async () => {
    if (isProcessing) return;
    // 실행 중이 아니라면, 실행 중임을 표시
    setIsProcessing(true);
    try {
      setText_t(text);
      const text_x = text;
      setTimeout(() => setText(""), 0);
      // console.log(process.env.REACT_APP_API_URL + "/submit/");
      if (tabPressed === true) {
        // 텍스트가 '정답'으로 시작하면 다른 주소로 요청
        if (text_x.length <= 5) {
          setBackGroudText(" ");
          setTotalQuestionsAsked(totalQuestionsAsked + 1);
          setTimeout(() => setBackGroudText("정답을 입력하세요."), 600);
        } else {
          setBackGroudText("");
          const anotherResponse = await axios.post(
            process.env.REACT_APP_API_URL + "/submit/",
            {
              data: text_x,
            }
          );
          // console.log(anotherResponse.data.response);
          if (
            anotherResponse.data.response.startsWith("네") ||
            anotherResponse.data.response.startsWith("예") ||
            anotherResponse.data.response.startsWith("맞습니다") ||
            anotherResponse.data.response.startsWith("Yes")
          ) {
            const now = new Date();
            const currentDate = `${now.getFullYear()}-${
              now.getMonth() + 1
            }-${now.getDate()}`;

            localStorage.setItem("endTime", now);
            // 마지막으로 정답을 맞춘 날짜를 불러오기
            const lastCorrectDate = localStorage.getItem("lastCorrectDate");
            const lastGiveUpDate = localStorage.getItem("lastGiveUpDate");

            // 마지막으로 정답을 맞춘 날짜와 현재 날짜를 비교하기
            if (
              lastGiveUpDate !== currentDate &&
              lastCorrectDate !== currentDate
            ) {
              // 현재 날짜를 마지막으로 정답을 맞춘 날짜로 저장
              localStorage.setItem("lastCorrectDate", currentDate);

              // 정답 횟수를 증가
              setCorrectAnswers((prev) => prev + 1);

              // setUpdateState(true);
            }
            setUpdateState(true);
          } else {
            setShake(true); // 실패 시 shake 상태를 true로 변경
            let savedQnas = JSON.parse(localStorage.getItem("qnas"));
            const newQnas = [
              {
                question: text_x,
                aiQuestion: anotherResponse.data.ai_question,
                aiQuestionKr: anotherResponse.data.ai_question_kr,
                answerSubmit: true,
                answer: "정답이 아닙니다.",
              },
              ...savedQnas,
            ];
            setQnas(newQnas);
            saveQnas(newQnas);
            setTotalQuestionsAsked(totalQuestionsAsked + 1);
            setTimeout(() => setShake(false), 500);
          }
          setBackGroudText("정답을 입력하세요.");
        }
      } else {
        if (text_x.length <= 5) {
          setBackgroundQuestionText("");
          setTotalQuestionsAsked(totalQuestionsAsked + 1);
          setTimeout(
            () => setBackgroundQuestionText("주어를 넣어 질문을 입력하세요"),
            600
          );
        } else {
          // let savedQnas = JSON.parse(localStorage.getItem("qnas"));
          const tempQnas = [
            {
              question: text_x,
              aiQuestion: <Loading />,
              answer: <Loading />,
              aiQuestionKr: <Loading />,
              answerSubmit: false,
              isDelete: false,
              index: totalQuestionsAsked,
            },
            ...qnas,
          ];
          let total = totalQuestionsAsked;
          setQnas(tempQnas); // 임시로 Loading 애니메이션을 표시

          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/question/",
            {
              data: text_x,
            }
          );
          let updatedQnas;
          // console.log(response.data.ai_question);

          let responseString = JSON.stringify(response.data.response);
          let responseProblemCheck = JSON.stringify(
            response.data.problem_check
          );
          console.log(responseString);
          console.log(responseProblemCheck);
          if (
            responseProblemCheck.includes("what") ||
            responseProblemCheck.includes("you")
          ) {
            // if (true) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x && qna.index === total
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answerSubmit: false,
                    isDelete: false,
                    answer: "리롤(reroll) 버튼을 누르거나 질문을 수정해주세요.",
                    problem_check: response.data.problem_check,
                  }
                : qna
            );
          } else if (
            responseString.includes("Yes") ||
            responseString.includes("네")
          ) {
            // if (true) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x && qna.index === total
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answerSubmit: false,
                    isDelete: false,
                    answer: "네.",
                    problem_check: response.data.problem_check,
                  }
                : qna
            );
          } else if (
            responseString.includes("아니오") ||
            responseString.includes("No")
          ) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x && qna.index === total
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answerSubmit: false,
                    isDelete: false,
                    answer: "아니오.",
                    problem_check: response.data.problem_check,
                  }
                : qna
            );
          } else if (
            responseString.includes("Probably no") ||
            responseString.includes("아마도 아닐 겁니다.")
          ) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x && qna.index === total
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answerSubmit: false,
                    isDelete: false,
                    answer: "아마도 아닐 겁니다.",
                    problem_check: response.data.problem_check,
                  }
                : qna
            );
          } else if (
            responseString.includes("Probably") ||
            responseString.includes("아마도 그럴겁니다")
          ) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x && qna.index === total
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answerSubmit: false,
                    isDelete: false,
                    answer: "아마도 맞을 겁니다.",
                    problem_check: response.data.problem_check,
                  }
                : qna
            );
          } else {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x && qna.index === total
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answerSubmit: false,
                    isDelete: false,
                    answer: "중요하지 않은 정보입니다.",
                    problem_check: response.data.problem_check,
                  }
                : qna
            );
          }
          // 모든 질문이 로딩이 완료되었는지 확인
          const allLoaded = updatedQnas.every(
            (qna) => qna.aiQuestion !== Loading && qna.answer !== Loading
          );

          // 로딩 중인 항목이 없을 경우에만 저장
          if (allLoaded) {
            setQnas(updatedQnas); // 응답으로 교체
            saveQnas(updatedQnas);
            setTotalQuestionsAsked(totalQuestionsAsked + 1);
          } // localStorage에 저장
        }
      }
      setIsProcessing(false);
    } catch (error) {
      setIsLoading(false);
      setIsProcessing(false);
      console.error(error);
    }
  };

  const trackPosition = (e, ui) => {
    // Calculate the new color based on newX
    // Here you may need to adapt the calculation based on your actual min and max x values

    // Update position
    setPosition({ x: ui.x, y: ui.y });
  };

  const updateColor = () => {
    const newColor = !tabPressed ? "#5374e8" : "#5DB075";

    // Set the new background color to the button
    document.querySelector(".slider_m").style.border = "1px solid " + newColor;
    document.querySelector(".slider-button_m").style.background = newColor;
    document.querySelector(".send_button_problem_m").style.background =
      newColor;
  };

  const endDrag = () => {
    if (position.x < 14) {
      setPosition({ x: 4, y: 0 });
      setTabPressed(false);
      updateColor();
    } else {
      setPosition({ x: 24, y: 0 });
      setTabPressed(true);
      updateColor();
    }
  };

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function openHintModal() {
    setHintModalIsOpen(true);
  }

  function closeHintModal() {
    setHintModalIsOpen(false);
  }

  function nl2br(str) {
    return str.split("\n").map((line, index, array) => (
      <>
        {line}
        {index === array.length - 1 ? null : <br />}
      </>
    ));
  }
  const toggleTipOne = () => {
    setShowTipOne(!showTipOne);
    setShowTipTwo(false);
  };

  const toggleTipTwo = () => {
    setShowTipTwo(!showTipTwo);
    setShowTipOne(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container_m">
        <div className="all_m">
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

          <div className="problem_box_m">
            <span className="description_m">
              질문을 적으면 '네' 또는 '아니오’ 형식의 답을 받을 수 있습니다.
              <br />
              버튼을 눌러{" " + n}번째 문제의 정답을 맞혀보세요.
            </span>

            <div className="problem_main_box_m">
              <div className="question_box_m">
                <span className="Question_m">{nl2br(question)}</span>
              </div>
            </div>
            {author && <span className="source_m">{`출처 : ${author}`}</span>}
            <div className="check_click_box_m">
              <div className="circle_check_box_m">
                <div className={`slider_m`} onClick={handleCheck}>
                  <Draggable
                    axis="x"
                    bounds={{ left: 4, right: 24, top: 0, bottom: 0 }}
                    position={position}
                  >
                    <div className="slider-button_m"></div>
                  </Draggable>
                </div>
              </div>
              <div className="hint_giveup_button_box_m">
                <button className="giveup_button_m" onClick={openHintModal}>
                  힌트보기
                </button>
                <Modal
                  isOpen={hintmodalIsOpen}
                  onRequestClose={closeHintModal}
                  overlayClassName="ModalOverlay_m"
                  className="ModalContent_m"
                  contentLabel="힌트"
                >
                  <button
                    style={{
                      position: "absolute",
                      right: "-3%",
                      top: "3px",
                      fontSize: "20px",
                      outline: "none",
                      border: "0px",
                      color: "#000000",
                      backgroundColor: "#ffffff",
                    }}
                    onClick={closeHintModal}
                  >
                    x
                  </button>
                  <p
                    style={{
                      fontSize: "15px",
                      // marginBottom: "30px",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    버튼을 눌러 힌트를 확인해보세요.
                  </p>
                  <div
                    style={{ borderTop: "1px solid black" }}
                    className="hint-button-container_m"
                  >
                    <button
                      style={{
                        marginTop: "24px",
                        borderRadius: "4px",
                        border: "1px solid #2d2d2d",
                        backgroundColor: "#ffffff",
                        padding: "7px",
                      }}
                      className="hint_button_m"
                      onClick={() => setHintText(hint)}
                    >
                      {hintText}
                    </button>
                    <button
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #2d2d2d",
                        backgroundColor: "#ffffff",
                        padding: "7px",
                      }}
                      className="hint_button_m"
                      onClick={() => setHintText2(hint2)}
                    >
                      {hintText2}
                    </button>
                  </div>
                </Modal>
                <button className="giveup_button_m" onClick={openModal}>
                  포기하기
                </button>

                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  overlayClassName="ModalOverlay_m"
                  className="ModalContent_m"
                  contentLabel="포기 확인"
                >
                  <p
                    style={{
                      fontSize: "15px",
                      marginBottom: "1rem",
                    }}
                  >
                    정말 포기하시겠습니까?
                  </p>
                  <div className="button-container_m">
                    <button
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #2d2d2d",
                        backgroundColor: "#ffffff",
                        paddingTop: "0.4rem",
                        paddingBottom: "0.4rem",
                        paddingRight: "0.6rem",
                        paddingLeft: "0.6rem",
                        marginLeft: "4rem",
                      }}
                      onClick={closeModal}
                    >
                      취소
                    </button>
                    <button
                      style={{
                        color: "#ffffff",
                        borderRadius: "4px",
                        border: "1px solid #2d2d2d",
                        backgroundColor: "#3E5FD1",
                        paddingTop: "0.4rem",
                        paddingBottom: "0.4rem",
                        paddingRight: "0.6rem",
                        paddingLeft: "0.6rem",
                        marginRight: "4rem",
                      }}
                      onClick={handleGiveUpClick}
                    >
                      확인
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="qeustion_text_box_m">
              <input
                className={`textbox_m ${shake ? "shake" : ""}`}
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder={
                  !tabPressed
                    ? question_step
                      ? `${background_question_text}`
                      : `ex) ${main_character}`
                    : `${background_text}`
                }
              />

              {background_text === "" && (
                <div className="wave_box">
                  {answerloding_text.split("").map((char, i) => (
                    <span
                      style={{
                        animationDelay: `${(i - 1) * 100}ms`,
                        left:
                          i > 2 ? `${1.5 + (i - 3) * 0.6}rem` : `${i * 0.6}rem`,
                      }}
                      className="wave_m"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              )}
              {(background_question_text === "" || background_text === " ") && (
                <h1 className="shake-text_m">5자 이상 입력해주세요.</h1>
              )}
              <div className="slider_box_m">
                <div
                  className="send_button_problem_m"
                  onClick={handleSendClick}
                >
                  <img
                    className="SendButton_m"
                    src={SendButton}
                    alt="SendButton"
                    width="10"
                    height="15"
                    style={{
                      top: "3px",
                      cursor: "move",
                      transition: "left 0.3s ease-out",
                    }}
                  />
                </div>
              </div>
            </div>
            {qnas.map(
              (qna, index) =>
                !qna.isDelete && (
                  <div
                    className="QAresponse_m"
                    style={{ zIndex: qnas.length - index }}
                    key={index}
                  >
                    <QnA
                      question={qna.question}
                      aiQuestion={qna.aiQuestion}
                      aiQuestionKr={qna.aiQuestionKr}
                      answerSubmit={qna.answerSubmit}
                      index={index}
                      answer={qna.answer}
                      opened={index === 0 ? true : false}
                      borderBottomStrength={
                        index === qnas.length - 1 ? "0.01px" : "0px"
                      }
                      updateQnas={(indexToDelete) => {
                        setQnas(
                          qnas.map((qna, index) =>
                            index === indexToDelete
                              ? { ...qna, isDelete: true }
                              : qna
                          )
                        );
                      }}
                      problemCheck={qna.problem_check}
                    />
                  </div>
                )
            )}
          </div>
        </div>
        <div>
          <KeyButton initialShowTip={showTipOne} toggleTip={toggleTipOne} />
        </div>
        <div>
          <ButtonWithTip initialShowTip={showTipTwo} toggleTip={toggleTipTwo} />
        </div>
        <div>
          <ScrollToTopButton className="scroll_to_top_m" />
        </div>
      </div>
    </motion.div>
  );
}
