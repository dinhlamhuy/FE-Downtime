import axios from "axios";
import { BASE_URL } from "../../utils/env";

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

const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
};

const AuthService = {
    login,
    logout,
};

export default AuthService;