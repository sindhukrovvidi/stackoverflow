// Answer Document Schema
const mongoose = require("mongoose");

const Answer = require("./schema/answer");

const AnswerSchema = mongoose.model('Answer', Answer);

module.exports = AnswerSchema;