<template>
  <header>
    <div class="container">
      <div class="header">
        <router-link :to="{ name: 'main' }" class="header-logo">
          <img src="@/assets/logo_icon.png" alt="logo" />
          <h1 class="header-logo__title">PC LEARN</h1>
        </router-link>
        <nav class="header-nav">
          <div class="header-nav__links">
            <router-link @click="showMenu" class="header-nav__links__link" to="../"
              >Главная</router-link
            >

            <router-link
              v-if="!token"
              @click="showMenu"
              class="header-nav__links__user"
              :to="{name: 'user.login'}"
              >Зарегистрироваться</router-link
            >
            <router-link
              v-if="!token"
              @click="showMenu"
              class="header-nav__links__user"
              :to="{name: 'user.login'}"
              >Войти</router-link
            >

            <router-link v-if="token" @click="showMenu" class="header-nav__links__link" :to="{name: 'game'}"
            >Обучение</router-link
            >

            <router-link v-if="token" @click="showMenu" class="header-nav__links__user" to="/home"
              >Личный кабинет</router-link
            >
            <a v-if="token" @click.prevent="logout" class="header-nav__links__user" href="#"
              >Выйти</a
            >
          </div>
          <div class="header-nav__burger" @click="showMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { authRequest } from '@/api/api.js'

export default {
  data() {
    return {
      token: localStorage.getItem("auth_token"),
    }
  },
  methods: {
    showMenu() {
      let menuActive = document.querySelector('.header-nav__links')
      menuActive.classList.toggle('header-nav__links__active')
      let wrapperActive = document.querySelector('.wrapper')
      wrapperActive.classList.toggle('wrapper-overflow__hidden')
    },
    logout() {
      authRequest({
        method: 'post',
        url: '/api/logout',
        data: this.form
      })
      .then((res) => {
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')

        this.$router.push({ name: 'user.login' })
      })
    },
  },
  mounted() {

  },
  name: 'HeaderComp',
}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';

header {
  color: $text-white;

  padding: 20px 0;
  background-color: $main-color;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  height: 5vh;
  // обращение к логотипу
  &-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 11;
    // обращение к тексту логотипа
    &__title {
      font-size: 1.6em;
      font-weight: 500;
    }
  }
  // обращение к навигационному меню
  &-nav {
    display: flex;
    align-items: center;
    gap: 25px;
    &__links {
      display: flex;
      align-items: center;
      gap: 25px;
      &__link {
        transition: 0.2s;
        position: relative;
        &:after {
          content: '';
          display: block;

          position: absolute;
          width: 0%;
          height: 1px;
          left: 0%;
          top: 110%;
          background-color: $text-white;

          transition: 0.2s;
        }
        &:hover:after {
          width: 100%;
        }
      }
      &__user {
        padding: 10px 25px;

        border-radius: 25px;
        border: 1px solid $text-white;

        &:hover {
          background-color: $text-white;
          color: $text-color;
        }
      }
    }
    &__burger {
      // скрыт на главном экране
      display: none;
      width: 30px;
      height: 30px;
      position: relative;
      z-index: 11;
      overflow: hidden;

      //display: none;
      & span {
        z-index: 11;
        width: 30px;
        height: 2px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: $text-white;
        transition: all 0.5s;
      }
      & span:nth-of-type(2) {
        top: calc(50% - 10px);
      }
      & span:nth-of-type(3) {
        top: calc(50% + 10px);
      }
    }
  }
}

@media (max-width: 1366px) {
  .container {
    width: 960px;
  }
  .wrapper-overflow__hidden {
    overflow: hidden;
  }
  //header
  .header {
    &-nav {
      &__links {
        display: none;

        position: relative;
        left: 500%;
        transition: 0.2s;

        &__active {
          padding-top: 100px;
          display: flex;
          flex-direction: column;
          background-color: $main-color;

          position: fixed;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: 9;
        }
      }
      &__burger {
        display: block;
        position: relative;
        z-index: 11;
      }
    }
  }
}
@media (max-width: 960px) {
  .container {
    width: 720px;
  }
}
@media (max-width: 768px) {
  .container {
    width: 540px;
  }
}
@media (max-width: 480px) {
  .container {
    width: 320px;
  }
}
@media (max-width: 320px) {
  .container {
    width: 300px;
  }
}
</style>
