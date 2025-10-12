import { createSlice } from "@reduxjs/toolkit"

//helper

const mentorSlice = createSlice({
    name : "mentor",
    initialState : {
        mentorData : null
    },
    reducers : {
        setMentorData : (state , action) =>{
            state.mentorData = action.payload
        }
    }
})


export const {setMentorData} = mentorSlice.actions
export default mentorSlice.reducer

