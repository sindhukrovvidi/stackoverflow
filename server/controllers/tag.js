const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    try {
      const tags = await Tag.find();
      const questions = await Question.find().populate({ path: 'tags' });
  
      const tagsWithQuestionNumber = tags.map(async (tag) => {
        const questionCount = questions.filter(
          question => question.tags?.some(ele => ele.name === (tag.name))
        ).length; // Single filter with some() for checking tag existence
  
        return { name: tag.name, qcnt: questionCount };
      });
  
      const finalTagsWithCount = await Promise.all(tagsWithQuestionNumber);
      res.status(200).json(finalTagsWithCount);
    } catch (error) {
      console.error("Error while fetching tags with question numbers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber)
// add appropriate HTTP verbs and their endpoints to the router.

module.exports = router;
