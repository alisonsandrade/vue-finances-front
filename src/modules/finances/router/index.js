import RecordsHome from '@/modules/finances/views/RecordsHome.vue'
import RecordsAdd from '@/modules/finances/views/RecordsAdd.vue'

export default [
  {
    path: 'records',
    component: RecordsHome,
    meta: { requireAuth: true },
    alias: ['home', '']
  },
  {
    path: 'records/add',
    component: RecordsAdd,
    name: 'recordsAdd',
    meta: { requireAuth: true }
  }
]

/*
* O alias utilizado na configuração permite um que o usuário acesse o componente das seguintes formas:
* /dashboard/records
* /dashboard/home
* /dashboard
*/
