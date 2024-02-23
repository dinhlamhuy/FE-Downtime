import axios from "axios";
import { BASE_URL } from "../../utils/env";
import authHeader from "./auth_header";

const get_report_damage = (id_user_request, factory) => {
    return axios.post(BASE_URL + "/damage_report/getTaskInfo", {
        id_user_request, factory
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    });
}

const report_damage = (id_machine, id_user_request, remark, factory, fixer, language) => {
    return axios.post(BASE_URL + "/damage_report/callMechanic", {
        id_machine,
        id_user_request,
        remark,
        factory,
        fixer,
        language
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    });
};

const get_history_product = (id_user_request, factory) => {
    return axios.post(BASE_URL + "/damage_report/getHistoryTaskProduct", {
        id_user_request, factory
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    });
}

const cancel_report_damage = (user_name, id_machine, factory, language) => {
    return axios.post(BASE_URL + "/damage_report/deleteTask", {
        user_name, id_machine, factory, language
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    });
}


const ProductServices = {
    get_report_damage,
    report_damage,
    get_history_product,
    cancel_report_damage
};

export default ProductServices;
