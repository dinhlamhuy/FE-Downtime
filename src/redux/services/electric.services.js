import axios from "axios";
import { BASE_URL } from "../../utils/env";
import authHeader from "./auth_header";
const calculateTimeDifference = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffInMs = endDate - startDate;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = (diffInSeconds % 3600) % 60;
  const formatTwoDigits = (num) => String(num || 0).padStart(2, '0');
  // return { hours, minutes, seconds };
  return `${hours ? formatTwoDigits(hours)+':' : ''}${minutes ?  formatTwoDigits(minutes)+':' : ''}${formatTwoDigits(seconds)}s`;
};
//List Task => Manager
const get_task_damage = (factory, floor, user_name, lean, fromdate, todate) => {
  return axios
    .post(
      BASE_URL + "/task/getMechalist",
      {
        factory,
        floor,
        user_name,
        lean,
        fromdate,
        todate,
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

const get_owner_task_damage = (
  factory,
  floor,
  user_name,
  lean,
  fromdate,
  todate
) => {
  return axios
    .post(
      BASE_URL + "/task/getOwnerMechalist",
      {
        factory,
        floor,
        user_name,
        lean,
        fromdate,
        todate,
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
const get_list_status_mechanic = (
  user_name,
  position,
  factory,
  floor,
  lean,
  permission
) => {
  return axios
    .post(
      BASE_URL + "/task/getListStatusMechanic",
      {
        user_name,
        position,
        factory,
        floor,
        lean,
        permission,
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
const get_List_Status_Change_Over_Mechanic = (
  user_name,
  position,
  factory,
  floor,
  lean,
  permission, id_task
) => {
  return axios
    .post(
      BASE_URL + "/task/getListStatusChangeOverMechanic",
      {
        user_name,
        position,
        factory,
        floor,
        lean,
        permission,id_task
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

const get_list_status_task_detail = (
  fromdate,
  todate,
  factory,
  floor,
  lean
) => {
  return axios
    .post(
      BASE_URL + "/task/getListStatusTaskDetail",
      {
        fromdate,
        todate,
        factory,
        floor,
        lean,
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

const get_count_status_task = (fromdate, todate, factory, floor, lean) => {
  return axios
    .post(
      BASE_URL + "/task/getCountStatusTask",
      {
        fromdate,
        todate,
        factory,
        floor,
        lean,
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
const get_list_asign_mechanic = (
  id_machine,
  floor,
  factory,
  position,
  lean
) => {
  return axios
    .post(
      BASE_URL + "/task/getListAsignMechanic",
      {
        id_machine,
        floor,
        factory,
        position,
        lean,
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

const get_list_repair_mechanic = (factory, floor, lean, time) => {
  return axios
    .post(
      BASE_URL + "/task/getListRepairedMechanic",
      {
        factory,
        floor,
        lean,
        time,
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
const get_top_longest_repair_time = (factory, floor, lean, time) => {
  return axios
    .post(
      BASE_URL + "/task/getTop5LongestRepairTime",
      {
        factory,
        floor,
        lean,
        time,
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

const get_top3_broken_machines = (factory, floor, lean, time) => {
  return axios
    .post(
      BASE_URL + "/task/getTop3BrokenMachines",
      {
        factory,
        floor,
        lean,
        time,
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

const owner_asign_task = (
  user_name,
  id_machine,
  id_owner_mechanic,
  factory,
  lean,
  language
) => {
  return axios
    .post(
      BASE_URL + "/task/ownerAsignTask",
      {
        user_name,
        id_machine,
        id_owner_mechanic,
        factory,
        lean,
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

//Get Status => Employee
const get_work_list_report_employee = (id_user_mechanic, factory, lean) => {
  return axios
    .post(
      BASE_URL + "/task/getTaskmechaInfo",
      {
        id_user_mechanic,
        factory,
        lean,
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
const get_work_list_change_over = (id_user_mechanic, factory, lean) => {
  return axios
    .post(
      BASE_URL + "/task/getTaskChangeOver",
      {
        id_user_mechanic,
        factory,
        lean,
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

const scanner_fix_mechanic = (
  id_user_mechanic,
  id_machine,
  factory,
  lean,
  status,
  language
) => {
  return axios
    .post(
      BASE_URL + "/task/mechanicAccept",
      {
        id_user_mechanic,
        id_machine,
        factory,
        lean,
        status,
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

const finish_mechanic = (
  id_user_mechanic,
  skill,
  id_machine,
  remark_mechanic,
  lean,
  factory,
  statusRadio,
  language,
  new_mechanic,
  otherIssue,new_id_user_mechanic,reason, otherMethod
) => {
  return axios
    .post(
      BASE_URL + "/task/machineCfmfinish",
      {
        id_user_mechanic,
        skill,
        id_machine,
        remark_mechanic,
        lean,
        factory,
        statusRadio,
        language,
        new_mechanic,
        otherIssue,new_id_user_mechanic, reason, otherMethod
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

const get_history_mechanic = (id_user_mechanic, factory) => {
  return axios
    .post(
      BASE_URL + "/task/getHistoryMechanic",
      {
        id_user_mechanic,
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

const get_info_calculate = (date_from, date_to, user_name, factory) => {
  return axios
    .post(
      BASE_URL + "/task/getInfoCalculate",
      {
        date_from,
        date_to,
        user_name,
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

const get_info_task = (date_from, date_to, user_name, factory) => {
  return axios
    .post(
      BASE_URL + "/task/getInfoTask",
      {
        date_from,
        date_to,
        user_name,
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

const get_info_skill = ({ userRequest }) => {
  return axios
    .post(
      BASE_URL + "/task/getInforSkill",
      { userRequest: userRequest },
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

const get_all_lean = (factory, floor) => {
  return axios
    .post(
      BASE_URL + "/user/getAllLean",
      { factory, floor },
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

const call_support = (
  floor,
  factory,
  line,
  status,
  user_machine,
  user_owner,
  remark,
  support_detail,
  name_machine,
  id_task,
  lang
) => {
  return axios
    .post(
      BASE_URL + "/task/callSupport",
      {
        floor,
        factory,
        line,
        status,
        user_machine,
        user_owner,
        remark,
        support_detail,
        name_machine,
        id_task,
        lang,
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

const get_task_support = (user_machine, factory) => {
  return axios
    .post(
      BASE_URL + "/task/getTaskSupport",
      { user_machine, factory },
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
const get_history_task_support = (user_machine, factory) => {
  return axios
    .post(
      BASE_URL + "/task/getHistoryTaskSupport",
      { user_machine, factory },
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
const accept_support = (
  id,
  factory,
  line,
  status,
  user_machine,
  support_detail,
  lang
) => {
  return axios
    .post(
      BASE_URL + "/task/acceptSupport",
      { id, factory, line, status, user_machine, support_detail, lang },
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

const get_all_floor = (factory) => {
  return axios
    .post(
      BASE_URL + "/user/getAllFloor",
      { factory },
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
const getMachineUnderRepair = (line, factory) => {
  return axios
    .post(
      BASE_URL + "/task/getMachineRepairLine",
      { line, factory },
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

const change_floor = (floor, factory, user_name, lang) => {
  return axios
    .post(
      BASE_URL + "/task/changeFloor",
      { floor, factory, user_name, lang },
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
const get_All_task = (factory, fromDate, toDate, floor, fixer) => {
  const date = new Date();
  return axios
    .get(
      BASE_URL + "/task/getAllTask",
      {
        params: { factory, fromDate, toDate, floor, fixer },
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
    .then((response) => {
      const dataWithMinute = response?.data?.data.map((item) => {
        const requestTime = item.date_user_request ? new Date(item.date_user_request) : null;

        const acceptTime = item.accept
        ? new Date(item.accept)
        : new Date(date.getTime() + 7 * 60 * 60 * 1000- (factory === 'LYM' ? 30 * 60 * 1000 : 0)); 

        const fixingTime = item.fixing && new Date(item.fixing);
        const finishTime = item.finish ? new Date(item.finish): new Date(date.getTime() + 7 * 60 * 60 * 1000- (factory === 'LYM' ? 30 * 60 * 1000 : 0)); 
        const minute_request =
          Math.max(((acceptTime - requestTime) / (1000 * 60)).toFixed(2), 0) ||
          0;
        const minute_accept =
          Math.max(((fixingTime - acceptTime) / (1000 * 60)).toFixed(2), 0) ||
          0;
        const minute_finish =
          Math.max(((finishTime - fixingTime) / (1000 * 60)).toFixed(2), 0) ||
          0;
        const total_downtime =
          Math.max(((finishTime - requestTime) / (1000 * 60)).toFixed(2), 0) ||
          0;
        return {
          ...item,
          minute_request,
          minute_request_detail: calculateTimeDifference(
            requestTime,
            acceptTime
          ),
          minute_accept,
          minute_accept_detail: calculateTimeDifference(acceptTime, fixingTime),
          minute_finish,
          minute_finish_detail: calculateTimeDifference(fixingTime, finishTime),
          total_downtime,
          total_downtime_detail: calculateTimeDifference(
            requestTime,
            finishTime
          ),
        };
      });
      const datas= { data:dataWithMinute || [] };
      return datas || [];
    })
    .catch((error) => {
      return error.response.data;
    });
};
const get_task_relocate_machine = (fixer, id_owner, factory) => {
  return axios
    .post(
      BASE_URL + "/task/getTaskOnwerRelocateMachine",
      { fixer, id_owner, factory },
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
const asignTaskRelocateMachine = (
  fixer,
  id_owner,
  factory,
  repairman,
  arrRepairman,
  id_task,
  req_floor
) => {
  return axios
    .post(
      BASE_URL + "/task/asignTaskRelocateMachine",
      { fixer, id_owner, factory, repairman, arrRepairman, id_task, req_floor },
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
  get_info_task,
  get_list_status_task_detail,
  get_count_status_task,
  get_list_repair_mechanic,
  get_owner_task_damage,
  get_top_longest_repair_time,
  get_top3_broken_machines,
  get_all_lean,
  call_support,
  get_task_support,
  get_history_task_support,
  accept_support,
  get_all_floor,
  change_floor,
  getMachineUnderRepair,
  get_All_task,
  get_task_relocate_machine,
  asignTaskRelocateMachine,
  get_work_list_change_over,
  get_List_Status_Change_Over_Mechanic
};

export default ElectricServices;
