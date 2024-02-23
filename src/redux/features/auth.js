import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../services/auth.services";

export const setErrorCode = (errorCode) => {
    return {
        type: 'auth/setErrorCode',
        payload: errorCode,
    };
};

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password, factory, token, language }) => {
        try {
            const data = await AuthService.login(username, password, factory, token, language);
            return data;
        } catch (error) {
            return error.message;
        }
    }
);

export const logout = createAsyncThunk("auth/logout",
    async () => {
        await AuthService.logout();
    });

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        errorCode: null,
        isLoading: false,
        errorMessage: "",
        user: localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null,
    },
    reducers: {
        setErrorCode: (state, action) => {
            state.errorCode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data.user;
            state.errorCode = action.payload.error_code;
            state.errorMessage = action.payload.error_message;
        });

        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.errorCode = action.payload.error_code;
            state.errorMessage = action.payload.error_message;
        });

        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.errorMessage = "";
        });
    },
});

const { reducer } = authSlice;
export default reducer;