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
      path: '/signup',
      component: () => import('@/views/User/RegistrationView.vue'),
      name: 'user.signup',
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
      path:'/commercial/about',
      component:()=>import('@/views/commercialFactors/AboutView.vue'),
      name:'commercial.about'
    },
    {
      path:'/commercial/license',
      component:()=>import('@/views/commercialFactors/LicenseView.vue'),
      name:'commercial.license'
    },
    {
      path:'/commercial/contacts',
      component:()=>import('@/views/commercialFactors/ContactsView.vue'),
      name:'commercial.contacts'
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/404View.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const roleUser = JSON.parse(localStorage.getItem('user')).role; // Добавлена безопасная проверка

  // Настройка доступа к общедоступным страницам
  if (to.name && to.name.startsWith('commercial.')) {
    return next();
  }

  // Если пользователь не залогинен
  if (!token) {
    // Разрешаем доступ к главной странице и странице входа
    if (to.name === 'user.login' || to.name === "user.signup" || to.name === 'main') {
      return next();
    }
    // Перенаправляем на страницу входа для всех других маршрутов
    return next({ name: 'user.login' });
  }

  // Если пользователь залогинен
  if (to.name == 'user.login' || to.name == 'user.signup') {
    // Не разрешаем доступ к странице входа для авторизованных пользователей
    return next({ name: 'home' });
  }

  // Проверка прав администратора
  if (to.name && to.name.startsWith('admin.')) {
    if (roleUser != "1") {
      return next({ name: 'home' });
    }
    return next();
  }

  // Для всех других маршрутов разрешаем доступ
  next();
})


export default router
