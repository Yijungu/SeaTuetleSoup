import React, { useState, useEffect } from "react";
import axios from "axios";
import QnA from "../../component/qna";
import "./page.css";
import F22FBeta from "../../images/F22FBeta.png";
import { useNavigate } from "react-router-dom";
import Profile from "../../images/Profile.png";
import SendButton from "../../images/SendButton.png";
import Loading from "../../component/loading";
import { motion } from "framer-motion";
import Modal from "react-modal";
import ScrollToTopButton from "../../component/scrollbutton";
import ButtonWithTip from "../../component/tiptoolbutton";
import Draggable from "react-draggable";

export default function Problem() {
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
  const [background_text, setBackGroudText] = useState("정답을 입력하세요.");
  const [background_question_text, setBackgroundQuestionText] =
    useState("주어를 넣어 질문을 입력하세요.");
  const [answerloding_text, setAnswerLodingText] =
    useState("정답을 확인중입니다.");
  const [position, setPosition] = useState({ x: 5, y: 0 });
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
    }
  }, []);

  useEffect(() => {
    if (updateState) {
      if (givup) {
        navigate("/explanation", { state: { userAnswer: "" } });
        setUpdateState(false);
      } else {
        navigate("/explanation", { state: { userAnswer: text_t } });
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
  const handleQuesionCheckcclick = (asnync) => {
    setTabPressed(false);
    setTimeout(() => setPosition({ x: 8, y: 0 }));
    updateColor();
    // setQuestion_Step(false);
  };
  const handleAnswerCheckcclick = (asnync) => {
    setTabPressed(true);
    setTimeout(() => setPosition({ x: 35, y: 0 }));
    updateColor();
    // setQuestion_Step(false);
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
      if (position.x == 35) {
        setTimeout(() => setPosition({ x: 8, y: 0 }));
        updateColor();
      } else {
        setTimeout(() => setPosition({ x: 35, y: 0 }));
        updateColor();
      }
      // setQuestion_Step(false);
    }
    if (e.key === "Escape") {
      // setQuestion_Step(false);
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
          console.log(anotherResponse.data.response);
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
          console.log(responseString);
          if (responseString.includes("Yes") || responseString.includes("네")) {
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
    document.querySelector(".slider").style.border = "1px solid " + newColor;
    document.querySelector(".slider-button").style.background = newColor;
  };

  const endDrag = () => {
    if (position.x < 21) {
      setPosition({ x: 8, y: 0 });
      setTabPressed(false);
      updateColor();
    } else {
      setPosition({ x: 35, y: 0 });
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="all">
          <div className="upbar">
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

            <img
              className="F22F"
              src={F22FBeta}
              alt="F22FBeta"
              onClick={handleLogoClick}
            />
          </div>
          <div className="problem_box">
            <div className="description_box">
              <span className="description">
                텍스트 입력 칸에 추측한 내용을 적으면 ‘네’ 또는 ‘아니오’ 형식의
                답을 받을 수 있습니다. <br /> Tab 키를 눌러 {n}번째 문제의
                정답을 맞혀보세요.
              </span>
            </div>
            <div className="problem_main_box">
              <div className="question_box">
                <span className="Question">{nl2br(question)}</span>
              </div>
            </div>
            {author && <span className="source">{`출처 : ${author}`}</span>}
            <div className="check_click_box">
              <div className="circle_check_box">
                <div
                  className="quesiton_check_box"
                  onClick={handleQuesionCheckcclick}
                >
                  <div
                    className={`circle ${
                      !tabPressed ? "checked" : "unchecked"
                    }`}
                  ></div>
                  {" 질문"}
                </div>
                <div
                  className="quesiton_check_box"
                  onClick={handleAnswerCheckcclick}
                >
                  <div
                    className={`circle ${tabPressed ? "checked" : "unchecked"}`}
                  ></div>
                  {" 정답"}
                </div>
              </div>
              <div className="hint_giveup_button_box">
                <button className="hint_button_box" onClick={openHintModal}>
                  힌트 보기
                </button>
                <Modal
                  isOpen={hintmodalIsOpen}
                  onRequestClose={closeHintModal}
                  overlayClassName="ModalOverlay"
                  className="ModalContent"
                  contentLabel="포기 확인"
                >
                  <button
                    style={{
                      position: "absolute",
                      right: "3px",
                      top: "3px",
                      outline: "none",
                      border: "0px",
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
                    className="hint-button-container"
                  >
                    <button
                      style={{
                        marginTop: "20px",
                        borderRadius: "4px",
                        border: "1px solid #2d2d2d",
                        backgroundColor: "#ffffff",
                        padding: "7px",
                      }}
                      className="hint_button"
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
                      className="hint_button"
                      onClick={() => setHintText2(hint2)}
                    >
                      {hintText2}
                    </button>
                  </div>
                </Modal>
                <button className="giveup_button" onClick={openModal}>
                  포기하기
                </button>

                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  overlayClassName="ModalOverlay"
                  className="ModalContent"
                  contentLabel="포기 확인"
                >
                  <p
                    style={{
                      fontSize: "15px",
                      marginBottom: "30px",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    정말 포기하시겠습니까?
                  </p>
                  <div className="button-container">
                    <button
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #2d2d2d",
                        backgroundColor: "#ffffff",
                        marginLeft: "30px",
                        padding: "0px",
                      }}
                      onClick={closeModal}
                    >
                      <p
                        style={{
                          marginTop: "5px",
                          marginBottom: "5px",
                          marginLeft: "10px",
                          marginRight: "10px",
                        }}
                      >
                        취소
                      </p>
                    </button>
                    <button
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #2d2d2d",
                        backgroundColor: "#3E5FD1",
                        marginRight: "30px",
                        padding: "0px",
                      }}
                      onClick={handleGiveUpClick}
                    >
                      <p
                        style={{
                          color: "#ffffff",
                          marginTop: "5px",
                          marginBottom: "5px",
                          marginLeft: "10px",
                          marginRight: "10px",
                        }}
                      >
                        확인
                      </p>
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="qeustion_text_box">
              <input
                className={`textbox ${shake ? "shake" : ""}`}
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
                <h1 style={{ position: "absolute" }}>
                  {answerloding_text.split("").map((char, i) => (
                    <span
                      style={{
                        animationDelay: `${(i - 1) * 100}ms`,
                        left: i > 2 ? `${33 + (i - 3) * 13}px` : `${i * 13}px`,
                      }}
                      className="wave"
                    >
                      {char}
                    </span>
                  ))}
                </h1>
              )}
              {(background_question_text === "" || background_text === " ") && (
                <h1 className="shake-text">5자 이상 입력해주세요.</h1>
              )}
              <div className={`slider`}>
                <Draggable
                  axis="x"
                  bounds={{ left: 8, right: 35, top: 0, bottom: 0 }}
                  position={position}
                  onDrag={trackPosition}
                  onStop={endDrag}
                >
                  <div className="slider-button" onClick={handleSendClick}>
                    <img
                      className="SendButton"
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
                </Draggable>
              </div>
            </div>
            {qnas.map(
              (qna, index) =>
                !qna.isDelete && (
                  <div className="QAresponse" key={index}>
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
                    />
                  </div>
                )
            )}
          </div>

          <div>
            <ButtonWithTip />
          </div>
          <div>
            <ScrollToTopButton className="scroll_to_top" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
