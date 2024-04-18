import _axios from "axios";

const REACT_APP_API_URL = "http://localhost:8000";

const token = localStorage.getItem("stackOverflowJwtToken");

const handleRes = (res) => {
  return res;
};

const handleErr = (err) => {
  console.log(err);
  return err;
};

const api = _axios.create({
  withCredentials: true,
  baseURL: "YOUR_BASE_API_URL",
  headers: {
    Authorization: `${token}`, 
  },
});
api.interceptors.request.use(handleRes, handleErr);
api.interceptors.response.use(handleRes, handleErr);

export { REACT_APP_API_URL, api };
