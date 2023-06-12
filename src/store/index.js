import { configureStore } from "@reduxjs/toolkit";

import appSlice from './app-slice';
import authSlice from './auth-slice';

const store = configureStore({
    reducer: {
        app: appSlice.reducer,
        auth: authSlice.reducer,
    } 
})

export default store;

