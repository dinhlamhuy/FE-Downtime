import axios from "axios";
import { BASE_URL } from "../../utils/env";
import authHeader from "./auth_header";

const get_report_damage = (id_user_request, factory) => {
  return axios
    .post(
      BASE_URL + "/damage_report/getTaskInfo",
      {
        id_user_request,
        factory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
const getTaskRelocateMachine = (id_user_request, factory) => {
  return axios
    .post(
      BASE_URL + "/damage_report/getTaskRelocateMachine",
      {
        id_user_request,
        factory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const report_damage = (
  id_machine,
  id_user_request,
  remark,
  factory,
  fixer,
  language,
  otherIssue
) => {
  return axios
    .post(
      BASE_URL + "/damage_report/callMechanic",
      {
        id_machine,
        id_user_request,
        remark,
        factory,
        fixer,
        language,
        otherIssue,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
const relocation_report = (
  ID_lean,
  ID_Floor,
  id_user_request,
  req_floor,
  remark,
  factory,
  languages
) => {
  return axios
    .post(
      BASE_URL + "/damage_report/callRelocateMachine",
      {
        ID_lean,
        ID_Floor,
        id_user_request,
        req_floor,
        remark,
        factory,
        languages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const get_history_product = (id_user_request, factory) => {
  return axios
    .post(
      BASE_URL + "/damage_report/getHistoryTaskProduct",
      {
        id_user_request,
        factory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
const get_info_reason = (dept) => {
  return axios
    .post(
      BASE_URL + "/damage_report/getInforReason",
      { dept: dept },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
const get_task_receiving_process = ({ id_task }) => {
  return axios
    .post(
      BASE_URL + "/task/getTaskRecordHistory",
      { id_task },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
const cancel_report_damage = (user_name, id_machine, factory, language) => {
  return axios
    .post(
      BASE_URL + "/damage_report/deleteTask",
      {
        user_name,
        id_machine,
        factory,
        language,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
const delete_Task_RelocateMachine = (
  user_name,
  floor,
  ID_Floor,
  ID_Lean,
  factory,
  language
) => {
  return axios
    .post(
      BASE_URL + "/damage_report/deleteTaskRelocateMachine",
      {
        user_name,
        floor,
        ID_Floor,
        ID_Lean,
        factory,
        language,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
const finishRelocateMachine = (
  user_name,
  floor,
  id_task,
  ID_Floor,
  ID_Lean,
  factory,
  language
) => {
  return axios
    .post(
      BASE_URL + "/damage_report/finishRelocateMachine",
      {
        user_name,
        floor,
        id_task,
        ID_Floor,
        ID_Lean,
        factory,
        language,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

const ProductServices = {
  get_report_damage,
  report_damage,
  get_history_product,
  cancel_report_damage,
  get_info_reason,
  get_task_receiving_process,
  relocation_report,
  getTaskRelocateMachine,
  delete_Task_RelocateMachine,finishRelocateMachine
};

export default ProductServices;
