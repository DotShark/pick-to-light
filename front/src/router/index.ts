import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@views/LoginView.vue'),
    },
    {
      path: '/login-admin',
      name: 'loginAdmin',
      component: () => import('@views/LoginAdminView.vue'),
    },
    {
      path: '/select',
      name: 'select',
      component: () => import('@views/SelectView.vue'),
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('@views/ManageView.vue'),
    },
    {
      path: '/manage/shelve/:shelveId',
      name: 'manageShelve',
      component: () => import('@views/ManageView.vue'),
      props: true,
    },
    {
      path: '/manage/shelve/:shelveId/floor/:floorId',
      name: 'manageFloor',
      component: () => import('@views/ManageView.vue'),
      props: true,
    },
  ],
})

export default router
