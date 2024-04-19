import React from 'react';
import "./index.css";
import { useNavigate } from "react-router-dom";


const UserProfile = () => {

    const navigate = useNavigate(); 

    const handleEditProfile = async () => {
        try {
          navigate('/editprofile');
        } catch (error) {
          console.error(error);
        }
      };
    

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-details">
                <p><strong>Username:</strong> JohnDoe92</p>
                <p><strong>Joined On:</strong> January 1, 2020</p>
                <p><strong>Email:</strong> johndoe92@example.com</p>
                <p><strong>Contact:</strong> +1234567890</p>
                <p><strong>About:</strong> Passionate web developer with a knack for problem-solving.</p>
                <p><strong>Institution:</strong> University of WebCraft</p>
            </div>
         
            <button className="form_postBtn" onClick={handleEditProfile}>
              Edit Profile
            </button>
        </div>
    );
};

export default UserProfile;
