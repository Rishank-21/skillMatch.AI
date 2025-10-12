import { createSlice } from "@reduxjs/toolkit";
//helper
const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    resumeData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
});

export const { setUserData, setResumeData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
