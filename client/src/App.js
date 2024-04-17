import React from "react";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/index.js";
import Login from "./components/Login/index.js";
import SignUp from "./components/SignUp/index.js";
import NewAnswer from "./components/NewAnswer/index.js";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <FakeStackOverflow /> */}
        <Routes>
          <Route path="/" element={<FakeStackOverflow />} />
          <Route exact path="/answer" element={<ProtectedRoute />}>
            <Route exact path="/answer" element={<NewAnswer />} />
          </Route>
          <Route exact path="/login" element={<Login navigateTo={"/"} />} />
          <Route exact path="/register" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
