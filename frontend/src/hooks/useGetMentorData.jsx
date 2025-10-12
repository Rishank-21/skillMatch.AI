import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMentorData } from "../redux/mentorSlice";

//helper

const useGetMentorData = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchMentorData = async () => {
            try {
                const result = await axios.get(`${import.meta.env.VITE_API_URL}/mentor/mentorData`, {withCredentials : true});
                dispatch(setMentorData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchMentorData()
    },[dispatch])
}

export default useGetMentorData