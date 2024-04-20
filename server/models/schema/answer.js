const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.Schema(
    {
        text: {type: String, required: true},
        ans_by: { type: Schema.Types.ObjectId, ref: "UserProfile" },
        ans_date_time: {type: Date, default: Date.now}
    },
    { collection: "Answer" }
);
