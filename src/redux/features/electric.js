import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ElectricServices from "../services/electric.services";

//common
export const setErrorCode = (errorCode, errorMessage) => {
  return {
    type: "electric/setErrorCode",
    payload: {
      errorCode,
      errorMessage,
    },
  };
};

//Get Task => Manager
export const get_task_damage = createAsyncThunk(
  "/task/getMechalist",
  async ({ factory, floor, user_name, lean, fromdate, todate }) => {
    try {
      const data = await ElectricServices.get_task_damage(
        factory,
        floor,
        user_name,
        lean,
        fromdate,
        todate
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_owner_task_damage = createAsyncThunk(
  "/task/getOwnerMechalist",
  async ({ factory, floor, user_name, lean, fromdate, todate }) => {
    try {
      const data = await ElectricServices.get_owner_task_damage(
        factory,
        floor,
        user_name,
        lean,
        fromdate,
        todate
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_list_status_mechanic = createAsyncThunk(
  "/task/getListStatusMechanic",
  async ({ user_name, position, factory, floor, lean, permission }) => {
    try {
      const data = await ElectricServices.get_list_status_mechanic(
        user_name,
        position,
        factory,
        floor,
        lean,
        permission
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_list_repair_mechanic = createAsyncThunk(
  "/task/getListRepairedMechanic",
  async ({ factory, floor, lean, time }) => {
    try {
      const data = await ElectricServices.get_list_repair_mechanic(
        factory,
        floor,
        lean,
        time
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_top_longest_repair_time = createAsyncThunk(
  "/task/getTop5LongestRepairTime",
  async ({ factory, floor, lean, time }) => {
    try {
      const data = await ElectricServices.get_top_longest_repair_time(
        factory,
        floor,
        lean,
        time
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_top3_broken_machines = createAsyncThunk(
  "/task/getTop3BrokenMachines",
  async ({ factory, floor, lean, time }) => {
    try {
      const data = await ElectricServices.get_top3_broken_machines(
        factory,
        floor,
        lean,
        time
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_list_asign_mechanic = createAsyncThunk(
  "/task/getListAsignMechanic",
  async ({ id_machine, floor, factory, position, lean }) => {
    try {
      const data = await ElectricServices.get_list_asign_mechanic(
        id_machine,
        floor,
        factory,
        position,
        lean
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const owner_asign_task = createAsyncThunk(
  "/task/ownerAsignTask",
  async ({
    user_name,
    id_machine,
    id_owner_mechanic,
    factory,
    lean,
    language,
  }) => {
    try {
      const data = await ElectricServices.owner_asign_task(
        user_name,
        id_machine,
        id_owner_mechanic,
        factory,
        lean,
        language
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

//List Status => Employee
export const get_work_list_report_employee = createAsyncThunk(
  "/task/getTaskmechaInfo",
  async ({ id_user_mechanic, factory, lean }) => {
    try {
      const data = await ElectricServices.get_work_list_report_employee(
        id_user_mechanic,
        factory,
        lean
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

// Confirm and Scanner
export const scanner_fix_mechanic = createAsyncThunk(
  "/task/mechanicAccept",
  async ({ id_user_mechanic, id_machine, factory, lean, status, language }) => {
    try {
      const data = await ElectricServices.scanner_fix_mechanic(
        id_user_mechanic,
        id_machine,
        factory,
        lean,
        status,
        language
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const finish_mechanic = createAsyncThunk(
  "/task/machineCfmfinish",
  async ({
    id_user_mechanic,
    skill,
    id_machine,
    remark_mechanic,
    lean,
    factory,
    statusRadio,
    language,
    new_mechanic,
    otherIssue,new_id_user_mechanic
  }) => {
    try {
      const data = await ElectricServices.finish_mechanic(
        id_user_mechanic,
        skill,
        id_machine,
        remark_mechanic,
        lean,
        factory,
        statusRadio,
        language,
        new_mechanic,
        otherIssue,new_id_user_mechanic
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_history_mechanic = createAsyncThunk(
  "/task/getHistoryMechanic",
  async ({ id_user_mechanic, factory }) => {
    try {
      const data = await ElectricServices.get_history_mechanic(
        id_user_mechanic,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_info_calculate = createAsyncThunk(
  "/task/getInfoCalculate",
  async ({ date_from, date_to, user_name, factory }) => {
    try {
      const data = await ElectricServices.get_info_calculate(
        date_from,
        date_to,
        user_name,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_info_task = createAsyncThunk(
  "/task/getInfoTask",
  async ({ date_from, date_to, user_name, factory }) => {
    try {
      const data = await ElectricServices.get_info_task(
        date_from,
        date_to,
        user_name,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

// Status TaskDetail
export const get_list_status_task_detail = createAsyncThunk(
  "/task/getListStatusTaskDetail",
  async ({ fromdate, todate, factory, floor, lean }) => {
    try {
      const data = await ElectricServices.get_list_status_task_detail(
        fromdate,
        todate,
        factory,
        floor,
        lean
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

// Count Status TaskDetail
export const get_count_status_task = createAsyncThunk(
  "/task/getCountStatusTask",
  async ({ fromdate, todate, factory, floor, lean }) => {
    try {
      const data = await ElectricServices.get_count_status_task(
        fromdate,
        todate,
        factory,
        floor,
        lean
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_info_skill = createAsyncThunk(
  "/task/getInforSkill",
  async ({ userRequest }) => {
    try {
      const data = await ElectricServices.get_info_skill({ userRequest });
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_all_lean = createAsyncThunk(
  "/user/getAllLean",
  async ({ factory, floor }) => {
    try {
      const data = await ElectricServices.get_all_lean(factory, floor);
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const call_support = createAsyncThunk(
  "/task/callSupport",
  async ({
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
  }) => {
    try {
      const data = await ElectricServices.call_support(
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
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_task_support = createAsyncThunk(
  "/task/getTaskSupport",
  async ({ user_machine, factory }) => {
    try {
      const data = await ElectricServices.get_task_support(
        user_machine,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_history_task_support = createAsyncThunk(
  "/task/getHistoryTaskSupport",
  async ({ user_machine, factory }) => {
    try {
      const data = await ElectricServices.get_history_task_support(
        user_machine,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const accept_support = createAsyncThunk(
  "/task/acceptSupport",
  async ({ id, factory, line, status, user_machine, support_detail, lang }) => {
    try {
      const data = await ElectricServices.accept_support(
        id,
        factory,
        line,
        status,
        user_machine,
        support_detail,
        lang
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_all_floor = createAsyncThunk(
  "/user/getAllFloor",
  async ({ factory }) => {
    try {
      const data = await ElectricServices.get_all_floor(factory);
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_Machine_Under_Repair = createAsyncThunk(
  "/task/getMachineUnderRepair",
  async ({ line, factory }) => {
    try {
      const data = await ElectricServices.getMachineUnderRepair(line, factory);
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const change_floor = createAsyncThunk(
  "/task/changeFloor",
  async ({ floor, factory, user_name, lang }) => {
    try {
      const data = await ElectricServices.change_floor(
        floor,
        factory,
        user_name,
        lang
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const get_All_Task = createAsyncThunk(
  "/task/getAllTask",
  async ({ factory, fromDate, toDate, floor, fixer }) => {
    try {
      const data = await ElectricServices.get_All_task(
        factory,
        fromDate,
        toDate,
        floor,
        fixer
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_task_relocate_machine = createAsyncThunk(
  "/task/get_task_relocate_machine",
  async ({ fixer, id_owner, factory }) => {
    try {
      const data = await ElectricServices.get_task_relocate_machine(
        fixer,
        id_owner,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const asign_Task_Relocate_Machine = createAsyncThunk(
  "/task/asignTaskRelocateMachine",
  async ({ fixer, id_owner, factory, repairman, arrRepairman, id_task,req_floor }) => {
    try {
      const data = await ElectricServices.asignTaskRelocateMachine(
        fixer,
        id_owner,
        factory,
        repairman,
        arrRepairman,
        id_task,req_floor
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const electricSlice = createSlice({
  name: "electric",
  initialState: {
    errorCode: null,
    errorMessage: "",
    dataTaskReportDamageList: [], //Manager
    dataOwnerTaskReportDamageList: [],
    workListReportEmployee: [], // Mechanic Employee
    historyListReportMechanic: [],
    infoCalculate: [],
    infoTask: [],
    infoSkill: [],
    infoMachineUnderRepair: [],
    getListStatusMechanic: [],
    getListAsignMechanic: [],
    getListStatusTaskDetail: [],
    getListRepairMechanic: [],
    getTop5LongestRepairTime: [],
    getTop3BrokenMachines: [],
    countStatusTask: {},
    getAllLean: [],
    callSupport: [],
    getTaskSupport: [],
    getHistoryTaskSupport: [],
    acceptSupport: [],
    getAllFloor: [],
    changeFloor: [],
    getAllTaskByCB: [],
    getTaskRelocate: [],
  },
  reducers: {
    setErrorCode: (state, action) => {
      state.errorCode = action.payload.errorCode;
      state.errorMessage = action.payload.errorMessage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_task_damage.fulfilled, (state, action) => {
      state.dataTaskReportDamageList = action.payload.data;
    });
    builder.addCase(get_owner_task_damage.fulfilled, (state, action) => {
      state.dataOwnerTaskReportDamageList = action.payload.data;
    });
    builder.addCase(get_list_status_mechanic.fulfilled, (state, action) => {
      state.getListStatusMechanic = action.payload.data;
    });
    builder.addCase(get_task_relocate_machine.fulfilled, (state, action) => {
      state.getTaskRelocate = action.payload.data;
    });
    builder.addCase(get_list_repair_mechanic.fulfilled, (state, action) => {
      state.getListRepairMechanic = action.payload.data;
    });
    builder.addCase(get_list_asign_mechanic.fulfilled, (state, action) => {
      state.getListAsignMechanic = action.payload.data;
    });
    builder.addCase(
      get_work_list_report_employee.fulfilled,
      (state, action) => {
        state.workListReportEmployee = action.payload.data;
      }
    );
    builder.addCase(owner_asign_task.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(scanner_fix_mechanic.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(scanner_fix_mechanic.rejected, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(finish_mechanic.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(finish_mechanic.rejected, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(get_history_mechanic.fulfilled, (state, action) => {
      state.historyListReportMechanic = action.payload.data;
    });
    builder.addCase(get_info_calculate.fulfilled, (state, action) => {
      state.infoCalculate = action.payload.data;
    });
    builder.addCase(get_info_task.fulfilled, (state, action) => {
      state.infoTask = action.payload.data;
    });
    builder.addCase(get_info_skill.fulfilled, (state, action) => {
      state.infoSkill = action.payload.data;
    });
    builder.addCase(get_list_status_task_detail.fulfilled, (state, action) => {
      state.getListStatusTaskDetail = action.payload.data;
    });
    builder.addCase(get_count_status_task.fulfilled, (state, action) => {
      state.countStatusTask = action.payload.data;
    });
    builder.addCase(get_top_longest_repair_time.fulfilled, (state, action) => {
      state.getTop5LongestRepairTime = action.payload.data;
    });
    builder.addCase(get_top3_broken_machines.fulfilled, (state, action) => {
      state.getTop3BrokenMachines = action.payload.data;
    });
    builder.addCase(get_all_lean.fulfilled, (state, action) => {
      state.getAllLean = action.payload.data;
    });
    builder.addCase(get_All_Task.fulfilled, (state, action) => {
      state.getAllTaskByCB = action.payload.data;
    });
    builder.addCase(call_support.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(get_task_support.fulfilled, (state, action) => {
      state.getTaskSupport = action.payload.data;
    });
    builder.addCase(get_history_task_support.fulfilled, (state, action) => {
      state.getHistoryTaskSupport = action.payload.data;
    });
    builder.addCase(accept_support.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(get_all_floor.fulfilled, (state, action) => {
      state.getAllFloor = action.payload.data;
    });
    builder.addCase(get_Machine_Under_Repair.fulfilled, (state, action) => {
      state.infoMachineUnderRepair = action.payload.data;
    });
    builder.addCase(change_floor.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(asign_Task_Relocate_Machine.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
  },
});

const { reducer } = electricSlice;
export default reducer;
