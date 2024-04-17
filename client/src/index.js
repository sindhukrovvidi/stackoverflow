import React from "react";
import ReactDOM from "react-dom/client";
import "./stylesheets/index.css";
import App from "./App";
import { AuthProvider } from './AuthContextProvider';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AuthProvider><App /></AuthProvider>);
