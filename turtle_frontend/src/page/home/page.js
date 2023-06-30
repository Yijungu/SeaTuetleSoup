import { Link } from "react-router-dom";
import "./page.css";
import Profile from "../../images/Profile.png";
import Check from "../../images/Check.png";
import { motion } from "framer-motion";
import ScrollToTopButton from "../../component/scrollbutton";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || ""
  );

  useEffect(() => {
    localStorage.setItem("nickname", nickname);
  }, [nickname]);

  const handleChange = (event) => {
    setNickname(event.target.value);
  };

  const handleClick = () => {
    localStorage.setItem("nickname", nickname);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="e4_2">
        <div className="e6_15">
          <span className="e6_16">My Soup Recipe 🍽️</span>
          <span className="e6_17">AI 기반 바다거북수프 공장</span>
        </div>
        <div className="e6_18">
          <div className="start_button"></div>
          <Link
            to="/problem"
            className="e6_20"
            style={{ textDecoration: "none" }}
          >
            시작하기 ✨{" "}
          </Link>
        </div>
        <div className="e19_10">
  
            <div className="computer_top"></div>
            <div className="e6_24"></div>
        
          <div className="e6_28"></div>
          <div className="e6_25"></div>
          <div className="e6_26"></div>
          <div className="e6_27"></div>
          <div className="e12_16">
            <div className="my_chat_box"></div>
            <span className="my_chat">바닷가 레스토랑인게 중요합니까?</span>
          </div>
          <div className="e6_30">
            <div className="AI_chat_box_2"></div>
            <span className="AI_chat_2">
              네. 그 남자의 과거와 관련있습니다.
            </span>
          </div>
          <div className="e12_26">
            <div className="AI_chat_box"></div>
            <span className="AI_chat">네. 조금은 관계 있습니다.</span>
          </div>
          <div className="e6_29">
            <div className="my_chat_box_2"></div>
            <span className="my_chat">
              수프가 남자의 과거와 관련이 있나요?{" "}
            </span>
          </div>
        </div>
        <button className="F22F_main">F22F</button>
        <div className="e204_184">
          <div className="e186_126"></div>
          <div className="e186_133" onClick={handleClick}>
            <img
              className="check"
              src={Check}
              alt="Profile"
              width="30"
              height="30"
            />
          </div>

          <div className="nickname_profile_main">
            <div className="e186_114">
              <img
                className="profile_photo_main"
                src={Profile}
                alt="Profile"
                width="23"
                height="23"
              />
            </div>
            <input
              type="text"
              className="nickname_main"
              value={nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요."
            />
            
          </div>
          <p className="border_line"></p>
        </div>
        <div className="e186_174">
          <p className="e186_175">Q. 바다거북수프란 무엇인가요?</p>
          <p className="e186_178">
            A. 전세계 곳곳에서 유행 중인 나폴리탄 괴담 계열의 수수께끼입니다.
          </p>
          <p className="e186_178_2">
            보통 기묘한 내용을 바탕으로 만들어지는 추리 놀이입니다.
          </p>
        </div>
        <div className="e186_176">
          <span className="e186_177">질문과 답변</span>
        </div>
        <div className="e186_179">
          <p className="e186_175">Q. 바다거북수프를 하는 방법은 무엇인가요?</p>
          <p className="e186_178">
            A. 출제자가 이야기 형식의 수수께끼를 만들어 출제합니다. 참가자들은
            출제자에게 예 또는 아니오로 대답할 수 있는 질문을 하고, 출제자는
            그에 대한 대답을 합니다. 정보를 통해 참가자들은 이야기의 전말을
            추리합니다. 가장 답에 가까운 질문을 하게 되는 때가 오면 출제자는
            정답을 공개합니다.
          </p>
        </div>
        <div className="e186_182">
          <p className="e186_175">Q. AI가 어떻게 정답임을 인지하나요?</p>
          <p className="e186_178">A. ??</p>
        </div>
        <div className="e186_185">
          <p className="e186_175">Q. 여태 플레이한 기록을 볼 수 있나요?</p>
          <p className="e186_178">
            A. 플레이한 기록은 우측 상단의 ‘log’에서 볼 수 있습니다. 홈 화면에서
            닉네임을 입력하면 어쩌고~
          </p>
        </div>
        <div className="e186_188">
          <span className="e186_175">
            Q. 바다거북수프 이야기는 어떻게 정해지나요?
          </span>
          <span className="e186_178">A. ??</span>
        </div>
        <div className="e186_191">
          <span className="e186_175">
            Q. 하루에 한 번 이상 플레이할 수 없나요?
          </span>
          <span className="e186_178">
            A. 바다거북수프는 하루에 한 번만 플레이 할 수 있습니다. 저희는
            꼬맨틀과 같은 게임의 핵심 요소는 &quot;하루에 한 번만, 모두가 동일한
            정답&quot;이라고 생각합니다. 정답 단어는 국제 표준시(UTC) 기준 매일
            오후 3시 또는 한국 표준시(KST) 기준 자정에 바뀝니다.
          </span>
        </div>
        <div className="e186_194">
          <span className="e186_175">
            Q. 다른 질문이나 피드백은 어떻게 보내나요?
          </span>
          <span className="e186_178">
            A. 질문이나 피드백은 F22F 메일로 문의해주세요!
          </span>
        </div>
        <ScrollToTopButton className="scroll_to_top" />
      </div>
    </motion.div>
  );
}
