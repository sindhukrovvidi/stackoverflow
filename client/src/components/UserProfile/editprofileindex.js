import React, { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { useNavigate } from "react-router-dom";

const EditUserProfile = () => {

    const navigate = useNavigate(); 

    const [about, setAbout] = useState("");
    const [institution, setInstitution] = useState("");
    const [contact_no, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
  
    const handleEditProfileSubmit = async () => {
      // e.preventDefault();
      try {
        navigate('/profile'); 
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <Form title={"Edit Profile"}>
        <Input
          title={"About You:"}
          id={"profileAbout"}
          val={about}
          setState={setAbout}
        />
        <Input
          title={"Institution"}
          id={"profileInstitution"}
          val={institution}
          setState={setInstitution}
        />
        <Input
          title={"Password"}
          id={"profilePassword"}
          val={password}
          setState={setPassword}
        />
        <Input
          title={"Contact Number"}
          id={"profilContactNumber"}
          val={contact_no}
          setState={setPhoneNumber}
        />
        <div className="btn_indicator_container">
          <button
            className="form_postBtn"
            onClick={() => {
              handleEditProfileSubmit();
            }}
          >
            Submit
          </button>
        </div>
      </Form>
    );
};
  


export default EditUserProfile;
