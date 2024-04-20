import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/users`;

const loginUser = async (email, password) => {
    const data = { email, password };
    const res = await api.post(`${USER_API_URL}/login`, data);
    return res.data.user;
};

const registerUser = async (email, username, password, contact_no) => {
    const data = {email, username, password, contact_no};
    const res = await api.post(`${USER_API_URL}/register`, data);

    return res.data;
};

const logoutUser = async (email, password) => {
    const data = {email, password};
    const res = await api.post(`${USER_API_URL}/logout`, data);

    return res.data;
};

const getCurrentUser = async () => {
    const res = await api.post(`${USER_API_URL}/getCurrentUser`);
    return res.data;
}

const getCurrentUserDetails = async () => {
    const res = await api.get(`${USER_API_URL}/getCurrentUserDetails`);
    return res.data;
}

export { loginUser, registerUser, logoutUser, getCurrentUser, getCurrentUserDetails };
