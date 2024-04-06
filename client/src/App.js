import React from "react";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute/index.js";
import Login from "./components/Login/index.js";
import SignUp from "./components/SignUp/index.js";
import NewAnswer from "./components/NewAnswer/index.js";

function App() {
  return (
    <>
    <FakeStackOverflow />
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<SignUp />} />
          <Route exact path="/answer" element={<ProtectedRoute><NewAnswer /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;