import React, { useState } from "react";
import Header from "./Header";
import SideBarNav from "./SideBarNav";
import {
  Route,
  useNavigate,
  Routes,
//   BrowserRouter as Router,
} from "react-router-dom";
// import { useNavigate,  } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/index.js";
import Login from "./Login/index.js";
import SignUp from "./SignUp/index.js";
import NewAnswer from "./NewAnswer/index.js";
// import Question from "./components/QuestionPage/question/index.js";
import QuestionPage from "./QuestionPage/index.js";
import NewQuestion from "./NewQuestion/index.js";
import AnswerPage from "./AnswerPage";

export default function fakeStackOverflow() {
  const [selectedTab, setSelectedTab] = useState("q");
  const navigate = useNavigate();

  const handleQuestions = () => {
    setSelectedTab("q");
    navigate("/questions");
  };

  const handleTags = () => {
    setSelectedTab("t");
  };

  const handleFavourites = () => {
    setSelectedTab("f");
  };

  const handleNewQuestion = () => {
    navigate("/addQuestion");
  };

  const handleAnswer = (qid) => {
    navigate(`/answer/${qid}`);
  };


  return (
    <div id="main-content" style={{ height: "100vh" }}>
      <Header></Header>
      <div id="main" className="main">
        <SideBarNav
          selected={selectedTab}
          handleQuestions={handleQuestions}
          handleTags={handleTags}
          handleFavourites={handleFavourites}
        />
        <div id="right_main" className="right_main">
          <Routes>
            <Route exact path="/addAnswer" element={<ProtectedRoute />}>
              <Route exact path="/addAnswer" element={<NewAnswer />} />
            </Route>
            <Route exact path="/addQuestion" element={<ProtectedRoute />}>
              <Route exact path="/addQuestion" element={<NewQuestion />} />
            </Route>
            <Route exact path="/login" element={<Login navigateTo={"/"} />} />
            <Route exact path="/register" element={<SignUp />} />
            <Route exact path="/questions" element={<QuestionPage handleNewQuestion={handleNewQuestion} handleAnswer={handleAnswer}/>} />
            <Route exact path="/answer/:qid" element={<AnswerPage handleNewQuestion={handleNewQuestion} handleAnswer={handleAnswer}/>} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
