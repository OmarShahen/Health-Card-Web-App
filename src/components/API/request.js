import axios from 'axios'

const DEV_URL = 'http://localhost:5000/api'

export const serverRequest = axios.create({
    baseURL: DEV_URL
})