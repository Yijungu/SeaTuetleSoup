import React, { useState, useEffect } from "react";
import axios from "axios";
import QnA from "../../component/qna";
import "./page.css";
import { useNavigate } from "react-router-dom";

// 컴포넌트 안에서

export default function Problem() {
  const [text, setText] = useState("");
  const [qnas, setQnas] = useState([]);
  const [question, setQuestion] = useState("");
  const [buttonColor, setButtonColor] = useState("defaultColor");
  const navigate = useNavigate();

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
        }
      } else {
        const response = await axios.post("http://localhost:8000/question/", {
          text,
        });

        setQnas([{ question: text, answer: response.data.response }, ...qnas]);
        setText("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="all">
      <div className="e218_192">
        <div className="e102_77">
          <span className="Question">{question}</span>
        </div>
        <input
          className="textbox"
          value={text}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <div className="ei125_118_152_168">
          <button
            className={`send_button ${buttonColor}`}
            onClick={handleSendClick}
          ></button>
        </div>
      </div>

      <div className="e28_163">
        <div className="e111_301">
          <span className="nickname">thisis2jun9 님</span>
          <div className="e125_157">
            <div className="profile_photo"></div>
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
      {qnas.map((qna, index) => (
        <div className="QAresponse" key={index}>
          <QnA
            question={qna.question}
            answer={qna.answer}
            borderStrength={index === 0 ? "2px" : "0px"}
            borderBottomStrength={index === qnas.length - 1 ? "0.01px" : "0px"}
          />
        </div>
      ))}
      <span className="give_up">포기하기</span>
    </div>
    <span  className="F22F">F22F</span>
  </div>
  <div className="e168_70">
    <span  className="description">텍스트 입력 칸에 추측한 내용을 적으면 ‘네’ 또는 ‘아니오’ 형식의 답을 받을 수 있습니다.</span>
<span  className="description_2">N번째 바다거북수프의 정답을 맞혀보세요.</span>
</div>
  <div className="e218_180">
    <div className="e102_77">
      <div className="ei102_77_152_95"></div>
    </div><span  className="Question">여자는 귀가하기 위해 엘리베이터를 타려다가,
자신의 남편이 죽은 것을 깨달았다. 왜 그랬을까?</span>
  </div>
  <div className="e218_179">
    <div className="e186_106"></div>
    <div className="e186_107">
      <div className="ei186_107_5790_3581"></div>
    </div><span  className="top">TOP</span>
  </div>
  <span  className="give_up">포기하기</span>
</div>
    )
  );
}
