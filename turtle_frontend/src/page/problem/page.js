import React, { useState, useEffect } from "react";
import axios from "axios";
import QnA from "../../component/qna";
import "./page.css";
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
  const [text_t, setText_t] = useState("");
  const [text_question, setText_Question] = useState(
    "어떤 대상에 대해 알고 싶으신가요?"
  );
  const [question_step, setQuestion_Step] = useState(false);
  const [question_2step_text, setQuestion_2step_Text] = useState("");

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
    console.log("asdasd", savedCorrectAnswers);
    setCorrectAnswers(savedCorrectAnswers);
    console.log("asdasd", correctAnswers);
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
    console.log(savedQnas);
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
      navigate("/explanation", { state: { userAnswer: text_t } });
      // 상태 업데이트 완료 표시
      setUpdateState(false);
    }
  }, [updateState, text]);

  // useEffect(() => {
  //   const now = new Date();
  //   const currentDate = `${now.getFullYear()}-${
  //     now.getMonth() + 1
  //   }-${now.getDate()}`;
  //   localStorage.setItem("date", currentDate);
  // }, [qnas]);

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);
    axios
      .get(process.env.REACT_APP_API_URL + "/getQuestion/")
      .then((response) => {
        const data = response.data;
        setQuestion(data.question);
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
    setQuestion_Step(false);
  };
  const handleAnswerCheckcclick = (asnync) => {
    setTabPressed(true);
    setQuestion_Step(false);
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
      setQuestion_Step(false);
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
      if (tabPressed === true) {
        // 텍스트가 '정답'으로 시작하면 다른 주소로 요청
        if (text_x.length <= 10) {
          setShake(true); // 실패 시 shake 상태를 true로 변경
          const newQnas = [
            { question: text_x, answer: "10자 이상으로 입력해주세요." },
            ...qnas,
          ];
          setQnas(newQnas);
          saveQnas(newQnas);
          setTotalQuestionsAsked(totalQuestionsAsked + 1);
          setTimeout(() => setShake(false), 500);
        } else {
          console.log(text_x);
          const anotherResponse = await axios.post(
            process.env.REACT_APP_API_URL + "/submit/",
            {
              data: text_x + "?",
            }
          );
          console.log(anotherResponse.data.response);
          if (
            anotherResponse.data.response.startsWith("네") ||
            anotherResponse.data.response.startsWith("예") ||
            anotherResponse.data.response.startsWith("맞습니다")
          ) {
            const now = new Date();
            const currentDate = `${now.getFullYear()}-${
              now.getMonth() + 1
            }-${now.getDate()}`;

            localStorage.setItem("endTime", now);
            // 마지막으로 정답을 맞춘 날짜를 불러오기
            const lastCorrectDate = localStorage.getItem("lastCorrectDate");
            const lastGiveUpDate = localStorage.getItem("lastGiveUpDate");
            console.log(lastCorrectDate);
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
              { question: text_x, answer: "정답이 아닙니다." },
              ...qnas,
            ];
            setQnas(newQnas);
            saveQnas(newQnas);
            setTotalQuestionsAsked(totalQuestionsAsked + 1);
            setTimeout(() => setShake(false), 500);
          }
        }
      } else {
        console.log(question_step);
        if (!question_step) {
          setQuestion_Step(true);
          setText_t(text);
          setTimeout(() => setText(""), 0);
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/getJosa/",
            {
              data: text_x,
            }
          );
          setQuestion_2step_Text(response.data.response);
        } else {
          setQuestion_Step(false);
          const tempQnas = [
            {
              question: question_2step_text + " " + text_x,
              answer: <Loading />,
            },
            ...qnas,
          ];
          setQnas(tempQnas); // 임시로 Loading 애니메이션을 표시
          console.log(text_x);
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/question/",
            {
              data: question_2step_text + " " + text_x,
            }
          );
          console.log(question_2step_text + " " + text_x);
          // console(response.data.response);
          let updatedQnas;
          if (
            response.data.response.startsWith("네") ||
            response.data.response.startsWith("예") ||
            response.data.response.startsWith("맞습니다") ||
            response.data.response.startsWith("아니오") ||
            response.data.response.startsWith("아닙니다") ||
            response.data.response.startsWith("모르겠습니다") ||
            response.data.response.startsWith("모릅니다")
          ) {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === question_2step_text + " " + text_x &&
              qna.answer.type === Loading
                ? {
                    question: question_2step_text + " " + text_x,
                    answer: response.data.response,
                  }
                : qna
            );
          } else {
            updatedQnas = tempQnas.map((qna) =>
              qna.question === question_2step_text + " " + text_x &&
              qna.answer.type === Loading
                ? {
                    question: text_x,
                    answer: "예, 아니오로 대답할 수 있는 질문을 해주세요.",
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="all">
          <div className="e218_192">
            <div className="question_box">
              <span className="Question">{question}</span>
            </div>
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
            <p className="qeustion_text">{text_question}</p>

            <div className="qeustion_text_box">
              {question_step && (
                <span className="textbox_step">{question_2step_text}</span>
              )}

              <input
                className={`textbox ${shake ? "shake" : ""}`}
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder="질문을 입력하세요."
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
                  answer={
                    isLoading && qna.question === text ? (
                      <span className="loading">Loading</span>
                    ) : (
                      qna.answer
                    )
                  }
                  borderStrength={index === 0 ? "2px" : "0px"}
                  borderBottomStrength={
                    index === qnas.length - 1 ? "0.01px" : "0px"
                  }
                />
              </div>
            ))}
            <div>
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
                  <button onClick={handleGiveUpClick}>포기하기</button>
                  <button onClick={closeModal}>더해보기</button>
                </div>
              </Modal>
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

          <div className="e168_70">
            <span className="description">
              텍스트 입력 칸에 추측한 내용을 적으면 ‘네’ 또는 ‘아니오’ 형식의
              답을 받을 수 있습니다.
            </span>
            <span className="description_2">
              Tab 키를 눌러 N번째 바다거북수프의 정답을 맞혀보세요.
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
