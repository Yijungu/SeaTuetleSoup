import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  useNavigate,
  useLocation,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Home from "./page/home/page";
import Thanks from "./page/thanks/page";
import Problem from "./page/problem/page";
import MobileHome from "./page/mobileHome/page"; // 이 부분을 추가해주세요.
import MobileThanks from "./page/mobileThanks/page"; // 이 부분을 추가해주세요.
import MobileProblem from "./page/mobileProblem/page"; // 이 부분을 추가해주세요.
import { AnimatePresence } from "framer-motion";

function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobile()) {
      switch (location.pathname) {
        case "/":
          navigate("/mobileHome");
          break;
        case "/explanation":
          navigate("/mobileExplanation");
          break;
        case "/issue":
          navigate("/mobileIssue");
          break;
        default:
          break;
      }
    }
  }, [navigate, location]);

  return (
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explanation" element={<Thanks />} />
        <Route path="/issue" element={<Problem />} />
        <Route path="/mobileHome" element={<MobileHome />} />
        <Route path="/mobileExplanation" element={<MobileThanks />} />
        <Route path="/mobileIssue" element={<MobileProblem />} />
      </Routes>
    </AnimatePresence>
  );
}
//   useEffect(() => {
//     if (isMobile()) {
//       switch (location.pathname) {
//         case "/":
//           navigate("/mobileHome");
//           break;
//         case "/explanation":
//           navigate("/mobileExplanation");
//           break;
//         case "/issue":
//           navigate("/mobileIssue");
//           break;
//         default:
//           break;
//       }
//     }
//   }, [navigate, location]);

//   return (
//     <AnimatePresence>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/explanation" element={<Home />} />
//         <Route path="/issue" element={<Home />} />
//         <Route path="/mobileHome" element={<MobileHome />} />
//         <Route path="/mobileExplanation" element={<MobileHome />} />
//         <Route path="/mobileIssue" element={<MobileHome />} />
//       </Routes>
//     </AnimatePresence>
//   );
// }

function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <AppWrapper />
  </Router>
);

reportWebVitals();
