import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import mentorSlice from "./mentorSlice"
export const store = configureStore({
    reducer:{
        user:userSlice,
        mentor:mentorSlice
    }
})

//helper