import axios from '@/plugins/axios'
import store from '../../store'

/*
* Função que permite o login do usuário
*/
const login = async (email, password) => {
  const response = await axios.post('/rest-auth/login/', {
    email: email,
    password: password
  })
  // console.log('Login: ', response)

  store.commit('setToken', response.data.key)

  return response.data.key
}

/*
* Função para registar um novo usuário
*/
const signup = async variables => {
  const response = await axios.post('/rest-auth/registration/', {
    password1: variables.password,
    password2: variables.confirmPassword,
    email: variables.email
  })
  if (response.statusText === 'Created') await login(variables.email, variables.password)

  return signup
}

/* Retorna os dados do usuário autenticado */
const getUserAuthenticated = async () => {
  const response = await axios.get('/rest-auth/user/')
  return response.data
}

export default { login, signup, getUserAuthenticated }
