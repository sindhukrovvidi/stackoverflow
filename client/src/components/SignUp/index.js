import React, { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { registerUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [contact_no, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const response = await registerUser(
        email,
        username,
        password,
        contact_no
      );
      if(response.status === 200) {
        navigate("/login")
      } else {
        toast.error("Unable to register the user");
      }
    } catch (error) {
      toast.error("Unable to register the user");
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
        <ToastContainer />
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default SignUp;
