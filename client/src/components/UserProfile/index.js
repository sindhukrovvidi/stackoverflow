import React, { useState, useEffect } from 'react';
import "./index.css";
import { useNavigate } from "react-router-dom";
import { getCurrentUserDetails } from '../../services/userService';


const UserProfile = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        
        const fetchUserDetails = async () => {
            try {
                const details = await getCurrentUserDetails();
                setUserDetails(details.user);
                console.log("Date received:", userDetails.createdOn);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleEditProfile = () => {
        navigate('/editprofile');
    };

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-details">
                <p><strong>Username:</strong> {userDetails.username}</p>
                <p><strong>Joined On:</strong> {new Date(userDetails.createdOn).toLocaleDateString()}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Contact:</strong> {userDetails.contact_no}</p>
                <p><strong>About:</strong> {userDetails.about}</p>
                <p><strong>Institution:</strong> {userDetails.institution}</p>
            </div>

            <button className="form_postBtn" onClick={handleEditProfile}>
                Edit Profile
            </button>
        </div>
    );
};

export default UserProfile;
