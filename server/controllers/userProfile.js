const express = require("express");
const router = express.Router();
const UserProfile = require("../models/userProfile");
const mongoose = require('mongoose');
const csrf = require('csurf')({ ignoreMethods: ['POST'] }); 

const register = async (req, res) => {
  try {
    const { username, email, password, contact_no } = req.body;
    let user = await UserProfile.findOne({ email });
    if (user) {
      return res.status(400).json({ status: 400,message: "User already exists" });
    }
    user = new UserProfile({ username, email, password, contact_no });
    await user.save();

    res.status(200).json({ status: 200, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500,message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await UserProfile.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user) {
      req.session.user = user;
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
};
const getCurrentUser = async (req, res) => {
  if (req.session.user) {
    const userData = req.session.user;
    res.json({ ...userData });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const getCurrentUserDetails = async (req, res) => {
  if (req.session.user) {
    const userData = req.session.user;
    const email = userData.email;
    const user = await UserProfile.findOne({ email });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const updateUser = async (req, res) => {
  try {
      const {password, about, institution, contact_no, modifiedOn, userId} = req.body;
      const updatedObject = {};
      if(password) updatedObject.password = password;
      if(about) updatedObject.about = about;
      if(institution) updatedObject.institution = institution;
      if(contact_no) updatedObject.contact_no = contact_no;
      if(modifiedOn) updatedObject.modifiedOn = new Date(modifiedOn);
  
      const updatedUser = await UserProfile.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId)},
        updatedObject,
        { new: true }
      )
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).send(updatedUser);
  } catch (err) {
    console.error("Error while updating user: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
router.use(csrf);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getCurrentUser", getCurrentUser);
router.get("/getCurrentUserDetails", getCurrentUserDetails);
router.post("/updateUser", updateUser);
module.exports = router;
