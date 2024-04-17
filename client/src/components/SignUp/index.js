import React, { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { registerUser } from "../../services/userService";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [contact_no, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const response = await registerUser(
        email,
        username,
        password,
        contact_no
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form title={"Register"}>
      <Input
        title={"Email"}
        id={"signUpEmail"}
        val={email}
        setState={setEmail}
      />
      <Input
        title={"Username"}
        id={"signUpUsername"}
        val={username}
        setState={setUsername}
      />
      <Input
        title={"Password"}
        id={"signUpPassword"}
        val={password}
        setState={setPassword}
      />
      <Input
        title={"Contact Number"}
        id={"signUpContactNumber"}
        val={contact_no}
        setState={setPhoneNumber}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            handleSubmit();
          }}
        >
          Register
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default SignUp;
