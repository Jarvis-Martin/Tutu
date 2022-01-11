import axios from 'axios'
import Qs from 'qs'

export function request(config) {
  const instance = axios.create({
    // baseURL: 'http://localhost:3000/Tpfx/api/v1/',
    baseURL: 'http://localhost:8080/Tpfx/api/v1/',
    // baseURL: 'http://139.155.5.93:8080/Tpfx/api/v1/',
  })

  instance.interceptors.response.use(res => {
    // 去除掉 axios 框架自带的那些 信息，只返回需要的 那份数据
    let data = res.data
    console.log(res)
    console.log(data)
    return data
  })
  return instance(config)
}

export function post(url, params) {
  console.log(Qs.stringify(params))
  return new Promise( (resolve, reject) => {
    // axios.post(url, Qs.stringify(params), {baseURL: 'http://139.155.5.93:8080/Tpfx/api/v1/'})
    axios.post(url, Qs.stringify(params), {baseURL: 'http://localhost:8080/Tpfx/api/v1/'})
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}