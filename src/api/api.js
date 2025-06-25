import axios from 'axios'

// Создаём экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000, // Таймаут запроса
})

// Метод для запросов с авторизацией
export const authRequest = (config) => {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    return Promise.reject(new Error('No authentication token found'))
  }

  // Добавляем заголовок авторизации
  const authConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  }

  return api(authConfig)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Auth request error:', error)
      throw error
    })
}

// Метод для публичных запросов
export const publicRequest = (config) => {
  return api(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Public request error:', error)
      throw error
    })
}

// Интерцептор ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, redirect to login')
      this.$router.push({ name: 'user.login' })
    }
    return Promise.reject(error)
  }
)
