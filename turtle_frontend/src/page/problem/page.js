import React, { useState, useEffect } from "react";
import axios from "axios";
import QnA from "../../component/qna";
import "./page.css";
import { useNavigate } from "react-router-dom";
import Profile from "../../images/Profile.png";
import SendButton from "../../images/SendButton.png";
import Loading from "../../component/loading";
import { motion } from 'framer-motion';

export default function Problem() {
  const [text, setText] = useState("");
  const [qnas, setQnas] = useState([]);
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/getQuestion/")
      .then((response) => {
        const data = response.data;
        setQuestion(data.question);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleSendClick = async () => {
    try {
      console.log("asdasd");
      if (text.startsWith("정답")) {
        // 텍스트가 '정답'으로 시작하면 다른 주소로 요청
        const anotherResponse = await axios.post(
          "http://localhost:8000/submit/",
          {
            data: text,
          }
        );
        console.log(anotherResponse.data.response);
        if (anotherResponse.data.response.startsWith("네")) {
          navigate("/thanks", { state: { userAnswer: text } });
        } else {
          setText("");
          setShake(true); // 실패 시 shake 상태를 true로 변경
          setQnas([{ question: text, answer: "정답이 아닙니다." }, ...qnas]);
          setTimeout(() => setShake(false), 500);
        }
      } else {
        const tempQnas = [{ question: text, answer: <Loading /> }, ...qnas];
        setQnas(tempQnas);  // 임시로 Loading 애니메이션을 표시
  
        const response = await axios.post("http://localhost:8000/question/", {
          text,
        });
  
        const updatedQnas = tempQnas.map(qna =>
          qna.question === text && qna.answer.type === Loading
            ? { question: text, answer: response.data.response }
            : qna
        );
  
        setQnas(updatedQnas); // 응답으로 교체
        setText("");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
    <div className="all">
      <div className="e218_192">
        <div className="e102_77">
          <span className="Question">{question}</span>
        </div>
        <input
          className={`textbox ${shake ? 'shake' : ''}`}
          value={text}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <div className="ei125_118_152_168">
          <button className={`send_button`} onClick={handleSendClick}>
            <img
              className="SendButton"
              src={SendButton}
              alt="SendButton"
              width="15"
              height="18"
            />
          </button>
        </div>
        {qnas.map((qna, index) => (
      <div className="QAresponse" key={index}>
        <QnA
          question={qna.question}
          answer={isLoading && qna.question === text ? <span className="loading">Loading</span> : qna.answer}
          borderStrength={index === 0 ? "2px" : "0px"}
          borderBottomStrength={index === qnas.length - 1 ? "0.01px" : "0px"}
        />
      </div>
    ))}
      </div>

      <div className="e28_163">
        <div className="e111_301">
          <span className="nickname">thisis2jun9 님</span>
          <div className="e125_157">
            <img
              className="profile_photo"
              src={Profile}
              alt="Profile"
              width="25"
              height="25"
            />
          </div>
        </div>
        <p className="About">About</p>
        <p className="QnA">QnA</p>
        <p className="Log">Log</p>
        <div className="e125_159">
          <div className="ei125_159_144_2659"></div>
        </div>
        <span className="F22F">F22F</span>
      </div>
      <div className="e168_70">
        <span className="description">
          텍스트 입력 칸에 추측한 내용을 적으면 ‘네’ 또는 ‘아니오’ 형식의 답을
          받을 수 있습니다.
        </span>
        <span className="description_2">
          N번째 바다거북수프의 정답을 맞혀보세요.
        </span>
      </div>
      <div className="e218_179">
        <div className="e186_106"></div>
        <div className="e186_107">
          <div className="ei186_107_5790_3581"></div>
        </div>
        <span className="e186_108">TOP</span>
      </div>
    </div>
     {/* 컴포넌트 내용 */}
     </motion.div>
  );
}
