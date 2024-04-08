import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/users`;

const loginUser = async (email, password) => {
    const data = {email, password};
    const res = await api.post(`${USER_API_URL}/login`, data);

    return res.data;
};

const registerUser = async (email, username, password, contact_no) => {
    const data = {email, username, password, contact_no};
    const res = await api.post(`${USER_API_URL}/register`, data);

    return res.data;
};

export { loginUser, registerUser };
