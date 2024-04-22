const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        email: {type: String, required: true},
        about: { type: String },
        institution:{type: String},
        contact_no: {type: String, required: true},
        createdOn: {type: Date, default: Date.now},
        modifiedOn: {type: Date}
    },
    { collection: "UserProfile" }
);
