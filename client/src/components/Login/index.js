import "./index.css";
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { loginUser } from "../../services/userService";
import { AuthContext } from "../../AuthContextProvider";
import { UserContext } from "../../UserContextProvider";

const Login = ({ navigateTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await loginUser(email, password);
      const userData = { ...response };

      updateUser(userData);
      signIn(response.token);

      navigate(navigateTo || "/questions");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
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
            <button className="form_postBtn" onClick={handleSubmit}>
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
