import { createWebHistory, createRouter } from 'vue-router'
import {jwtDecode} from 'jwt-decode'  // Importar jwt-decode

import Auth from '../auth/Auth.vue'
import Login from '../auth/Login.vue'
import Register from '../auth/Register.vue'
import Evaluacion from '../components/Evaluacion.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'  // Redirige la raíz a la página de login
  },
  {
    path: '/',
    component: Auth,
    meta: {
      requiresGuest: true  // Solo usuarios no autenticados pueden acceder
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
    path: '/evaluacion',
    name: 'Evaluacion',
    component: Evaluacion,
    meta: {
      requiresAuth: true  // Solo usuarios autenticados pueden acceder
    }
  },
  {
    path: '/:pathMatch(.*)*',  // Ruta comodín para rutas no encontradas
    name: 'NotFound',
    redirect: '/login'  // Redirige a login si la ruta no existe
  }
]

const router = createRouter({
  history: createWebHistory(),  // Usar el historial del navegador
  routes,
})

// Guardia de navegación global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')  // Obtén el token JWT de localStorage
  const isAuthenticated = !!token  // Determina si el usuario está autenticado

  // Si el token está presente, verificar si ha expirado
  if (isAuthenticated) {
    try {
      const decodedToken = jwtDecode(token);  // Decodificar el token
      const isExpired = decodedToken.exp * 1000 < Date.now();  // Comparar la fecha de expiración con la fecha actual

      if (isExpired) {
        localStorage.removeItem('token');  // Eliminar el token si ha expirado
        next('/login');  // Redirigir al login si el token ha expirado
        return;
      }
    } catch (error) {
      // Si el token no se puede decodificar (por ejemplo, si no es válido), eliminar el token
      localStorage.removeItem('token');
      next('/login');  // Redirigir al login si hay un error al decodificar el token
      return;
    }
  }

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');  // Redirige a login si no está autenticado
  }
  // Si la ruta requiere ser un invitado y el usuario está autenticado
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/evaluacion');  // Redirige a evaluacion si el usuario ya está autenticado
  }
  // Permite la navegación si no hay restricciones
  else {
    next()
  }
})

export default router
