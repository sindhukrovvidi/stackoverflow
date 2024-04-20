const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
    try {
        const { qid, ans } = req.body;

        const newAnswer = await Answer.create({
            text: ans.text,
            ans_by: ans.ans_by,
            ans_date_time: ans.ans_date_time
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

router.post("/addAnswer", addAnswer);
module.exports = router;
