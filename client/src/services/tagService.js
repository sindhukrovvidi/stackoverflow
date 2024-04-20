import { REACT_APP_API_URL, api } from "./config";

const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

const getTagsWithQuestionNumber = async (csrfToken) => {
    const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`, {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });

    return res.data;
};
export { getTagsWithQuestionNumber };
