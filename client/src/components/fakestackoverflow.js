import React, { useState } from "react";
import Header from "./Header";
import SideBarNav from "./SideBarNav";
import { Route, useNavigate, Routes } from "react-router-dom";
import Login from "./Login/index.js";
import SignUp from "./SignUp/index.js";
import NewAnswer from "./NewAnswer/index.js";
import QuestionPage from "./QuestionPage/index.js";
import NewQuestion from "./NewQuestion/index.js";
import AnswerPage from "./AnswerPage";
import TagPage from "./TagPage/index.js";
import Profile from "./Profile/index.js";
import ProfileEdit from "./EditProfile/index.js";
import EditQuestion from "./EditQuestion/index.js";
import EditAnswer from "./EditAnswer/index.js";

export default function fakeStackOverflow() {
  const [selectedTab, setSelectedTab] = useState("q");
  const [title, setQuestionPageTitle] = useState("All Questions");
  const [search, setSearch] = useState("");
  const [isLoggedIn, setLoginStatus]=useState(false);
  const navigate = useNavigate();

  const updateLoginStatus = (val) => {
    setLoginStatus(val)
  }
  const handleQuestions = () => {
    setSearch("");
    setSelectedTab("q");
    setQuestionPageTitle("All Questions");
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
    navigate(`/addAnswer/${qid}`);
  };

  const clickTag = (tagName) => {
    setQuestionPageTitle(tagName);
    setSearch(`[${tagName}]`);
    navigate("/questions");
  };

  const setSearchResults = (value, title) => {
    setSearch(value);
    setQuestionPageTitle(value !== "" ? title : "All Questions");
    navigate("/questions");
  };

  return (
    <div id="main-content" style={{ height: "100vh" }}>
      <Header setSearchResults={setSearchResults} updateLoginStatus={updateLoginStatus} isLoggedIn={isLoggedIn}></Header>
      <div id="main" className="main">
        <SideBarNav
          selected={selectedTab}
          handleQuestions={handleQuestions}
          handleTags={handleTags}
          handleFavourites={handleFavourites}
        />
        <div id="right_main" className="right_main">
          <Routes>
          <Route
              exact
              path="/updateQuestion/:qid"
              element={<EditQuestion />}
            />
            <Route
              exact
              path="/updateAnswer/:aid"
              element={<EditAnswer handleAnswer={handleAnswer}/>}
            />
            <Route
              exact
              path="/addAnswer/:qid"
              element={<NewAnswer handleAnswer={handleAnswer} />}
            />
            <Route exact path="/addQuestion" element={<NewQuestion />} />
            <Route exact path="/login" element={<Login navigateTo={"/questions"} updateLoginStatus={updateLoginStatus}/>} />
            <Route exact path="/register" element={<SignUp />} />
            <Route
              exact
              path="/questions"
              element={
                <QuestionPage
                  title_text={title}
                  handleNewQuestion={handleNewQuestion}
                  handleAnswer={handleAnswer}
                  search={search}
                  clickTag={clickTag}
                />
              }
            />
            <Route
              exact
              path="/answer/:qid"
              element={
                <AnswerPage
                  handleNewQuestion={handleNewQuestion}
                  handleNewAnswer={handleNewAnswer}
                />
              }
            />
            <Route
              exact
              path="/tags"
              element={
                <TagPage
                  handleNewQuestion={handleNewQuestion}
                  clickTag={clickTag}
                />
              }
            />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/editprofile" element={<ProfileEdit />} />
            
          </Routes>
        </div>
      </div>
    </div>
  );
}