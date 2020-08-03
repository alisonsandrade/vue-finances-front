import axios from '@/plugins/axios'
import AuthServices from '@/modules/services/auth-services'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

const getAllCategories = (operation) => {
  const response = axios.get('/categories/')
  return from(response)
    .pipe(
      map(response => {
        if (operation) {
          return response.data.filter(res => res.operation === operation)
        }
        return response.data
      })
    )
}

// const getAllByType = async (operation) => {
//   const response = await axios.get('/categories/')
//   return response.data.filter(res => res.operation === operation)
// }
const getAllByType = (operation) => {
  const response = axios.get('/categories/')
  return from(response)
    .pipe(
      map(r => r.data.filter(res => res.operation === operation))
    )
}

const create = async variables => {
  const userLogged = await AuthServices.getUserAuthenticated()
  variables = { ...variables, user: userLogged.pk }
  const response = await axios.post('/categories/', variables)
  return response.data
}

export default {
  getAllCategories,
  getAllByType,
  create
}
