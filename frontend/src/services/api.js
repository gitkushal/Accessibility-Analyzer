import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL : API_BASE_URL,
    headers: {
        'Content-Type' : 'application/json',
    }
})

//api function
export const scanAPI = {
    //create new scan
    createScan: async(url) => {
        try{
            const response = await api.post('/scans', {url});
            return response.data;
        }
        catch(error){
            throw new Error(error.response?.data?.message || 'Failed to create scan');
        }
    },
    //get scn results
    getScan: async(scanID) => {
        try{
            const response = await api.get(`/scans/${scanID}`);
            return response.data;
        }
        catch(error){
            throw new Error(error.response?.data?.message || 'Failed to fetch scan');
        }
    }
};

export default api;

