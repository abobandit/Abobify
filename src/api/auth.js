import axios from 'axios'
import {storeToRefs} from "pinia";
import {useUserStore} from "../stores/user";
const token = JSON.parse(localStorage.getItem('user')).userData.token
// console.log(token   )
const instance =  axios.create({
    baseURL: 'http://spotiback/api/',
    withCredentials: true,
    headers:{
        Accept:'application/json',
        Authorization: 'Bearer ' + token

    }
})
export default instance
