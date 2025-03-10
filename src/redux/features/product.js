import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductServices from "../services/product.services";

export const setErrorCode = (errorCode, errorMessage) => {
  return {
    type: "product/setErrorCode",
    payload: {
      errorCode,
      errorMessage,
    },
  };
};

export const get_report_damage = createAsyncThunk(
  "damage_report/getTaskInfo",
  async ({ id_user_request, factory }) => {
    try {
      const data = await ProductServices.get_report_damage(
        id_user_request,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_Relocate_Machine = createAsyncThunk(
  "damage_report/getTaskRelocateMachine",
  async ({ id_user_request, factory }) => {
    try {
      const data = await ProductServices.getTaskRelocateMachine(
        id_user_request,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const report_damage = createAsyncThunk(
  "/damage_report/callMechanic",
  async ({
    id_machine,
    id_user_request,
    remark,
    factory,
    fixer,
    language,
    otherIssue,
  }) => {
    try {
      const data = await ProductServices.report_damage(
        id_machine,
        id_user_request,
        remark,
        factory,
        fixer,
        language,
        otherIssue
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const relocation_report = createAsyncThunk(
  "/damage_report/callRelocateMachine",
  async ({
    ID_lean,
    ID_Floor,
    id_user_request,
    req_floor,
    remark,
    factory,
    languages,
  }) => {
    try {
      const data = await ProductServices.relocation_report(
        ID_lean,
        ID_Floor,
        id_user_request,
        req_floor,
        remark,
        factory,
        languages
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_info_reason = createAsyncThunk(
  "/damage_report/getInforReason",
  async (dept) => {
    try {
      const data = await ProductServices.get_info_reason(dept);
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_task_receiving_process = createAsyncThunk(
  "/task/getTaskRecordHistory",
  async ({ id_task }) => {
    try {
      const data = await ProductServices.get_task_receiving_process({
        id_task,
      });
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const get_history_product = createAsyncThunk(
  "/damage_report/getHistoryTaskProduct",
  async ({ id_user_request, factory }) => {
    try {
      const data = await ProductServices.get_history_product(
        id_user_request,
        factory
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const cancel_report_damage = createAsyncThunk(
  "/damage_report/deleteTask", // Tên action
  async ({ user_name, id_machine, factory, language }) => {
    try {
      const data = await ProductServices.cancel_report_damage(
        user_name,
        id_machine,
        factory,
        language
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const cancel_Task_RelocateMachine = createAsyncThunk(
  "/damage_report/deleteTaskRelocateMachine", // Tên action
  async ({ user_name,floor, ID_Floor, ID_Lean, factory, language }) => {
    try {
      const data = await ProductServices.delete_Task_RelocateMachine(
        user_name,floor,
        ID_Floor,
        ID_Lean,
        factory,
        language
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const finish_Relocate_Machine = createAsyncThunk(
  "/damage_report/finishRelocateMachine", // Tên action
  async ({ user_name,floor,id_task, ID_Floor, ID_Lean, factory, language }) => {
    try {
      const data = await ProductServices.finishRelocateMachine(
        user_name,floor,id_task,
        ID_Floor,
        ID_Lean,
        factory,
        language
      );
      return data;
    } catch (error) {
      return error.message;
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState: {
    errorCode: null,
    errorMessage: "",
    requestListReportProduct: [],
    requestListRelocateMachineProduct: [],
    historyListReportProduct: [],
    infoReason: [],
    taskReceivingProcess: [],
  },
  reducers: {
    setErrorCode: (state, action) => {
      state.errorCode = action.payload.errorCode;
      state.errorMessage = action.payload.errorMessage;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(get_report_damage.fulfilled, (state, action) => {
      state.requestListReportProduct = action.payload.data;
    });
    builder.addCase(get_Relocate_Machine.fulfilled, (state, action) => {
      state.requestListRelocateMachineProduct = action.payload.data;
    });
    builder.addCase(report_damage.rejected, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(report_damage.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(relocation_report.rejected, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(relocation_report.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(get_history_product.fulfilled, (state, action) => {
      state.historyListReportProduct = action.payload.data;
    });
    builder.addCase(cancel_report_damage.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(cancel_Task_RelocateMachine.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(finish_Relocate_Machine.fulfilled, (state, action) => {
      state.errorCode = action.payload.error_code;
      state.errorMessage = action.payload.error_message;
    });
    builder.addCase(get_info_reason.fulfilled, (state, action) => {
      state.infoReason = action.payload.data;
    });
    builder.addCase(get_task_receiving_process.fulfilled, (state, action) => {
      state.taskReceivingProcess = action.payload.data;
    });
  },
});

const { reducer } = productSlice;
export default reducer;
