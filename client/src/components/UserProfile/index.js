import React, { useState, useEffect, useContext } from 'react';
import "./index.css";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from '../../services/userService';
import { AuthContext } from "../../AuthContextProvider";
const UserProfile = () => {
    const navigate = useNavigate();
    const { csrfToken } = useContext(AuthContext);
    const [user, setUser] = useState({
        username: '',
        joinedOn: '',
        email: '',
        contact: '',
        about: '',
        institution: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            
            const userDetails = await getCurrentUserDetails(csrfToken);
            if (userDetails.success) {
                const { username, createdOn, email, contact_no, about, institution } = userDetails.user;
                setUser({
                    username,
                    joinedOn: createdOn,
                    email,
                    contact: contact_no,
                    about: about || 'No details', // Assuming 'about' is a field in your user model
                    institution: institution || 'Not specified' // Assuming 'institution' is a field in your user model
                });
            } else {
                console.error('Failed to fetch user details');
            }
        };

        fetchData();
    }, []);

    const handleEditProfile = () => {
        navigate('/editprofile');
    };

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-details">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Joined On:</strong> {user.joinedOn}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Contact:</strong> {user.contact}</p>
                <p><strong>About:</strong> {user.about}</p>
                <p><strong>Institution:</strong> {user.institution}</p>
            </div>

            <button className="form_postBtn" onClick={handleEditProfile}>
                Edit Profile
            </button>
        </div>
    );
};

export default UserProfile;
