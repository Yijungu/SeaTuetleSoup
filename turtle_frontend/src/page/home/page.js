import { Link } from "react-router-dom";
import "./page.css";
import Profile from "../../images/Profile.png";
import Check from "../../images/Check.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollToTopButton from "../../component/scrollbutton";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || ""
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setNickname(event.target.value);
  };
  const handleLogoClick = async () => {
    navigate("/");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 900);
      localStorage.setItem("nickname", nickname); // The animation lasts 900ms
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="e4_2">
          <div className="e6_15">
            <span className="e6_16">My Soup Recipe</span>
            <span className="e6_17">AI 기반 바다거북수프 공장</span>
          </div>
          <div className="e6_18">
            <div className="start_button"></div>
            <Link
              to="/issue"
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
          <button className="F22F_main" onClick={handleLogoClick}>
            F22F
          </button>
          <div className="e204_184">
            <div className="e186_126"></div>
            <div className="checkmakr_box">
              <div
                className={`checkmark ${isAnimating ? "animate" : ""}`}
              ></div>
            </div>
            <div className="nickname_profile_main">
              <div className="e186_114">
                <img
                  className="profile_photo_main"
                  src={Profile}
                  alt="Profile"
                  width="30"
                  height="30"
                />
              </div>
              <input
                type="text"
                className="nickname_main"
                value={nickname}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder="닉네임을 입력하세요."
              />
            </div>
          </div>
          <div className="e186_174">
            <span className="e186_175">Q. 마이수프레시피란 무엇인가요?</span>
            <p className="A_dot"> A.</p>
            <span className="e186_178">
              마이수프레시피는 매일 한 개의 바다거북수프 문제를 선정하여
              출제하는 곳입니다. 바다거북수프 문제란 보통 기묘한 내용을 바탕으로
              만들어지는 추리게임입니다. 어떠한 상황을 제시하면 왜 그런 상황이
              발생했는지 추리해서 정답을 맞히면 됩니다. 상상력을 총동원해서
              오늘의 정답을 맞혀보세요!
            </span>
          </div>
          <div className="e186_176">
            <span className="e186_177">질문과 답변</span>
          </div>
          <div className="e186_179">
            <span className="e186_175">Q. 게임 방법은 무엇인가요?</span>
            <p className="A_dot"> A.</p>
            <span className="e186_178">
              바다거북수프 문제가 출제되면, 유저들은 AI에게 예, 아니오로 대답할
              수 있는 질문을 입력합니다. 질문을 할 때는 문장의 끝에{" "}
              <span className="bold-word">‘?’</span>를 붙여주세요. 질문에 대한
              답을 듣게 되면, 이를 바탕으로 이야기의 전말을 추리합니다. 이렇게
              반복하여 문답을 진행한 뒤, 정답을 맞히고 싶다면{" "}
              <span className="bold-word">‘Tab 키’</span>를 눌러 정답을 작성하면
              됩니다.
            </span>
          </div>
          <div className="e186_182">
            <span className="e186_175">
              Q. AI가 어떻게 정답임을 인지하나요?
            </span>
            <p className="A_dot"> A.</p>
            <span className="e186_178">
              오늘의 정답에서 꼭 들어가야 할 핵심 키워드들을 몇 개씩
              정해놓습니다. AI는 유저가 제출한 답과 키워드들의 문맥이 일치하는지
              판단합니다. 유저가 어느 정도 정답과 가까운 내용을 작성하였다면
              정답을 공개합니다.
            </span>
          </div>
          <div className="e186_185">
            <span className="e186_175">
              Q. 마이수프레시피의 문제는 어떻게 정해지나요?
            </span>
            <p className="A_dot"> A.</p>
            <span className="e186_178">
              마이수프레시피는 AI 모델을 기반으로 이야기를 구성합니다. AI는 여러
              번의 테스트를 거쳐 마이수프레시피만의 최적화된 AI를 사용하고
              있습니다. 그 후 수정, 보완하는 과정을 거쳐 좀 더 개연성 있고
              흥미로운 문제가 완성됩니다.
            </span>
          </div>
          <div className="e186_188">
            <span className="e186_175">
              Q. 하루에 한 번 이상 플레이할 수 없나요?
            </span>
            <p className="A_dot"> A.</p>
            <span className="e186_178">
              마이수프레시피는 하루에 한 문제만 출제됩니다. 마이수프레시피는
              <a
                href="https://semantle-ko.newsjel.ly/"
                target="_blank"
                rel="noopener noreferrer"
              >
                '꼬맨틀'
              </a>
              을 바탕으로 만들게 되었습니다. 우리의 목적은 꼬맨틀처럼 &quot;하루
              한 번, 여러분의 일일퀘스트&quot;가 되는 것입니다. 문제는 국제
              표준시(UTC) 기준 매일 오후 3시 또는 한국 표준시(KST) 기준 자정에
              바뀝니다.
            </span>
          </div>
          <div className="e186_191">
            <span className="e186_175">
              Q. 여태까지 플레이한 기록을 볼 수 있나요?
            </span>
            <p className="A_dot"> A.</p>
            <span className="e186_178">
              마이수프레시피는 쿠키를 사용하여 유저의 닉네임 및 개인 게임 통계를
              저장하며, 통계 수집을 위해 쿠키 정보를 사용합니다. 따라서 동일
              브라우저에서 플레이했다면, 여태까지 플레이했던 기록을 확인할 수
              있습니다.
            </span>
          </div>
          <div className="e186_197">
            <span className="e186_175">
              Q. 다른 질문이나 피드백은 어떻게 보내나요?
            </span>
            <p className="A_dot"> A.</p>
            <span className="e186_178">
              질문이나 피드백은 F2__2F@naver.com로 문의해주세요!
            </span>
          </div>
          <ScrollToTopButton className="scroll_to_top" />
        </div>
      </div>
    </motion.div>
  );
}
