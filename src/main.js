import '@/assets/style/base.scss'
import $ from 'jquery'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

window.$ = window.jQuery = $

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
