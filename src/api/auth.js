import axios from 'axios'
const token = localStorage.getItem('token')
const instance =  axios.create({
    baseURL: 'http://spoti/api/',
    withCredentials: true,
    headers:{
        Accept:'application/json',
        Authorization: 'Bearer '+ token
    }
})
export default instance
