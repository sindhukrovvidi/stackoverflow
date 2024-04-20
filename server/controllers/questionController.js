const express = require("express");
const Question = require("../models/questions");
const mongoose = require('mongoose');

const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");
const router = express.Router();

const getQuestionsByFilter = async (req, res) => {
  try {
    const order = req.query.order || "newest";
    const search = req.query.search || "";

    let questions = await getQuestionsByOrder(order);
    if (search) {
      questions = filterQuestionsBySearch(questions, search);
    }
    res.send(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { title, text, tags, ask_date_time, answers } = req.body;

    const addTagPromises = tags.map(async (tag) => {
      return await addTag(tag);
    });

    let addedTags = await Promise.all(addTagPromises);

    const newQuestion = await Question.create({
      title: title,
      text: text,
      asked_by: req.session.user ? req.session.user._id : 'unknownUser',
      tags: addedTags,
      ask_date_time: ask_date_time,
      answers: answers || [],
    });

    res.status(200).send(newQuestion);
  } catch (err) {
    console.error("Error while adding a question: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const questionId = new mongoose.Types.ObjectId(req.params.qid); 

    const { title, text, tags, modifiedOn } = req.body;

    const addTagPromises = tags.map(async (tag) => {
      return await addTag(tag);
    });

    let addedTags = await Promise.all(addTagPromises);

    const updateObject = {};
    if (title) updateObject.title = title;
    if (modifiedOn) updateObject.modifiedOn = modifiedOn;
    if (text) updateObject.text = text;
    if (tags) updateObject.tags = addedTags;

    if (Object.keys(updateObject).length > 0) {
      const updatedQuestion = await Question.findOneAndUpdate(
        { _id: questionId },
        updateObject,
        { new: true }
      );

      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.status(200).send(updatedQuestion);
    } else {
      res.status(200).json({ message: "No changes detected in request body" });
    }
  } catch (err) {
    console.error("Error while updating question: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.qid;
    let updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId },
      { $inc: { views: 1 } },
      { new: true }
    ).populate({
      path: "answers",
      populate: { path: "ans_by", select: "username" }
    })
    .populate({ path: "asked_by", select: "username" }).lean();

    if (updatedQuestion.asked_by) {
      const username = updatedQuestion.asked_by.username;
      updatedQuestion.asked_by = username;
    }

    updatedQuestion.answers.forEach((answer) => {
      if (answer.ans_by) {
        const answerBy = answer?.ans_by?.username;
        answer.ans_by = answerBy;
      }
    });

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).send(updatedQuestion);
  } catch (err) {
    console.log("Error while fetching a question", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.get("/getQuestion", getQuestionsByFilter);
router.post("/addQuestion", addQuestion);
router.get("/getQuestionById/:qid", getQuestionById);
router.post("/updateQuestion/:qid", updateQuestion);
module.exports = router;
