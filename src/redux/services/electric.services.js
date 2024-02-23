import axios from "axios";
import { BASE_URL } from "../../utils/env";
import authHeader from "./auth_header";


//List Task => Manager
const get_task_damage = (factory, floor, user_name, lean) => {
    return axios.post(BASE_URL + "/task/getMechalist", {
        factory, floor, user_name, lean
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

const get_list_status_mechanic = (position, factory, floor, lean) => {
    return axios.post(BASE_URL + "/task/getListStatusMechanic", {
        position, factory, floor, lean
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

const get_list_asign_mechanic = (id_machine, floor, factory, position, lean) => {
    return axios.post(BASE_URL + "/task/getListAsignMechanic", {
        id_machine, floor, factory, position, lean
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    })
}

const owner_asign_task = (user_name, id_machine, id_owner_mechanic, factory, lean, language) => {
    return axios.post(BASE_URL + "/task/ownerAsignTask", {
        user_name, id_machine, id_owner_mechanic, factory, lean, language
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    })
}

//Get Status => Employee
const get_work_list_report_employee = (id_user_mechanic, factory) => {
    return axios.post(BASE_URL + "/task/getTaskmechaInfo", {
        id_user_mechanic, factory
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

const scanner_fix_mechanic = (id_user_mechanic, id_machine, factory, lean, status, language) => {
    return axios.post(BASE_URL + "/task/mechanicAccept", {
        id_user_mechanic, id_machine, factory, lean, status, language
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


const finish_mechanic = (id_user_mechanic, skill, id_machine, remark_mechanic, lean, factory, language) => {
    return axios.post(BASE_URL + "/task/machineCfmfinish", {
        id_user_mechanic, skill, id_machine, remark_mechanic, lean, factory, language
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    })
}

const get_history_mechanic = (id_user_mechanic, factory) => {
    return axios.post(BASE_URL + "/task/getHistoryMechanic", {
        id_user_mechanic, factory
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    })
}

const get_info_calculate = (date_from, date_to, user_name, factory) => {
    return axios.post(BASE_URL + "/task/getInfoCalculate", {
        date_from, date_to, user_name, factory
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    })
}

const get_info_task = (date_from, date_to, user_name, factory) => {
    return axios.post(BASE_URL + "/task/getInfoTask", {
        date_from, date_to, user_name, factory
    }, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    })
}
const get_info_skill = () => {
    return axios.post(BASE_URL + "/task/getInforSkill", {}, {
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response.data;
    })
}



const ElectricServices = {
    get_work_list_report_employee,
    get_task_damage,
    scanner_fix_mechanic,
    finish_mechanic,
    get_history_mechanic,
    get_info_calculate,
    get_info_skill,
    get_list_status_mechanic,
    get_list_asign_mechanic,
    owner_asign_task,
    get_info_task
}

export default ElectricServices;