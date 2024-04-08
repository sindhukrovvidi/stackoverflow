const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/userProfile");
const keys = require('../config/keys.js');

const register = async (req, res) => {
  try {
    const { username, email, password, contact_no } = req.body;
    let user = await UserProfile.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new UserProfile({ username, email, password, contact_no });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserProfile.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }); // Token expires in 1 hour
    res.status(200).json({ token: "Bearer " + token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.post("/register", register);
router.post("/login", login);
module.exports = router;
