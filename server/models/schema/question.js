const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Schema for questions
module.exports = mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    asked_by: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    ask_date_time: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  },
  { collection: "Question" }
);
