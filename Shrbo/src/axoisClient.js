import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})

axiosClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem('Shbro')
    config.headers.Authorization = `Bearer ${token}`
    return config;
})

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        
        try {

            const {reponse} = error;
            if (reponse.status === 401) {
                localStorage.removeItem('Shbro')
            }
            
        } catch (e) {
            console.log(e);
        }

        throw error;
    }
)


export default axiosClient;