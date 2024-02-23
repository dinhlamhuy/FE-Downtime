import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MachineService from "../services/machine";

export const get_info_machine = createAsyncThunk("/damage_report/getMachine", async ({ factory, id_machine }) => {
    try {
        const data = await MachineService.get_info_machine(factory, id_machine);
        return data;
    } catch (error) {
        return error.message;
    }
})

export const machineSlice = createSlice({
    name: "machine",
    initialState: {
        machine: {}
    }, extraReducers: (builder) => {
        builder.addCase(get_info_machine.fulfilled, (state, action) => {
            state.machine = action.payload.data;
        });
    }
})

const { reducer } = machineSlice;
export default reducer;