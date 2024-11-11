import axios from "axios";
import { BASE_URL } from "../../utils/env";
import authHeader from "./auth_header";

const login = (username, password, factory, token, language) => {
    return axios
        .post(BASE_URL + "/auth/login", {
            username,
            password,
            factory,
            token,
            language
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            const res = response.data;
            if (res.data.accessToken) {
                localStorage.setItem("access_token", JSON.stringify(res.data.accessToken));
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }
            return res;
        }).catch((error) => {
            return error.response.data;
        });
};
const updateInfo = (username,  factory) => {
   
    return axios
        .post(BASE_URL + "/user/updateUser", {
            username:username,
            factory:factory
        }, {
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            }
        })
        .then((response) => {
            const res = response.data;
            // console.log(res.data)
            if (res && res.data && res.data.user_name) {
                // console.log(res.data)
                localStorage.setItem("user", JSON.stringify(res.data));
            }
            return res;
        }).catch((error) => {
            return error.response.data;
        });
};

const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
};

const AuthService = {
    login,
    logout,updateInfo
};

export default AuthService;