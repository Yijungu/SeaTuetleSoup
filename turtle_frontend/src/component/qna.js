import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AiIcon from "../images/AiIcon.png"; // 이미지 import
import UserIcon from "../images/UserIcon.png"; // 이미지 import
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import DetailOpenButton from "../images/DetailOpenButton.png"; // 이미지 import
import DetailCloseButton from "../images/DetailCloseButton.png";
import RerollButton from "../images/RerollButton.png";
import axios from "axios";
import Loading from "./loading";
import RecollQuestion from "../images/RecollQuestion.png";

const QnA = ({
  question,
  answer,
  aiQuestion,
  borderStrength,
  index,
  borderBottomStrength,
}) => {
  const [boxes, setBoxes] = useState(false);
  const [rerollQuestion, setRerollQuestion] = useState(aiQuestion);
  const [rerolledAnswer, setRerolledAnswer] = useState(answer);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);

  useEffect(() => {
    setRerolledAnswer(answer);
  }, [answer]);

  useEffect(() => {
    setRerollQuestion(aiQuestion);
  }, [aiQuestion]);

  const rerollResponse = async () => {
    setIsAiLoading(true);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/changeQuestion/",
        {
          data: question,
        }
      );
      console.log(response.data.response);
      if (response.data) {
        let savedQnas = JSON.parse(localStorage.getItem("qnas"));
        savedQnas[index].aiQuestion = response.data.response;
        localStorage.setItem("qnas", JSON.stringify(savedQnas));
        setRerollQuestion(response.data.response);
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
      } else if (
        responseString.includes("No") ||
        responseString.includes("no")
      ) {
        savedQnas[index].answer = "아니오.";
        setRerolledAnswer("아니오.");
      } else if (
        responseString.includes("Probably not") ||
        responseString.includes("Probably not.")
      ) {
        savedQnas[index].answer = "아마 아닐 겁니다.";
        setRerolledAnswer("아마 아닐 겁니다.");
      } else if (
        responseString.includes("Probably.") ||
        responseString.includes("Probably")
      ) {
        savedQnas[index].answer = "아마 맞을 겁니다.";
        setRerolledAnswer("아마 맞을 겁니다.");
      } else {
        savedQnas[index].answer = "필요없는 정보입니다.";
        setRerolledAnswer("필요없는 정보입니다.");
      }
      localStorage.setItem("qnas", JSON.stringify(savedQnas));
    } catch (error) {
      console.error("Error rerolling response: ", error);
    }
    setIsAnswerLoading(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "810px",
        // height: "50px",
      }}
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
          width="30"
          height="30"
          style={{
            display: "flex",
            position: "absolute",
            left: "770px",
          }}
          onClick={() => setBoxes(!boxes)}
        ></img>
      </Box>
      {boxes && (
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
          {isAiLoading ? (
            <Loading />
          ) : (
            <Typography>{rerollQuestion}</Typography>
          )}
          <img
            src={RecollQuestion}
            width="23w"
            height="23"
            style={{
              display: "flex",
              position: "absolute",
              left: "730px",
            }}
            onClick={rerollQuestionFuntion}
          ></img>
          <img
            src={RerollButton}
            width="23w"
            height="23"
            style={{
              display: "flex",
              position: "absolute",
              left: "773px",
            }}
            onClick={rerollResponse}
          ></img>
        </Box>
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
          style={{ padding: "12.5px", marginLeft: "10px", marginRight: "10px" }}
        />
        <Typography>
          {isAnswerLoading ? (
            <Loading />
          ) : (
            <Typography>{rerolledAnswer}</Typography>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default QnA;
