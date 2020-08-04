import axios from '@/plugins/axios'
import moment from 'moment'
import AuthServices from '@/modules/services/auth-services'
import { from } from 'rxjs' // Permite criar um Observable
import { map } from 'rxjs/operators'

/* Listagem de todos os registros. Retorna um Observable */
const getAll = variables => {
  const response = axios.get('records/')
  return from(response)
    .pipe(
      map(res => {
        return res.data.filter(response => {
          const dateFormat = moment(moment(response.date).format('MM-YYYY'), 'MM-YYYY')
          return (
            dateFormat <= moment(variables.month, 'MM-YYYY')
          )
        })
          .filter(r1 => {
            return variables.type !== undefined ? r1.type === variables.type : r1
          })
          .filter(r2 => {
            return (variables.categories !== undefined && variables.categories.length > 0) ? [...variables.categories].includes(r2.category.id) : r2
          })
          .filter(r3 => {
            return (variables.wallets !== undefined && variables.wallets.length > 0) ? [...variables.wallets].includes(r3.wallet.id) : r3
          })
      })
    )
}

/* constante que carrega todos os lançamentos records */
const getAllRecords = async variables => {
  const response = await axios.get('records/')
  return response.data
}

/* saldo atual total */
const getTotalBalance = async (month) => {
  const values = await getAllRecords()
  const response = values.filter(response => {
    const dateFormat = moment(moment(response.date).format('MM-YYYY'), 'MM-YYYY')
    return dateFormat <= moment(month, 'MM-YYYY')
  }).reduce((acc, { date, amount }) => +acc + +amount, 0)
  return response
}

/* cadastrar lançamento */
const create = async variables => {
  const userLogged = await AuthServices.getUserAuthenticated()
  variables = { ...variables, user: userLogged.pk }
  const response = await axios.post('/records/', variables)
  return response
}

export default {
  getAllRecords,
  getTotalBalance,
  create,

  getAll
}
