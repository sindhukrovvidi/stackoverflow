const express = require("express");
const mongoose = require('mongoose');
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
  try {
    const tags = await Tag.find();
    const questions = await Question.find().populate({ path: "tags" });

    const tagsWithQuestionNumber = tags.map(async (tag) => {
      const questionCount = questions.filter((question) =>
        question.tags?.some((ele) => ele.name === tag.name)
      ).length;

      return { name: tag.name, qcnt: questionCount };
    });

    const finalTagsWithCount = await Promise.all(tagsWithQuestionNumber);
    res.status(200).json(finalTagsWithCount);
  } catch (error) {
    console.error("Error while fetching tags with question numbers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTagsWithIds = async (req, res) => {
  try {
    let tagIds = req.body.tagIds || [];
    tagIds = tagIds.map((tag) => {
      return new mongoose.Types.ObjectId(tag);
    })
    const tags = await Tag.find({
      _id: { $in: tagIds },
    }, { name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error while fetching tags with ids ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);
router.post("/getTagsWithIds", getTagsWithIds);

module.exports = router;
