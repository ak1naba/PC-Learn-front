<template>
  <footer>
    <div class="container">
      <div class="footer">
        <div class="footer-logo">
          <div class="footer-logo__composition">
            <img src="@/assets/logo_icon.png" alt="" class="logo_img" />
            <h2 class="logo__text">PC LEARN</h2>
          </div>
          <div class="footer-copy">© Copyright</div>
        </div>
        <nav class="footer-nav">
          <div class="footer-nav__column">
            <h3 class="footer-nav__column__title">Сообществу</h3>
            <router-link :to="{name: 'commercial.about'}" class="footer-nav__column__link"> О площадке </router-link>
            <router-link :to="{name: 'commercial.contacts'}" class="footer-nav__column__link"> Контакты </router-link>
            <router-link :to="{name: 'commercial.license'}" class="footer-nav__column__link"> Политика конфиденциальности </router-link>
          </div>
          <div class="footer-nav__column">
            <h3 class="footer-nav__column__title">Помощь</h3>
            <router-link :to="{name: 'commercial.contacts'}" class="footer-nav__column__link"> Проблемы с аккаунтом </router-link>
            <router-link :to="{name: 'commercial.contacts'}" class="footer-nav__column__link"> Сообщить об ошибке </router-link>
          </div>
          <div class="footer-nav__column">
            <h3 class="footer-nav__column__title">Социальные сети</h3>
            <a href="" class="footer-nav__column__link"> Вконтакте </a>
            <a href="" class="footer-nav__column__link"> Телеграм </a>
          </div>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script>
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';

footer {
  background-color: $main-color;
  color: $text-white;
  padding: 25px 0 50px 0;
  .footer {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 50px;
    &-logo {
      display: flex;
      flex-direction: column;
      gap: 15px;
      font-weight: 500;
      &__text {
        font-size: 1.2em;
      }
      &__composition {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }
    &-nav {
      display: flex;
      gap: 50px;
      &__column {
        display: flex;
        flex-direction: column;
        gap: 15px;
        &__title {
          font-size: 1.2em;
        }
        &__link {
          max-width: 140px;
          transition: 0.2s;
          &:hover {
            color: $text-hover;
          }
        }
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
  footer {
    .footer {
      flex-direction: column;
      &-nav {
        flex-direction: column;
      }
    }
  }
}
@media (max-width: 320px) {
  .container {
    width: 300px;
  }
}
</style>
