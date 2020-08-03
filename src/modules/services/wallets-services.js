import axios from '@/plugins/axios'
import AuthServices from '@/modules/services/auth-services'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

const getAllWallets = variables => {
  const response = axios.get('wallets/')
  return from(response)
    .pipe(
      map(res => res.data)
    )
}

const create = async variables => {
  const userLogged = await AuthServices.getUserAuthenticated()
  variables = { ...variables, user: userLogged.pk }
  const response = await axios.post('/wallets/', variables)
  return response.data
}

export default {
  getAllWallets,
  create
}
