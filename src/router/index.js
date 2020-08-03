import Vue from 'vue'
import VueRouter from 'vue-router'

import env from '@/.env'
import AuthService from '@/modules/services/auth-services'
import authRoutes from '@/modules/auth/router'
import dashboardRoutes from '@/modules/dashboard/router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...authRoutes,
    ...dashboardRoutes,
    { path: '', redirect: '/login' }
  ]
})

router.beforeEach(async (to, from, next) => {
  // Verifica se alguma das rotas acima necessitam de autenticação
  if (to.matched.some(route => route.meta.requiresAuth)) {
    const token = localStorage.getItem(env.AUTH_TOKEN)
    const loginRoute = {
      path: '/login',
      query: { redirect: to.fullPath } // queryparams para onde o usuário pretendia ir
    }
    if (token) {
      try {
        const userLogged = await AuthService.getUserAuthenticated()
        if (userLogged) return next()
      } catch (error) {
        console.log('Automatic error login', error)
        return next(loginRoute)
      }
    }
    // se não tiver token direciona para o login já com a rota pretendida no params
    return next(loginRoute)
  }
  next()
})

export default router
