import axios from 'axios'
import router from '../router'
import store from '../store'

// eslint-disable-next-line no-unused-vars
const instance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

