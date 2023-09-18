import axios from 'axios'
const token = JSON.parse(localStorage.getItem('user')).userData.token
const adminInstance =  axios.create({
    baseURL: 'http://spotiback/api/',
    method:'patch',
    withCredentials: true,
    headers:{
        Accept:'application/json',
        Authorization: 'Bearer '+ token
    }
})
export default adminInstance
