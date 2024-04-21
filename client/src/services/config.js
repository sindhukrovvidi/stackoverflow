import _axios from "axios";

const REACT_APP_API_URL = "http://localhost:8000";
const handleRes = (res) => {
  return res;
};
const handleErr = (err) => {
  console.log(err);
  return err;
};

const api = _axios.create({
  withCredentials: true,
  baseURL: REACT_APP_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getCsrfToken = async () => {
  try {
    const response = await _axios.get("http://localhost:8000/csrf-token", {
      withCredentials: true,
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error("error while fetching the csrf token ", error);
  }
};

api.interceptors.response.use(handleRes, handleErr);

export { REACT_APP_API_URL, api, getCsrfToken };
