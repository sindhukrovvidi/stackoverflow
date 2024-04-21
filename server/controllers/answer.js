const express = require("express");
const mongoose = require("mongoose");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
  try {
    const { qid, ans } = req.body;

    const newAnswer = await Answer.create({
      text: ans.text,
      ans_by: req.session.user ? req.session.user._id : "unknownUser",
      ans_date_time: ans.ans_date_time,
    });

    await Question.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [newAnswer._id], $position: 0 } } },
      { new: true }
    );

    res.status(200).json(newAnswer);
  } catch (error) {
    console.error("Error while adding an answer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const answerId = new mongoose.Types.ObjectId(req.params.aid);
    const { text, modifiedOn } = req.body;

    const updateObject = {};
    if (modifiedOn) updateObject.modifiedOn = new Date(modifiedOn);
    if (text) updateObject.text = text;

    if (Object.keys(updateObject).length > 0) {
      const updatedAnswer = await Answer.findOneAndUpdate(
        { _id: answerId },
        updateObject,
        { new: true }
      );

      if (!updatedAnswer) {
        return res.status(404).json({ error: "Answer not found" });
      }

      res.status(200).send(updatedAnswer);
    } else {
      res.status(200).json({ message: "No changes detected in request body" });
    }
  } catch (err) {
    console.error("Error while updating answer: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAnswerById = async (req, res) => {
  try {
    const answerId = new mongoose.Types.ObjectId(req.params.aid);

    const question = await Answer.findById(answerId);
    if (!question) {
      return res.status(404).json({ status: 404, message: "Answer not found" });
    }

    await Answer.findByIdAndDelete(answerId);
    res
      .status(200)
      .json({ status: 200, message: "Answer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

router.post("/addAnswer", addAnswer);
router.post("/updateAnswer/:aid", updateAnswer);
router.delete("/deleteAnswerById/:aid", deleteAnswerById);
module.exports = router;
