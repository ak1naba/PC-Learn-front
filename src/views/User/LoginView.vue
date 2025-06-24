<template>
  <BaseLayout>
    <div class="container">
      <div class="form-user">
        <form @submit.prevent="login" class="form-user__inputs">
          <h2 class="form-user__inputs__title">Вход</h2>

          <BaseInput v-model="user.email" type="email" placeholder="Введите почту пользователя" />
          <BaseInput
            v-model="user.password"
            type="password"
            placeholder="Введите пароль пользователя"
          />

          <BaseButton type="submit" variant="primary">
            {{ loading ? 'Ждите...' : 'Войти' }}
          </BaseButton>

          <p v-if="error">{{ error }}</p>
          <p v-if="errors.length > 0">{{ errors }}</p>

          <div>
            Нет аккаунта?
            <a href="../user/signup" class="form-user__inputs__link">Зарегистрироваться</a>
          </div>
        </form>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseInput from '@/components/form/InputComponent.vue'
import BaseBaseButton from '@/components/form/BaseButton.vue'
import { authRequest, publicRequest } from '@/api/api.js'

export default {
  name: 'Login',
  components: { BaseButton: BaseBaseButton, BaseLayout, BaseInput },
  data() {
    return {
      user: {
        email: null,
        password: null,
      },
      loading: false,
      errors: [],
      error: null,
    }
  },
  methods: {
    login() {
      this.loading = true
      publicRequest({
        method: 'post',
        url: '/api/login',
        data: {
          email: this.user.email,
          password: this.user.password,
        },
      })
        .then((response) => {
          console.log(response.user)
          localStorage.setItem('auth_token', `${response.token_type} ${response.access_token}`)
          localStorage.setItem('user', JSON.stringify(response.user))
          this.$router.push({ name: 'home' })
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.error = 'Неверные учетные данные'
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';

.form-user {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  &__inputs {
    width: 360px;

    &__title {
      font-size: 1.4em;
    }

    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 55px 25px;

    &__link {
      color: $text-link;
    }

    .invalid {
      color: $text-invalid;
    }
  }
}

@media (max-width: 960px) {
  .form-user {
    justify-content: center;
  }
}
</style>
