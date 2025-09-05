import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import RecuperarSenha from '../views/RecuperarSenha.vue'
import CriarCadastro from '../views/CadastroUser.vue'
import ListagemCadastros from '../views/ListaCadastro.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/recuperar-senha',
    name: 'RecuperarSenha',
    component: RecuperarSenha
  },
  {
    path: '/criar-cadastro',
    name: 'CriarCadastro',
    component: CriarCadastro,
  },
  {
    path: '/listagem-cadastros',
    name: 'ListagemCadastros',
    component: ListagemCadastros,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router