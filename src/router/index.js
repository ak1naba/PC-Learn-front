import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/MainView.vue'),
      name: 'main',
    },
    {
      path: '/login',
      component: () => import('@/views/User/LoginView.vue'),
      name: 'user.login',
    },
    {
      path: '/home',
      component: () => import('@/views/User/HomeView.vue'),
      name: 'home',
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/ControlPanelView.vue'),
      name: 'admin',
    },
    {
      path: '/admin/users',
      component: () => import('@/views/admin/UsersPanelView.vue'),
      name: 'admin.users',
    },
    {
      path: '/admin/lessons',
      component: () => import('@/views/admin/LessonsPanelView.vue'),
      name: 'admin.lessons',
    },
    {
      path: '/admin/lessons/add',
      component: () => import('@/views/admin/lessons/AddLessonView.vue'),
      name: 'admin.lessons.add',
    },
    {
      path: '/admin/lesson/:url_title',
      component: () => import('@/views/admin/lessons/LessonView.vue'),
      name: 'admin.lessons.lesson',
    },
    {
      path: '/admin/lesson/edit/:url_title',
      component: () => import('@/views/admin/lessons/EditLessonView.vue'),
      name: 'admin.lessons.edit',
    },

    {
      path:'/game',
      component: () =>import('@/views/game/MenuView.vue'),
      name:'game',
    },
    {
      path:'/game/:type',
      component:()=>import('@/views/game/GameListView.vue'),
      name:'game.list'
    },
    {
      path:'/game/theory/:url_title',
      component:()=>import('@/views/game/TheoryView.vue'),
      name:'game.theory',
    },
    {
      path:'/game/practic/:url_title',
      component:()=>import('@/views/game/PracticView.vue'),
      name:'game.practic',
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/404View.vue'),
    },
  ],
})

export default router
