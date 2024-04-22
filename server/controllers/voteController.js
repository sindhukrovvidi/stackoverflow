const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/questions");
const UserProfile = require("../models/userProfile");

const router = express.Router();

const updateVotes = async (req, res) => {
  const { qid, userId, voteValue } = req.body;

  try {

    const questionId = new mongoose.Types.ObjectId(qid);
    const userProfileId = new mongoose.Types.ObjectId(userId);

    const question = await Question.findById(questionId);
    const userProfile = await UserProfile.findById(userId);

    if (!question || !userProfile) {
      return res.status(404).json({ error: "Question or user not found" });
    }

    const userVote = question.votes.find(
      (vote) => {
         return vote.userId.toString() == userProfileId.toString()
        }
    );

    if (userVote) {
      if (userVote.value === voteValue) {
        return res
          .json({ status: 400, message: "User has already voted in the same way" });
      }

      await Question.findOneAndUpdate(
        { _id: questionId, "votes.userId": userProfileId },
        { $set: { "votes.$.value": voteValue } },
        { new: true }
      );
    } else {
      await Question.findOneAndUpdate(
        { _id: questionId },
        { $push: { votes: { userId: userProfileId, value: voteValue } } },
        { new: true }
      );
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId },
      { $inc: { voteCount: voteValue } },
      { new: true }
    );

    res.json({ votes: updatedQuestion.votes, status: 200 });
  } catch (error) {
    console.error("Error voting for question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.post("/updateVotes", updateVotes);
module.exports = router;
