import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ElectricServices from "../services/electric.services";

//common
export const setErrorCode = (errorCode, errorMessage) => {
    return {
        type: 'electric/setErrorCode',
        payload: {
            errorCode,
            errorMessage,
        },
    };
};


//Get Task => Manager
export const get_task_damage = createAsyncThunk("/task/getMechalist", async ({ factory, floor, user_name, lean }) => {
    try {
        const data = await ElectricServices.get_task_damage(factory, floor, user_name, lean);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const get_list_status_mechanic = createAsyncThunk("/task/getListStatusMechanic", async ({ position, factory, floor, lean }) => {
    try {
        const data = await ElectricServices.get_list_status_mechanic(position, factory, floor, lean);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const get_list_asign_mechanic = createAsyncThunk("/task/getListAsignMechanic", async ({ id_machine, floor, factory, position, lean }) => {
    try {
        const data = await ElectricServices.get_list_asign_mechanic(id_machine, floor, factory, position, lean);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const owner_asign_task = createAsyncThunk("/task/ownerAsignTask", async ({ user_name, id_machine, id_owner_mechanic, factory, lean, language }) => {
    try {
        const data = await ElectricServices.owner_asign_task(user_name, id_machine, id_owner_mechanic, factory, lean, language);
        return data;
    } catch (error) {
        return error.message;
    }
})

//List Status => Employee
export const get_work_list_report_employee = createAsyncThunk("/task/getTaskmechaInfo", async ({ id_user_mechanic, factory }) => {
    try {
        const data = await ElectricServices.get_work_list_report_employee(id_user_mechanic, factory);
        return data;
    } catch (error) {
        return error.message;
    }
})

// Confirm and Scanner
export const scanner_fix_mechanic = createAsyncThunk("/task/mechanicAccept", async ({ id_user_mechanic, id_machine, factory, lean, status, language }) => {
    try {
        const data = await ElectricServices.scanner_fix_mechanic(id_user_mechanic, id_machine, factory, lean, status, language);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const finish_mechanic = createAsyncThunk("/task/machineCfmfinish", async ({ id_user_mechanic, skill, id_machine, remark_mechanic, lean, factory, language }) => {
    try {
        const data = await ElectricServices.finish_mechanic(id_user_mechanic, skill, id_machine, remark_mechanic, lean, factory, language);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const get_history_mechanic = createAsyncThunk("/task/getHistoryMechanic", async ({ id_user_mechanic, factory }) => {
    try {
        const data = await ElectricServices.get_history_mechanic(id_user_mechanic, factory);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const get_info_calculate = createAsyncThunk("/task/getInfoCalculate", async ({ date_from, date_to, user_name, factory }) => {
    try {
        const data = await ElectricServices.get_info_calculate(date_from, date_to, user_name, factory);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const get_info_task = createAsyncThunk("/task/getInfoTask", async ({ date_from, date_to, user_name, factory }) => {
    try {
        const data = await ElectricServices.get_info_task(date_from, date_to, user_name, factory);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const get_info_skill = createAsyncThunk("/task/getInforSkill", async () => {
    try {
        const data = await ElectricServices.get_info_skill();
        return data;
    } catch (error) {
        return error.message;
    }
})

export const electricSlice = createSlice({
    name: "electric",
    initialState: {
        errorCode: null,
        errorMessage: "",
        dataTaskReportDamageList: [], //Manager
        workListReportEmployee: [], // Mechanic Employee
        historyListReportMechanic: [],
        infoCalculate: [],
        infoTask: [],
        infoSkill: [],
        getListStatusMechanic: [],
        getListAsignMechanic: [],
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
        builder.addCase(get_list_status_mechanic.fulfilled, (state, action) => {
            state.getListStatusMechanic = action.payload.data;
        });
        builder.addCase(get_list_asign_mechanic.fulfilled, (state, action) => {
            state.getListAsignMechanic = action.payload.data;
        });
        builder.addCase(get_work_list_report_employee.fulfilled, (state, action) => {
            state.workListReportEmployee = action.payload.data;
        });
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
    }
})

const { reducer } = electricSlice;
export default reducer;