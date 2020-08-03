import financesRoutes from '@/modules/finances/router'
const Dashboard = () => import('@/modules/dashboard/views/Dashboard.vue')

export default [
  {
    path: '/dashboard',
    component: Dashboard,
    /* Necessário para indicar que essa rota precisa de autenticação */
    meta: { requiresAuth: true },
    children: [
      ...financesRoutes
    ]
  }
]
