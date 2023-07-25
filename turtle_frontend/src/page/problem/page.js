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
  const [hintText, setHintText] = useState("1단계 힌트");
  const [hintText2, setHintText2] = useState("2단계 힌트");
  const [hint, setHint] = useState("없음");
  const [hint2, setHint2] = useState("없음");

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
    // setQuestion_Step(false);
  };
  const handleAnswerCheckcclick = (asnync) => {
    setTabPressed(true);
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
          setShake(true); // 실패 시 shake 상태를 true로 변경
          const newQnas = [
            {
              question: text_x,
              aiQuestion: "",
              answer: "5자 이상으로 적어주세요.",
            },
            ...qnas,
          ];
          setQnas(newQnas);
          saveQnas(newQnas);
          setTotalQuestionsAsked(totalQuestionsAsked + 1);
          setTimeout(() => setShake(false), 500);
        } else {
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
            const newQnas = [
              {
                question: text_x,
                aiQuestion: anotherResponse.data.ai_question,
                aiQuestionKr: anotherResponse.data.ai_question_kr,
                answer: "정답이 아닙니다.",
              },
              ...qnas,
            ];
            setQnas(newQnas);
            saveQnas(newQnas);
            setTotalQuestionsAsked(totalQuestionsAsked + 1);
            setTimeout(() => setShake(false), 500);
          }
        }
      } else {
        if (!question_step) {
          // setQuestion_Step(true);
          setText_t(text);
          setTimeout(() => setText(""), 0);
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/getJosa/",
            {
              data: text_x,
            }
          );
          // setQuestion_2step_Text(response.data.response);
        } else {
          // setQuestion_Step(false);
          const tempQnas = [
            {
              question: text_x,
              aiQuestion: <Loading />,
              answer: <Loading />,
              aiQuestionKr: <Loading />,
            },
            ...qnas,
          ];
          setQnas(tempQnas); // 임시로 Loading 애니메이션을 표시
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/question/",
            {
              data: text_x,
            }
          );
          let updatedQnas;
          // console.log(response.data.ai_question);
          // console.log(response.data.response);
          let responseString = JSON.stringify(response.data.response);
          if (
            responseString.includes("Yes") ||
            responseString.includes("yes")
          ) {
            // if (true) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x &&
              qna.aiQuestion.type === Loading &&
              qna.answer.type === Loading
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answer: "네.",
                  }
                : qna
            );
          } else if (responseString.includes("No")) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x &&
              qna.aiQuestion.type === Loading &&
              qna.answer.type === Loading
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answer: "아니오.",
                  }
                : qna
            );
          } else if (
            responseString.includes("Probably not") ||
            responseString.includes("probably not.")
          ) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x &&
              qna.aiQuestion.type === Loading &&
              qna.answer.type === Loading
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answer: "아마도 아닐 겁니다.",
                  }
                : qna
            );
          } else if (
            responseString.includes("Probably.") ||
            responseString.includes("probably")
          ) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x &&
              qna.aiQuestion.type === Loading &&
              qna.answer.type === Loading
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answer: "아마도 맞을 겁니다.",
                  }
                : qna
            );
          } else {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === text_x &&
              qna.aiQuestion.type === Loading &&
              qna.answer.type === Loading
                ? {
                    question: text_x,
                    aiQuestion: response.data.ai_question,
                    aiQuestionKr: response.data.ai_question_kr,
                    answer: "필요없는 정보입니다.",
                  }
                : qna
            );
          }
          setQnas(updatedQnas); // 응답으로 교체
          saveQnas(updatedQnas);
          setTotalQuestionsAsked(totalQuestionsAsked + 1); // localStorage에 저장
        }
      }
      setIsProcessing(false);
    } catch (error) {
      setIsLoading(false);
      setIsProcessing(false);
      console.error(error);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="all">
          <div className="e218_192">
            <div className="problem_main_box">
              <div className="question_box">
                <span className="Question">{question}</span>
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
                  <div className="hint-button-container">
                    <button
                      className="hint_button"
                      onClick={() => setHintText(hint)}
                    >
                      {hintText}
                    </button>
                    <button
                      className="hint_button"
                      onClick={() => setHintText2(hint2)}
                    >
                      {hintText2}
                    </button>
                    <button
                      className="hint_button_close"
                      onClick={closeHintModal}
                    >
                      {" "}
                      닫기{" "}
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
                  <h2>정말로 포기를 하시겠습니까?</h2>
                  <div className="button-container">
                    <button onClick={closeModal}>취소</button>
                    <button onClick={handleGiveUpClick}>확인</button>
                  </div>
                </Modal>
              </div>
            </div>
            {author && <span className="source">{`출처 : ${author}`}</span>}
            <div className="circle_check_box">
              <div
                className="quesiton_check_box"
                onClick={handleQuesionCheckcclick}
              >
                <div
                  className={`circle ${!tabPressed ? "checked" : "unchecked"}`}
                ></div>
                {" 질문"}
              </div>
              <div
                className="result_check_box"
                onClick={handleAnswerCheckcclick}
              >
                <div
                  className={`circle ${tabPressed ? "checked" : "unchecked"}`}
                ></div>
                {" 정답"}
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
                      ? "주어를 넣어 질문을 입력하세요."
                      : `ex) ${main_character}`
                    : "정답을 입력해주세요."
                }
              />
            </div>

            <button
              className={`send_button ${tabPressed ? "tabPressed" : ""}`}
              onClick={handleSendClick}
            >
              <img
                className="SendButton"
                src={SendButton}
                alt="SendButton"
                width="15"
                height="18"
              />
            </button>

            {qnas.map((qna, index) => (
              <div className="QAresponse" key={index}>
                <QnA
                  question={qna.question}
                  aiQuestion={qna.aiQuestion}
                  aiQuestionKr={qna.aiQuestionKr}
                  index={index}
                  answer={qna.answer}
                  opened={index === 0 ? true : false}
                  borderBottomStrength={
                    index === qnas.length - 1 ? "0.01px" : "0px"
                  }
                />
              </div>
            ))}
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

          <img
            className="F22F"
            src={F22FBeta}
            alt="F22FBeta"
            onClick={handleLogoClick}
          />
          <div className="e168_70">
            <span className="description">
              텍스트 입력 칸에 추측한 내용을 적으면 ‘네’ 또는 ‘아니오’ 형식의
              답을 받을 수 있습니다.
            </span>
            <span className="description_2">
              Tab 키를 눌러 바다거북수프의 정답을 맞혀보세요.
            </span>
          </div>
          <div>
            <ScrollToTopButton className="scroll_to_top" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
