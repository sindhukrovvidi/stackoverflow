const Tag = require("../models/tags");
const Question = require("../models/questions");
const Answer = require("../models/answers");

const addTag = async (tname) => {
  try {
    const tag = await Tag.findOne({ name: tname });

    if (tag) {
      return tag._id;
    }

    const newTag = new Tag({ name: tname });
    const savedTag = await newTag.save();
    return savedTag._id;
  } catch (err) {
    console.error("Error adding tag:", err);
    throw err;
  }
};

const getQuestionsByOrder = async (order) => {
  const questions = await Question.find()
    .populate({ path: "tags" })
    .populate({ path: "answers" });
  let result = [];
  switch (order) {
    case "active": {
      result = questions.sort((q1, q2) => {
        const findLatestAnswerDate = (question) => {
          return question.answers.reduce((latestDate, answer) => {
            return answer.ans_date_time > latestDate
              ? answer.ans_date_time
              : latestDate;
          }, new Date(0));
        };

        const q1LatestAnswer = findLatestAnswerDate(q1);
        const q2LatestAnswer = findLatestAnswerDate(q2);

        if (q1LatestAnswer.getTime() !== q2LatestAnswer.getTime()) {
          return q2LatestAnswer - q1LatestAnswer;
        }

        return new Date(q2.ask_date_time) - new Date(q1.ask_date_time);
      });
      break;
    }
    case "unanswered": {
      result = questions.filter((question) => question.answers.length === 0);
      result.sort(
        (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
      );
      break;
    }
    case "newest": {
      result = questions.sort(
        (a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)
      );
      break;
    }

    default:
      result = [];
      break;
  }
  return result;
};

const filterQuestionsBySearch = (qlist, search) => {
  const searchKeywords = search.toLowerCase().match(/\[.+?\]|[\w']+/g) || [];

  const tagKeyWords = searchKeywords
    .filter((ele) => ele.startsWith("[") && ele.endsWith("]"))
    .map((ele) => ele.slice(1, -1).toLowerCase());

  const textKeyWords = searchKeywords
    .filter((ele) => !ele.startsWith("[") && !ele.endsWith("]"))
    .map((ele) => ele.toLowerCase());

  let searchResults = qlist.filter((question) => {
    const questionText = question.text.toLowerCase();
    const questionTitle = question.title.toLowerCase();
    const questionTags = question.tags.map((tag) => {
      return tag ? tag.name.toLowerCase() : "";
    });
    const tagResults = tagKeyWords.some((tagTerm) =>
      questionTags.some((questionTag) => questionTag.includes(tagTerm))
    );
    const textResults = textKeyWords.some(
      (ele) => questionText.includes(ele) || questionTitle.includes(ele)
    );
    return tagResults || textResults;
  });

  return search === "" ? qlist : searchResults;
};

module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };
