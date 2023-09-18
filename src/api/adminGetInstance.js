import axios from 'axios'
const token = JSON.parse(localStorage.getItem('user')).userData.token
const adminGetInstance =  axios.create({
    baseURL: 'http://spotiback/api/admin/',
    withCredentials: true,
    method:'get',
    headers:{
        Accept:'application/json',
        Authorization: 'Bearer '+ token
    }
})
export default adminGetInstance
