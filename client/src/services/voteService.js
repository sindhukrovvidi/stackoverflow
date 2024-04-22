import { REACT_APP_API_URL, api } from "./config";

const VOTE_API_URL = `${REACT_APP_API_URL}/vote`;


const updateVote = async (qid, voteValue, userId) => {
  const data = { qid: qid, voteValue: voteValue, userId: userId };
  const res = await api.post(`${VOTE_API_URL}/updateVotes`, data);

  return res.data;
};

export { updateVote };
