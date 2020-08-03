import axios from 'axios'
import env from '@/.env'
import store from '@/store'

const instance = axios.create({
  baseURL: env.BASE_API
})

instance.interceptors.request.use(config => {
  const token = store.state.token || localStorage.getItem(env.AUTH_TOKEN)

  config.data = {
    ...config.data
  }
  /*
  * O método common.Authorization inclui o headers em todas as requisições
  * Por isso é preciso verificar se a rota é de login e retirar o token do headers
  */
  if (config.url !== '/rest-auth/login/') config.headers.common.Authorization = `Token ${token}`

  config.baseURL = env.BASE_API

  // console.log('interceptador', config)

  return config
}, errors => {
  console.log('Erro no interceptor request', errors)
})

export default instance

// export default {
//   axios,
//   baseURL: env.BASE_API
// }

// export default axios.create({
//   baseURL: env.BASE_API
// })
