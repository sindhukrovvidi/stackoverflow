const express = require("express");
const Question = require("../models/questions");

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
    const { title, text, tags, ask_date_time, asked_by, answers } = req.body;

    const addTagPromises = tags.map(async (tag) => {
      return await addTag(tag);
    });

    let addedTags = await Promise.all(addTagPromises);

    const newQuestion = await Question.create({
      title: title,
      text: text,
      asked_by: asked_by,
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

const getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.qid;
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("answers");

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
module.exports = router;
