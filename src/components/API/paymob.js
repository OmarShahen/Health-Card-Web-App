import axios from 'axios'

const PAYMOB_URL = 'https://accept.paymob.com/api'

export const paymobRequest = axios.create({
    baseURL: PAYMOB_URL
})
