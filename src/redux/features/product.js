import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductServices from "../services/product.services";

export const setErrorCode = (errorCode, errorMessage) => {
    return {
        type: 'product/setErrorCode',
        payload: {
            errorCode,
            errorMessage,
        },
    };
};


export const get_report_damage = createAsyncThunk("damage_report/getTaskInfo", async ({ id_user_request, factory }) => {
    try {
        const data = await ProductServices.get_report_damage(id_user_request, factory);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const report_damage = createAsyncThunk(
    "/damage_report/callMechanic",
    async ({ id_machine, id_user_request, remark, factory, fixer, language }) => {
        try {
            const data = await ProductServices.report_damage(id_machine, id_user_request, remark, factory, fixer, language);
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
            const data = await ProductServices.get_history_product(id_user_request, factory);
            return data;
        } catch (error) {
            return error.message;
        }
    }
);

export const cancel_report_damage = createAsyncThunk(
    "/damage_report/deleteTask",
    async ({ user_name, id_machine, factory, language }) => {
        try {
            const data = await ProductServices.cancel_report_damage(user_name, id_machine, factory, language);
            return data;
        } catch (error) {
            return error.message;
        }
    })

export const productSlice = createSlice({
    name: "product",
    initialState: {
        errorCode: null,
        errorMessage: "",
        requestListReportProduct: [],
        historyListReportProduct: [],
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
        builder.addCase(report_damage.rejected, (state, action) => {
            state.errorCode = action.payload.error_code;
            state.errorMessage = action.payload.error_message;
        });
        builder.addCase(report_damage.fulfilled, (state, action) => {
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
    },
});

const { reducer } = productSlice;
export default reducer;
