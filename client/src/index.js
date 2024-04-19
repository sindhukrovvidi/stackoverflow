import React from "react";
import ReactDOM from "react-dom/client";
import "./stylesheets/index.css";
import App from "./App";
import { AuthProvider } from "./AuthContextProvider";
import { UserProvider, /*UserContext*/ } from "./UserContextProvider";

// window.UserContext = {
//   ...UserContext,
//   updateUser: (userData) => {
//     UserContext.updateUser(userData);
//   }
// };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </AuthProvider>
);
