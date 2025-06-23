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
      name: 'home'
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/ControlPanelView.vue'),
      name: 'admin',
      children:[
        {
          path: '/admin/users',
          component: () => import('@/views/admin/UsersPanelView.vue'),
          name: 'admin.users'
        },
        {
          path: '/admin/lessons',
          component: () => import('@/views/admin/LessonsPanelView.vue'),
          name: 'admin.lessons',
        },
        {
          path: '/admin/lessons/add',
          component: () => import('@/views/admin/lessons/AddLessonView.vue'),
          name: 'admin.lessons.add'
        },
        {
          path: '/admin/lesson/:url_title',
          component: () => import('@/views/admin/lessons/lesson.vue'),
          name: 'admin.lessons.lesson'
        },
        {
          path: '/admin/lesson/edit/:url_title',
          component: () => import('@/views/admin/lessons/editLesson.vue'),
          name: 'admin.lessons.edit'
        },

      ]
    },
  ],
})

export default router
