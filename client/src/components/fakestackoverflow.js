import React, { useState } from "react";
import Header from "./Header";
import SideBarNav from "./SideBarNav";
import {
  Route,
  useNavigate,
  Routes,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/index.js";
import Login from "./Login/index.js";
import SignUp from "./SignUp/index.js";
import NewAnswer from "./NewAnswer/index.js";
import QuestionPage from "./QuestionPage/index.js";
import NewQuestion from "./NewQuestion/index.js";
import AnswerPage from "./AnswerPage";
import TagPage from "./TagPage/index.js";

export default function fakeStackOverflow() {
  const [selectedTab, setSelectedTab] = useState("q");
  const [title, setQuestionPageTitle] = useState("All Questions")
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleQuestions = () => {
    setSelectedTab("q");
    setQuestionPageTitle('All Questions')
    navigate("/questions");
  };

  const handleTags = () => {
    setSelectedTab("t");
    navigate("/tags");
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

  const handleNewAnswer = (qid) => {
    navigate(`/addAnswer/${qid}`)
  }

  const clickTag = (tagName) => {
    setQuestionPageTitle(tagName)
    setSearch(`[${tagName}]`);
    navigate("/questions");
  }


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
            <Route exact path="/addAnswer/:qid" element={<ProtectedRoute />}>
              <Route exact path="/addAnswer/:qid" element={<NewAnswer handleAnswer={handleAnswer}/>} />
            </Route>
            <Route exact path="/addQuestion" element={<ProtectedRoute />}>
              <Route exact path="/addQuestion" element={<NewQuestion />} />
            </Route>
            <Route exact path="/login" element={<Login navigateTo={"/"} />} />
            <Route exact path="/register" element={<SignUp />} />
            <Route exact path="/questions" element={<QuestionPage title_text={title} handleNewQuestion={handleNewQuestion} handleAnswer={handleAnswer} search={search}/>} />
            <Route exact path="/answer/:qid" element={<AnswerPage handleNewQuestion={handleNewQuestion} handleNewAnswer={handleNewAnswer}/>} />
            <Route exact path="/tags" element={<TagPage handleNewQuestion={handleNewQuestion} clickTag={clickTag}/>} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
