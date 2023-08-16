import { Link } from "react-router-dom";
import "./mb_page.css";
import Profile from "../../images/Profile.png";
import F22FBeta from "../../images/F22FBeta.png";
import HomeConversation from "../../images/HomeConversation.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollToTopButton from "../../component/scrollbutton_m";
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
      localStorage.setItem("nickname", nickname);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container_m">
        <div className="home_cover_m">
          <div className="up_bar_m">
            <img
              className="F22F_main_m"
              src={F22FBeta}
              alt="F22FBeta"
              onClick={handleLogoClick}
            />

            <div className="nickname_profile_main_m">
              <img
                className="profile_photo_main_m"
                src={Profile}
                alt="Profile"
              />

              <input
                type="text"
                className="nickname_main_m"
                value={nickname}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder="닉네임 입력"
              />
              <div className="checkmakr_box_m">
                <div
                  className={`checkmark ${isAnimating ? "animate" : ""}`}
                ></div>
              </div>
            </div>
          </div>

          <div className="home_title_box_m">
            <span className="home_title_m">my soup recipe</span>
            <span className="home_title_small_m">
              AI 기반 바다거북수프 공장
            </span>
          </div>
          <div className="start_button_box_m">
            {/* <div className="start_button_m"></div> */}
            <Link
              to="/mobileIssue"
              className="home_to_explanation_m"
              style={{ textDecoration: "none" }}
            >
              시작하기
            </Link>
          </div>
          <div className="conversation_box_m">
            <img
              className="HomeConversation"
              src={HomeConversation}
              alt="HomeConversation"
            />
          </div>

          <div className="detail_m">
            <div className="QnA_start_m">질문과 답변</div>
            <div className="QnA_box_m">
              Q. 마이수프레시피는 무엇인가요?
              <div className="QnA_answer_box_m">
                <span className="QnA_answer_m">
                  마이수프레시피는 매일 한 개의 바다거북수프 문제를 선정하여
                  출제하는 곳입니다. 바다거북수프 문제란 보통 기묘한 내용을
                  바탕으로 만들어지는 추리게임입니다. <br />
                  <br />
                  어떠한 상황을 제시하면 왜 그런 상황이 발생했는지 추리해서
                  정답을 맞히면 됩니다. 상상력을 총동원해서 오늘의 정답을
                  맞혀보세요!
                </span>
              </div>
            </div>
            <div className="QnA_box_m">
              <span className="QnA_question_m">
                Q. 게임 방법은 무엇인가요?
                <br />
              </span>
              <div className="QnA_answer_box_m">
                <span className="QnA_answer_m">
                  바다거북수프 문제가 출제되면, 유저들은 AI에게 예, 아니오로
                  대답할 수 있는 질문을 단계에 따라 입력합니다. 질문을 할 때는
                  문장의 끝에 <span className="bold-word_m">‘?’</span>를
                  붙여주세요.
                  <br />
                  <br /> 질문에 대한 답을 듣게 되면, 이를 바탕으로 이야기의
                  전말을 추리합니다. 이렇게 반복하여 문답을 진행한 뒤, 정답을
                  맞히고 싶다면 <span className="bold-word_m">‘Tab 키’</span>를
                  눌러 정답을 작성하면 됩니다.
                </span>
              </div>
            </div>
            <div className="QnA_box_m">
              <span className="QnA_question_m">
                Q. 하루에 한 번 이상 플레이할 수 없나요?
                <br />
              </span>
              <div className="QnA_answer_box_m">
                <span className="QnA_answer_m">
                  {
                    "마이수프레시피는 하루에 한 문제만 출제됩니다. 마이수프레시피는 "
                  }
                  <a
                    href="https://semantle-ko.newsjel.ly/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    '꼬맨틀'
                  </a>
                  을 바탕으로 만들게 되었습니다.
                  <br />
                  <br /> 우리의 목적은 꼬맨틀처럼 &quot;하루 한 번, 여러분의
                  일일퀘스트&quot;가 되는 것입니다. 문제는 국제 표준시(UTC) 기준
                  매일 오후 3시 또는 한국 표준시(KST) 기준 자정에 바뀝니다.
                </span>
              </div>
            </div>
            <div className="QnA_box_m">
              <span className="QnA_question_m">
                Q. 나만의 문제를 출제하는 방법은 무엇인가요?
                <br />
              </span>
              <div className="QnA_answer_box_m">
                <span className="QnA_answer_m">
                  나만의 문제는 ‘오늘의 문제’에 대한 해설 페이지 하단에서 출제할
                  수 있습니다. 해설 페이지는 오늘의 문제를 맞히거나 포기할 시
                  확인 가능합니다.
                  <br />
                  <br /> 문제와 정답(해설)을 적으면, 추후 검토를 거쳐 유저의
                  닉네임과 함께 문제가 출제됩니다. 닉네임은 메인 화면의 우측
                  상단에서 설정할 수 있습니다.
                </span>
              </div>
            </div>
            <div className="QnA_box_m">
              <span className="QnA_question_m">
                Q. 다른 질문이나 피드백은 어떻게 보내나요?
                <br />
              </span>
              <div className="QnA_answer_box_m">
                <span className="QnA_answer_m">
                  질문이나 피드백은 F2__2F@naver.com로 문의해주세요!
                </span>
              </div>
            </div>
          </div>
          <div className="footer_m">
            <p className="Bank_m">카카오뱅크 3333153034882 김영서</p>
            <p className="Bank_m">Copyright 2023. F22F. All rights reserved.</p>
          </div>
        </div>
        <ScrollToTopButton className="scroll_to_top_m" />
      </div>
    </motion.div>
  );
}
