import React, { useState } from "react";
import scrollToTopImage from "../images/ScrollToTopButton.png";

const ScrollToTopButton = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 버튼의 가시성을 토글
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 화면 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={className} onClick={scrollToTop}>
      <img src={scrollToTopImage} alt="Go to top" width="45" height="35" />
    </div>
  );
};

export default ScrollToTopButton;
