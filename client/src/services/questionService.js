import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "",csrfToken) => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`, {  headers: {
            'x-csrf-token': csrfToken
          },
          withCredentials: true,}
    );

    return res.data;
};

// To get Questions by id
const getQuestionById = async (qid, csrfToken) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`,  {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });

    return res.data;
};

// To add Questions
const addQuestion = async (q, csrfToken) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q,  {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });

    return res.data;
};

const updateQuestion = async (qid, q, csrfToken) => {
    const res = await api.post(`${QUESTION_API_URL}/updateQuestion/${qid}`, q, {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });

    return res.data;
};

export { getQuestionsByFilter, getQuestionById, addQuestion, updateQuestion };
