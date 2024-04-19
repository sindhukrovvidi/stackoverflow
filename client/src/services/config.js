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
  (config) => {
    const token = localStorage.getItem("stackOverflowJwtToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  handleErr
);

api.interceptors.response.use(handleRes, handleErr);

export { REACT_APP_API_URL, api };
