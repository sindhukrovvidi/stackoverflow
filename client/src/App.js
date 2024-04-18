import React from "react";
import "./stylesheets/App.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <FakeStackOverflow />
    </Router>
  );
}

export default App;
