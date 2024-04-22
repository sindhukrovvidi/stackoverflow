import React, { useState } from "react";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import Input from "../baseComponents/input";
import { ToastContainer, toast } from "react-toastify";
import { updateUser } from "../../services/userService";
import { useNavigate, useLocation } from "react-router-dom";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contact, about, institution, password, userId} = location.state || {};

  const [updateContact, setupdateContact] = useState(contact);
  const [updateAbout, setAbout] = useState(about);
  const [updateInstitution, setUpdateInstitution] = useState(institution);
  const [updatePassword, setUpdatePassword] = useState(password);
  const [passwordErr, setPasswordErr] = useState(false);

  const saveProfile = async () => {
    let isValid = true;

    if (!updatePassword) {
        setPasswordErr("Password cannot be empty");
        isValid = false;
      }

    if (!isValid) {
        return;
      }

    const response = await updateUser({
      contact_no: updateContact,
      about: updateAbout,
      institution: updateInstitution,
      password: updatePassword,
      userId: userId
    });
    if (response?._id) {
      toast.success("Profile updated successfully");
      navigate("/questions");
    } else {
      toast.error("Unable to edit profile. Login or try after sometime.");
    }
  };

  return (
    <Form>
      <ToastContainer />
      <Input
        title={"Update Password"}
        hint={"Upadte Password"}
        id={"formPasswordInput"}
        val={updatePassword}
        setState={setUpdatePassword}
        err={passwordErr}
      />
      <Input
        title={"Update Contact"}
        hint={"Add contact"}
        id={"formContactInput"}
        val={updateContact}
        setState={setupdateContact}
        mandatory={false}
      />
      <Textarea
        title={"Update About"}
        hint={"Add details"}
        id={"formAboutInput"}
        val={updateAbout}
        setState={setAbout}
        mandatory={false}
      />
      <Input
        title={"Update Institution"}
        hint={"Add Institution"}
        id={"formInstitutionInput"}
        val={updateInstitution}
        setState={setUpdateInstitution}
        mandatory={false}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            saveProfile();
          }}
        >
          Save
        </button>
      </div>
    </Form>
  );
};

export default ProfileEdit;
