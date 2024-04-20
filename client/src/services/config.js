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

const getCsrfToken = async () => {
  try {
    const csrfTokenResponse = await api.get("/csrf-token");
    const csrfToken = csrfTokenResponse.data.csrfToken;
    console.log("The token from frontend is ", csrfToken);
    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
};



getCsrfToken()
  .then((csrfToken) => {
    // Add a request interceptor
    api.interceptors.request.use(function (config) {
      console.log("Setting the csrf token in the frontened header")
      // Add the X-CSRF-Token header to the request
      config.headers["X-CSRF-Token"] = csrfToken;

      return config;
    });

    console.log("The token from frontend is ", csrfToken);
  })
  .catch((error) => {
    console.error('Error initializing CSRF token:', error);
  });


api.interceptors.response.use(handleRes, handleErr);

export { REACT_APP_API_URL, api };
