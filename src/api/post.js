import axios from 'axios'
import {useUserStore} from "../stores/user";
import {storeToRefs} from "pinia";
const {token} = storeToRefs(useUserStore())
const authFetch =  axios.create({
    baseURL: 'http://spoti/api/',
    withCredentials: true,
    headers:{
        Accept:'application/json',
        Authorization: 'Bearer '+ token
    }
})
export default authFetch
