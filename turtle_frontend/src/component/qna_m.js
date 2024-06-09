import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AiIcon from "../images/AiIcon.png"; // 이미지 import
import UserIcon from "../images/UserIcon.png"; // 이미지 import
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DetailOpenButton from "../images/DetailOpenButton.png"; // 이미지 import
import DetailCloseButton from "../images/DetailCloseButton.png";
import RerollButton from "../images/RerollButton.png";
import axios from "axios";
import Loading from "./loading_m";
import RecollQuestion from "../images/RecollQuestion.png";
import AiQuestionTag from "../images/AiQuestionTag.png";
import QADeleteButton from "../images/QADeleteButton.png";
import GreenGraph from "../images/GreenGraph.png";
import YellowGraph from "../images/YellowGraph.png";
import RedGraph from "../images/RedGraph.png";
import GreenMassege from "../images/GreenMassege.png";
import YellowMassege from "../images/YellowMassege.png";
import RedMassegeYou from "../images/RedMassegeYou.png";
import RedMassegeWhat from "../images/RedMassegeWhat.png";

const QnA = ({
  question,
  answer,
  aiQuestion,
  aiQuestionKr,
  opened,
  index,
  answerSubmit,
  borderBottomStrength,
  updateQnas,
  problemCheck,
}) => {
  const navigate = useNavigate();
  const [boxes, setBoxes] = useState(opened);
  const [rerollQuestion, setRerollQuestion] = useState(aiQuestion);
  const [rerollQuestionKr, setRerollQuestionKr] = useState(aiQuestionKr);
  const [rerolledAnswer, setRerolledAnswer] = useState(answer);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [isAnswerSubmit, setIsAnswerSubmit] = useState(answerSubmit);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isProblemCheck, setIsProblemCheck] = useState(problemCheck);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsProblemCheck(problemCheck);
  }, [problemCheck]);

  useEffect(() => {
    setBoxes(opened);
  }, [opened]);

  useEffect(() => {
    setRerolledAnswer(answer);
  }, [answer]);

  useEffect(() => {
    setRerollQuestion(aiQuestion);
  }, [aiQuestion]);

  useEffect(() => {
    setRerollQuestionKr(aiQuestionKr);
  }, [aiQuestionKr]);

  useEffect(() => {
    setIsAnswerSubmit(answerSubmit);
  }, [answerSubmit]);

  const rerollResponse = async () => {
    setIsAiLoading(true);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/changeQuestion/",
        {
          data: question,
        }
      );
      // console.log(response.data.response_kr);
      if (response.data) {
        let savedQnas = JSON.parse(localStorage.getItem("qnas"));
        savedQnas[index].aiQuestion = response.data.response;
        localStorage.setItem("qnas", JSON.stringify(savedQnas));
        setRerollQuestion(response.data.response);
        setRerollQuestionKr(response.data.response_kr);
      } else {
        console.error("No data in response");
      }
    } catch (error) {
      console.error("Error rerolling response: ", error);
    }
    setIsAiLoading(false);
  };

  const rerollQuestionFuntion = async () => {
    setIsAnswerLoading(true);
    if (!isAnswerSubmit) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "/questionEn/",
          {
            data: rerollQuestion,
          }
        );
        console.log(response.data.response);
        let savedQnas = JSON.parse(localStorage.getItem("qnas"));
        let responseString = JSON.stringify(response.data.response);
        if (responseString.includes("Yes") || responseString.includes("yes")) {
          savedQnas[index].answer = "네.";
          setRerolledAnswer("네.");
        } else if (responseString.includes("No")) {
          savedQnas[index].answer = "아니오.";
          setRerolledAnswer("아니오.");
        } else if (
          responseString.includes("Probably not") ||
          responseString.includes("probably not")
        ) {
          savedQnas[index].answer = "아마 아닐 겁니다.";
          setRerolledAnswer("아마 아닐 겁니다.");
        } else if (
          responseString.includes("Probably") ||
          responseString.includes("probably")
        ) {
          savedQnas[index].answer = "아마 맞을 겁니다.";
          setRerolledAnswer("아마 맞을 겁니다.");
        } else {
          savedQnas[index].answer = "필요없는 정보입니다.";
          setRerolledAnswer("중요하지 않은 정보입니다.");
        }
        localStorage.setItem("qnas", JSON.stringify(savedQnas));
      } catch (error) {
        console.error("Error rerolling response: ", error);
      }
    } else {
      let savedQnas = JSON.parse(localStorage.getItem("qnas"));
      const anotherResponse = await axios.post(
        process.env.REACT_APP_API_URL + "/submit/",
        {
          data: rerollQuestion,
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
        if (lastGiveUpDate !== currentDate && lastCorrectDate !== currentDate) {
          // 현재 날짜를 마지막으로 정답을 맞춘 날짜로 저장

          localStorage.setItem("lastCorrectDate", currentDate);

          // 정답 횟수를 증가
          const savedCorrectAnswers = Number(
            localStorage.getItem("correctAnswers")
          );
          localStorage.setItem("correctAnswers", savedCorrectAnswers + 1);

          // setUpdateState(true);
        }
        navigate("/explanation", { state: { userAnswer: "" } });
      } else {
        savedQnas[index].answer = "정답이 아닙니다.";
        localStorage.setItem("qnas", JSON.stringify(savedQnas));
      }
    }
    setIsAnswerLoading(false);
  };

  const handleDeleteClick = () => {
    setIsDelete(true); // 이 컴포넌트의 삭제 상태를 업데이트
    updateQnas(index); // 상위 컴포넌트의 qnas 상태를 업데이트
  };

  const handleMouseOver = () => {
    setIsDeleteVisible(true);
  };

  const handleMouseOut = () => {
    setIsDeleteVisible(false);
  };

  // if (isDelete) {
  //   return;
  // } else {
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        width: "100%",
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Box
        sx={{
          paddingTop: "0.2rem",
          paddingBottom: "0.2rem",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F3F3F3",
          overflowWrap: "break-word",
          wordBreak: "keep-all",
          borderTop: "0.01px solid black",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <img
            src={UserIcon}
            alt="SeaTurtle"
            width="20"
            height="20"
            style={{
              padding: "0.4rem",
              marginLeft: "0.2rem",
              marginRight: "0.2rem",
              transform: "rotate(11deg)",
            }}
          />

          <Typography
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.01rem",
              display: "flex",
              textAlign: "left",
              width: "90%",
            }}
          >
            {question}
          </Typography>
        </div>
        <img
          src={boxes ? DetailCloseButton : DetailOpenButton}
          width="18"
          height="16"
          style={{
            display: "flex",
            position: "relative",
            marginRight: "0.5rem",
          }}
          onClick={() => setBoxes(!boxes)}
        ></img>
      </Box>
      {boxes && (
        <div>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#FAFAFA",
              overflowWrap: "break-word",
              wordBreak: "keep-all",
              borderTop: "0.01px solid black",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <img
                src={AiQuestionTag}
                alt="SeaTurtle"
                width="14"
                height="14"
                style={{
                  position: "relative",

                  left: "1rem",
                  padding: "0.4rem",
                  marginLeft: "0.2rem",
                  marginRight: "0.2rem",
                }}
              />
              {isAiLoading ? (
                <div
                  style={{
                    display: "flex",
                    padding: "0.65rem",
                    marginLeft: "0.2rem",
                    marginRight: "0.2rem",
                  }}
                >
                  <div>
                    <Loading />
                  </div>
                </div>
              ) : (
                <Typography
                  style={{
                    position: "relative",
                    left: "1rem",
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                    fontSize: "0.75rem",
                    color: "#454545",
                    textAlign: "left",
                    width: "75%",
                  }}
                >
                  {rerollQuestion}
                </Typography>
              )}
            </div>
            <div
              style={{
                marginTop: "0.4rem",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <img
                src={RerollButton}
                width="20"
                height="19"
                style={{
                  display: "flex",
                }}
                onClick={rerollResponse}
              ></img>
              <img
                src={RecollQuestion}
                width="21"
                height="21"
                style={{
                  display: "flex",
                  marginLeft: "1rem",
                  marginRight: "0.4rem",
                }}
                onClick={rerollQuestionFuntion}
              ></img>
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "0px",
              alignItems: "center",
              backgroundColor: "#FAFAFA",
              overflowWrap: "break-word",
              wordBreak: "keep-all",

              // borderTop: "0.01px solid black",
            }}
          >
            <img
              src={AiQuestionTag}
              alt="SeaTurtle"
              width="14"
              height="14"
              style={{
                position: "relative",
                left: "1rem",
                padding: "0.4rem",
                marginLeft: "0.2rem",
                marginRight: "0.2rem",
              }}
            />
            {isAiLoading ? (
              <div
                style={{
                  display: "flex",
                  padding: "0.65rem",
                  marginLeft: "0.2rem",
                  marginRight: "0.2rem",
                }}
              >
                <div>
                  <Loading />
                </div>
              </div>
            ) : (
              <Typography
                style={{
                  position: "relative",
                  left: "1rem",
                  paddingTop: "0.4rem",
                  paddingBottom: "0.4rem",
                  fontSize: "0.75rem",
                  letterSpacing: "0.01rem",
                  color: "#454545",
                  textAlign: "left",
                  width: "80%",
                }}
              >
                {rerollQuestionKr}
              </Typography>
            )}
            <div
              style={{
                position: "relative",
                textAlign: "right",
                width: "20%",
                marginRight: "0.5rem",
              }}
            >
              {isProblemCheck == "noproblem" && (
                <img
                  src={GreenGraph}
                  alt="GreenGraph"
                  width="20"
                  height="15"
                  onMouseEnter={() => setIsHovered(true)} // 마우스가 올라가면 isHovered를 true로 설정
                  onMouseLeave={() => setIsHovered(false)} // 마우스가 내려가면 isHovered를 false로 설정
                  style={{
                    position: "relative",
                  }}
                />
              )}
              {isProblemCheck == "not" && (
                <img
                  src={YellowGraph}
                  alt="YellowGraph"
                  width="20"
                  height="15"
                  onMouseEnter={() => setIsHovered(true)} // 마우스가 올라가면 isHovered를 true로 설정
                  onMouseLeave={() => setIsHovered(false)} // 마우스가 내려가면 isHovered를 false로 설정
                  style={{
                    position: "relative",
                    right: "-30%",
                    padding: "12.5px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                />
              )}
              {(isProblemCheck == "you" || isProblemCheck == "what") && (
                <img
                  src={RedGraph}
                  alt="RedGraph"
                  width="20"
                  height="15"
                  onMouseEnter={() => setIsHovered(true)} // 마우스가 올라가면 isHovered를 true로 설정
                  onMouseLeave={() => setIsHovered(false)} // 마우스가 내려가면 isHovered를 false로 설정
                  style={{
                    position: "relative",
                    right: "-0.4rem",
                    padding: "12.5px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  right: "-1.2rem",
                }}
              >
                {isHovered == true && isProblemCheck == "noproblem" && (
                  <img
                    src={GreenMassege}
                    alt="GreenMassege"
                    width="300"
                    height="150"
                  />
                )}
                {isHovered == true && isProblemCheck == "not" && (
                  <img
                    src={YellowMassege}
                    alt="YellowMassege"
                    width="300"
                    height="150"
                  />
                )}
                {isHovered == true && isProblemCheck == "you" && (
                  <img
                    src={RedMassegeYou}
                    alt="RedGraph"
                    width="300"
                    height="150"
                  />
                )}
                {isHovered == true && isProblemCheck == "what" && (
                  <img
                    src={RedMassegeWhat}
                    alt="RedGraph"
                    width="300"
                    height="150"
                  />
                )}
              </div>
            </div>
          </Box>
        </div>
      )}

      <Box
        sx={{
          paddingTop: "0.2rem",
          paddingBottom: "0.2rem",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderTop: "0.01px solid black",
          overflowWrap: "break-word",
          wordBreak: "keep-all",
          borderBottom: `${borderBottomStrength} solid black`,
        }}
      >
        <img
          src={AiIcon}
          alt="AI"
          width="20"
          height="20"
          style={{
            padding: "0.4rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
          }}
        />
        <Typography>
          {isAnswerLoading ? (
            <Loading />
          ) : (
            <Typography
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.01rem",
              }}
            >
              {rerolledAnswer}
            </Typography>
          )}
        </Typography>
      </Box>
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "99%",
          backgroundColor: "#ffffff",
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <button
          style={{
            position: "absolute",
            width: "0.4rem",
            height: "0.4rem",
            border: "none",
            backgroundColor: "rgba(255, 255, 255, 0)",
            opacity: isDeleteVisible ? 1 : 0,
            // opacity: 1,
            transition: "opacity 0.3s",
            pointerEvents: isDeleteVisible ? "auto" : "none",
          }}
          onClick={handleDeleteClick}
        >
          <img
            src={QADeleteButton}
            alt="QADeleteButton"
            width="12"
            height="12"
          />
        </button>
      </div>
    </Box>
  );
  // }
};

export default QnA;
