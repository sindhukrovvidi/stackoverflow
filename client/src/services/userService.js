import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/users`;

const getCsrfToken = async () => {
    const csrfTokenResponse = await api.get('/csrf-token', { withCredentials: true });
    const csrfToken = csrfTokenResponse;
    return csrfToken;
}

const checkLoginStatus = async () => {
    const csrfTokenResponse = await api.get('/check-login', { withCredentials: true });
    const csrfToken = csrfTokenResponse;
    return csrfToken;
}

const loginUser = async (email, password, csrfToken) => {
    const data = { email, password };
    const res = await api.post(`${USER_API_URL}/login`, data, {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });
    return res;
};

const registerUser = async (email, username, password, contact_no, csrfToken) => {
    const data = {email, username, password, contact_no};
    const res = await api.post(`${USER_API_URL}/register`, data, {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });

    return res.data;
};

const logoutUser = async (csrfToken) => {
    console.log("In logout ", csrfToken)
    const res = await api.post(`${USER_API_URL}/logout`, null, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
    
    return res.data;
};

const getCurrentUser = async (csrfToken) => {
    const res = await api.get(`${USER_API_URL}/getCurrentUser`, {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });
    return res.data;
}

const getCurrentUserDetails = async (csrfToken) => {
    const res = await api.get(`${USER_API_URL}/getCurrentUserDetails`, {   headers: {
        'x-csrf-token': csrfToken,
      },
      withCredentials: true, });
    return res.data;
}

export { loginUser, registerUser, logoutUser, getCurrentUser, getCurrentUserDetails, getCsrfToken, checkLoginStatus };
