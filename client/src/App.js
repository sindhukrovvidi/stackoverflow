import React from "react";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/index.js";
import Login from "./components/Login/index.js";
import SignUp from "./components/SignUp/index.js";
import NewAnswer from "./components/NewAnswer/index.js";
// import Question from "./components/QuestionPage/question/index.js";
import QuestionPage from "./components/QuestionPage/index.js";
import NewQuestion from "./components/NewQuestion/index.js";

function App() {
  return (
    <Router>
      <FakeStackOverflow>
        <Routes>
          <Route exact path="/addAnswer" element={<ProtectedRoute />}>
            <Route exact path="/addAnswer" element={<NewAnswer />} />
          </Route>
          <Route exact path="/addQuestion" element={<ProtectedRoute />}>
            <Route exact path="/addQuestion" element={<NewQuestion />} />
          </Route>
          <Route exact path="/login" element={<Login navigateTo={"/"} />} />
          <Route exact path="/register" element={<SignUp />} />
          <Route exact path="/questions" element={<QuestionPage />} />
        </Routes>
      </FakeStackOverflow>
    </Router>
  );
}

export default App;