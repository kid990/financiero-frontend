import { createWebHistory, createRouter } from 'vue-router'
import {jwtDecode} from 'jwt-decode'

import Auth from '../auth/Auth.vue'
import Login from '../auth/Login.vue'
import Register from '../auth/Register.vue'
import DashboardLayout from '../components/dashboard/DashboardLayout.vue'
import DashboardHome from '../components/dashboard/DashboardHome.vue'
import SolicitudNueva from '../components/dashboard/SolicitudNueva.vue'
import SolicitudRegistros from '../components/dashboard/SolicitudRegistros.vue'
import ResultadosView from '../components/dashboard/ResultadosView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: Auth,
    meta: {
      requiresGuest: true
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: DashboardHome
      },
      {
        path: 'solicitud/nueva',
        name: 'SolicitudNueva',
        component: SolicitudNueva
      },
      {
        path: 'solicitud/registros',
        name: 'SolicitudRegistros',
        component: SolicitudRegistros
      },
      {
        path: 'resultados',
        name: 'Resultados',
        component: ResultadosView
      }
    ]
  },
  {
    path: '/evaluacion',
    redirect: '/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (isAuthenticated) {
    try {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem('token');
        next('/login');
        return;
      }
    } catch (error) {
      localStorage.removeItem('token');
      next('/login');
      return;
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  }
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard');
  }
  else {
    next()
  }
})

export default router
