// import axios from 'axios';
import React, { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { loginUser } from "../../services/userService";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const response = await loginUser(email, password);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            handleSubmit();
          }}
        >
          Login
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default Login;
