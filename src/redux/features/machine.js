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

export const get_all_machine = createAsyncThunk("/damage_report/getAllMachine", async ({ factory }) => {
    try {
        const data = await MachineService.get_all_machine(factory);
        return data;
    } catch (error) {
        return error.message;
    }
});

export const machineSlice = createSlice({
    name: "machine",
    initialState: {
        machine: {},
        machineList: []
    }, 
    extraReducers: (builder) => {
        builder
            .addCase(get_info_machine.fulfilled, (state, action) => {
                state.machine = action.payload.data;
            })
            .addCase(get_all_machine.fulfilled, (state, action) => {
                state.machineList = action.payload.data;
            });
    }
})

const { reducer } = machineSlice;
export default reducer;
