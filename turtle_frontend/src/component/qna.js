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
import Loading from "./loading";
import RecollQuestion from "../images/RecollQuestion.png";
import AiQuestionTag from "../images/AiQuestionTag.png";

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
        left: "2px",
        flexDirection: "column",
        width: "813px",
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Box
        sx={{
          display: "flex",
          gap: "0px",
          alignItems: "center",
          backgroundColor: "#F3F3F3",
          width: "815px",
          minheight: "100px",
          overflowWrap: "break-word",
          wordBreak: "keep-all",
          borderTop: "0.01px solid black",
        }}
      >
        <img
          src={UserIcon}
          alt="SeaTurtle"
          width="26"
          height="27"
          style={{
            padding: "12.5px",
            marginLeft: "10px",
            marginRight: "10px",
            transform: "rotate(11deg)",
          }}
        />

        <Typography>{question}</Typography>

        <img
          src={boxes ? DetailCloseButton : DetailOpenButton}
          width="20"
          height="20"
          style={{
            display: "flex",
            position: "absolute",
            left: "770px",
          }}
          onClick={() => setBoxes(!boxes)}
        ></img>
      </Box>
      {boxes && (
        <div>
          <Box
            sx={{
              display: "flex",
              gap: "0px",
              alignItems: "center",
              backgroundColor: "#FAFAFA",
              width: "815px",
              minheight: "100px",
              overflowWrap: "break-word",
              wordBreak: "keep-all",
              borderTop: "0.01px solid black",
            }}
          >
            <img
              src={AiQuestionTag}
              alt="SeaTurtle"
              width="17"
              height="17"
              style={{
                position: "relative",
                top: "-3px",
                left: "40px",
                padding: "12.5px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
            {isAiLoading ? (
              <div
                style={{
                  display: "flex",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft: "70px",
                  paddingright: "300px",
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
                  left: "25px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft: "0px",
                  fontSize: "14px",
                  color: "#454545",
                  width: "620px",
                }}
              >
                {rerollQuestion}
              </Typography>
            )}
            <img
              src={RerollButton}
              width="15w"
              height="15"
              style={{
                display: "flex",
                position: "absolute",
                top: "65px",
                left: "730px",
              }}
              onClick={rerollResponse}
            ></img>
            <img
              src={RecollQuestion}
              width="20w"
              height="20"
              style={{
                display: "flex",
                position: "absolute",
                top: "63px",
                left: "768px",
              }}
              onClick={rerollQuestionFuntion}
            ></img>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "0px",
              alignItems: "center",
              backgroundColor: "#FAFAFA",
              width: "815px",
              minheight: "100px",
              overflowWrap: "break-word",
              wordBreak: "keep-all",
              // borderTop: "0.01px solid black",
            }}
          >
            <img
              src={AiQuestionTag}
              alt="SeaTurtle"
              width="17"
              height="17"
              style={{
                position: "relative",
                top: "-3px",
                left: "40px",
                padding: "12.5px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            />
            {isAiLoading ? (
              <div
                style={{
                  display: "flex",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft: "70px",
                  paddingright: "300px",
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
                  left: "25px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft: "0px",
                  fontSize: "14px",
                  color: "#454545",
                  width: "620px",
                }}
              >
                {rerollQuestionKr}
              </Typography>
            )}
          </Box>
        </div>
      )}

      <Box
        sx={{
          display: "flex",
          gap: "0px",
          alignItems: "center",
          backgroundColor: "white",
          width: "815px",
          minheight: "100px",

          borderTop: "0.01px solid black",
          overflowWrap: "break-word",
          wordBreak: "keep-all",
          borderBottom: `${borderBottomStrength} solid black`,
        }}
      >
        <img
          src={AiIcon}
          alt="AI"
          width="25"
          height="25"
          style={{
            padding: "12.5px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        />
        <Typography>
          {isAnswerLoading ? (
            <Loading />
          ) : (
            <Typography>{rerolledAnswer}</Typography>
          )}
        </Typography>
      </Box>
      <div
        style={{
          position: "absolute",
          width: "30px",
          height: "30px",
          left: "830px",
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <button
          style={{
            position: "absolute",
            border: "0.1px solid #121212",
            borderRadius: "5px",
            backgroundColor: "#ffffff",
            opacity: isDeleteVisible ? 1 : 0,
            transition: "opacity 0.3s",
            pointerEvents: isDeleteVisible ? "auto" : "none",
          }}
          onClick={handleDeleteClick}
        >
          {" "}
          ㅡ{" "}
        </button>
      </div>
    </Box>
  );
  // }
};

export default QnA;
