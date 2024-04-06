const mongoose = require("mongoose");

const UserProfile = require("./schema/userProfile");

module.exports = mongoose.model("UserProfile", UserProfile);
