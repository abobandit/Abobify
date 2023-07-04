import axios from 'axios'
const token = localStorage.getItem('token')
const adminGetInstance =  axios.create({
    baseURL: 'http://spoti/api/admin/',
    withCredentials: true,
    method:'get',
    headers:{
        Accept:'application/json',
        Authorization: 'Bearer '+ token
    }
})
export default adminGetInstance
