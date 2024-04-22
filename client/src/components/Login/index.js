import "./index.css";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { loginUser } from "../../services/userService";
import { AuthContext } from "../../AuthContextProvider";
import { checkLoginStatus } from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import { getCsrfToken } from "../../services/config";

const Login = ({ navigateTo, updateLoginStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { updateUser } = useContext(AuthContext);
  const [csrfToken, setCsrfToken] = useState("");

  const navigate = useNavigate();

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await getCsrfToken();
      setCsrfToken(response);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const response = await checkLoginStatus();
      const resLoggedIn = response.loggedIn;
      if (updateLoginStatus) {
        updateLoginStatus(resLoggedIn);
      }

      if (resLoggedIn) updateUser(response.data.user);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }, [csrfToken]);

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
      await checkStatus();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken, checkStatus]);

  const handleSubmit = async () => {
    try {
      const response = await loginUser(email, password);
      if (response.data.success) toast.success("Successfully logged in!");
      if (updateLoginStatus) {
        updateLoginStatus(true);
      }
      updateUser(response.data.user);
      navigate(navigateTo || "/questions");
    } catch (error) {
      toast.error("Unable to login, please try again or check credentials.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <Form title={"Login"}>
        <Input
          title={"Email"}
          id={"loginEmail"}
          val={email}
          setState={setEmail}
        />
        <Input
          title={"Password"}
          id={"loginPassword"}
          val={password}
          setState={setPassword}
        />
        <div className="login-footer">
          <div className="btn_indicator_container_login">
            <button
              className="form_postBtn"
              id="loginPageButton"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
          <div className="registerButton">
            New User? <Link to="/register">Register</Link>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Login;
