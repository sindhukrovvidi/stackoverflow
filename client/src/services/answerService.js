import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans, csrfToken) => {
    const data = { qid: qid, ans: ans };
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data,  {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });

    return res.data;
};

const updateAnswer = async (aid, q, csrfToken) => {
    const res = await api.post(`${ANSWER_API_URL}/updateAnswer/${aid}`, q, {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });

    return res.data;
};


export { addAnswer, updateAnswer };
