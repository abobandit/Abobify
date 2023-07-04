import axios from 'axios'
const token = localStorage.getItem('token')
const adminInstance =  axios.create({
    baseURL: 'http://spoti/api/',
    method:'patch',
    withCredentials: true,
    headers:{
        Accept:'application/json',
        Authorization: 'Bearer '+ token
    }
})
export default adminInstance
