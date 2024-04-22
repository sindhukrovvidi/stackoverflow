import React, { useEffect, useState } from "react";
import { getCurrentUserDetails } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { getMetaData } from "../../tool";

const Profile = () => {
  const [joinedDate, setJoinedDate] = useState();
  const [email, setEmail] = useState();
  const [contact, setContact] = useState();
  const [about, setAbout] = useState();
  const [institution, setInstitution] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [userId, setUserId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await getCurrentUserDetails();
        if (userDetails.success) {
          const {
            username,
            createdOn,
            email,
            contact_no,
            about,
            institution,
            password,
            _id
          } = userDetails.user;
          setUsername(username);
          setJoinedDate(createdOn);
          setEmail(email);
          setContact(contact_no);
          setAbout(about);
          setInstitution(institution);
          setPassword(password);
          setUserId(_id);
        }
      } catch (error) {
        console.log("There's an error in fetching the user details. ", error);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    navigate("/editProfile", {
      state: {
        contact: contact,
        about: about,
        institution: institution,
        password: password,
        userId: userId
      },
    });
  };

  return (
    <div className="profile-box">
      <div className="profile-container">
        <h1>User Profile</h1>
        <p>
          <b>Name:</b> {username}
        </p>
        <p>
          <b>Email:</b> {email}
        </p>
        <p>
          <b>About:</b> {about}
        </p>
        <p>
          <b>Contact:</b> {contact}
        </p>
        <p>
          <b>Institution: </b> {institution}
        </p>
        <p>
          <b>Joined StackOverflow On: </b> {getMetaData(new Date(joinedDate))}
        </p>
        <button className="edit-button" onClick={handleEditProfile}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default Profile;
