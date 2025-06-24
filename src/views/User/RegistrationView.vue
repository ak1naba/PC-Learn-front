<template>
  <BaseLayout>
    <div class="container">
      <div class="form-user">
        <form @submit.prevent="signUp" class="form-user__inputs">
          <h2 class="form-user__inputs__title">Регистрация</h2>
          <BaseInput
            name="name"
            type="text"
            class="input"
            placeholder="Имя"
            v-model="name"
          />
          <BaseInput
            name="email"
            type="email"
            class="input"
            placeholder="Почта"
            v-model="email"
          />
          <BaseInput
            name="password"
            type="password"
            class="input"
            placeholder="Пароль"
            v-model="password"
          />
          <BaseInput
            name="password_confirmation"
            type="password"
            class="input"
            placeholder="Подтвердите пароль"
            v-model="password_confirmation"
          />
          <BaseButton type="submit" variant="primary"> Зарегистрироваться </BaseButton>
          <div>Зарегистрировавшись, вы принимаете условия Политики конфиденциальности</div>

          <div class="errors" v-if="Object.keys(errors).length > 0">
            <div v-for="(errorMessages, fieldName) in errors" :key="fieldName">
              <div v-for="(message, index) in errorMessages" :key="index">
                {{ message }}
              </div>
            </div>
          </div>

          <div>
            Есть аккаунт?
            <router-link :to="{ name: 'user.login' }" class="form-user__inputs__link"
            >Войти</router-link
            >
          </div>
        </form>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseButton from '@/components/form/BaseButton.vue'
import BaseInput from '@/components/form/InputComponent.vue'
import { authRequest, publicRequest } from '@/api/api.js'
import BaseLayout from '@/layouts/BaseLayout.vue'

export default {
  name: 'RegComp',
  components: {
    BaseLayout,
    BaseButton,
    BaseInput,
  },

  data() {
    return {
      name: null,
      email: null,
      password: null,
      password_confirmation: null,
      message: null,
      errors: {},
      loading: false,
    }
  },
  methods: {
    async signUp() {
      this.loading = true
      this.errors = {}

      try {
        const response = await publicRequest({
          method: 'post',
          url: '/api/register',
          data: {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
          },
        })

        localStorage.setItem('auth_token', `${response.token_type} ${response.access_token}`)
        localStorage.setItem('user', JSON.stringify(response.user))

        try {
          await authRequest({
            method: 'post',
            url: '/api/registerUserProgress',
          })
        } catch (progressError) {
          console.error('Error registering user progress:', progressError)
        }

        this.$router.push({ name: 'home' })
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors
        } else {
          this.message = 'Произошла ошибка при регистрации'
          console.error('Registration error:', error)
        }
      } finally {
        this.loading = false
      }
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
