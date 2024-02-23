import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth';
import productReducer from './features/product';
import electricReducer from './features/electric';
import machineReducer from './features/machine';

const reducer = {
    auth: authReducer,
    product: productReducer,
    electric: electricReducer,
    machine: machineReducer,
}

const store = configureStore({
    reducer: reducer,
    devTools: true,
})

export default store;