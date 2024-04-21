import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
  const data = { qid: qid, ans: ans };
  const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);

  return res.data;
};

const updateAnswer = async (aid, q) => {
  const res = await api.post(`${ANSWER_API_URL}/updateAnswer/${aid}`, q);

  return res.data;
};

const deleteAnswerById = async (aid) => {
  const res = await api.delete(`${ANSWER_API_URL}/deleteAnswerById/${aid}`);

  return res;
};

export { addAnswer, updateAnswer, deleteAnswerById };
