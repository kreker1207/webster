import axios from 'axios';

const api = axios.create({
    baseURL: `http://localhost:8080/api`,
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    credentials: 'include',   
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const accessToken =  window.localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Authorization = `${accessToken}`;
    }
    return config
})

api.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (!error.response) {
            console.log("Please check your internet connection.");
        } 
        return Promise.reject(error)
    }
)

export default api