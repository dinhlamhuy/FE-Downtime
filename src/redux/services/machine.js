import axios from "axios";
import { BASE_URL } from "../../utils/env";
import authHeader from "./auth_header";

const get_info_machine = (factory, id_machine) => {
    return axios.post(BASE_URL + "/damage_report/getMachine", {
        factory, id_machine
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

const MachineService = {
    get_info_machine
}

export default MachineService;