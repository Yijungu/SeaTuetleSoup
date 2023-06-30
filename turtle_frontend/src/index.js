import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page/home/page";
import Thanks from "./page/thanks/page";
import Problem from "./page/problem/page";
import { AnimatePresence } from "framer-motion"; // 이 부분을 import 해주세요.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <AnimatePresence>
      {" "}
      {/* 이 부분에 추가했습니다. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="/problem" element={<Problem />} />
      </Routes>
    </AnimatePresence>
  </Router>
);

reportWebVitals();
