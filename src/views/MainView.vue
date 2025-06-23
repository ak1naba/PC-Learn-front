<template>
  <BaseLayout>
    <div class="intro">
      <img src="@/assets/main/banner_background.jpg" alt="intro_img" class="intro-banner" />
      <div class="intro-text">
        <h2 class="intro-text__title">Научись сам собирать ПК</h2>
        <a href="" class="intro-text__btn"> Научиться </a>
      </div>
      <a href="#importance" class="intro-text__link">
        Подробнее
        <img src="@/assets/main/next_icon.png" alt="" />
      </a>
    </div>
    <div class="importance" id="importance">
      <img src="@/assets/main/importance_background.jpg" alt="" class="importance-banner" />
      <div class="importance-text">
        <h2 class="importance-text__title">Важность самостоятельной сборки ПК</h2>
        <div class="importance-text__text">
          Умение собирать ПК самостоятельно может принести множество преимуществ. Во-первых, это
          может помочь сэкономить деньги, поскольку собранный самостоятельно ПК может быть дешевле,
          чем купленный готовый. Во-вторых, собирая ПК самостоятельно, можно его точно под свои
          нужды и предпочтения. В-третьих, это может быть интересным и познавательным занятием, а
          также расширить кругозор и знания в области компьютерной техники.
        </div>
      </div>
    </div>
    <div class="advantages">
      <img src="@/assets/main/advantages_background.jpg" alt="" class="advantages-banner" />
      <div class="advantages-text">
        <h2 class="advantages-text__title">Преимущества самостоятельной сборки ПК</h2>
        <div class="advantages-text__advantages">
          <div class="advantage">
            <img src="@/assets/main/icons8-денежное-дерево-96.png" alt="" class="advantage-img" />
            <p class="advantage-text">Дешевле, чем готовый такой же</p>
          </div>
          <div class="advantage">
            <img src="@/assets/main/icons8-привод-96.png" alt="" class="advantage-img" />
            <p class="advantage-text">Полная кастомизация</p>
          </div>
          <div class="advantage">
            <img src="@/assets/main/icons8-свобода-96.png" alt="" class="advantage-img" />
            <p class="advantage-text">Сборка под конкретные задачи</p>
          </div>
          <div class="advantage">
            <img src="@/assets/main/icons8-честность-96.png" alt="" class="advantage-img" />
            <p class="advantage-text">Полная осведомленность</p>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'

export default {
  name: 'MainComp',
  components: {
    BaseLayout,
  },
  mounted() {},
}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';

header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 10;
}
main {
  .intro {
    color: $text-white;
    width: 100%;
    height: 91vh;
    position: relative;
    &-banner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;

      filter: brightness(35%);
    }
    &-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 25px;
      &__title {
        text-align: center;
        font-size: 2.5em;
      }
      &__btn {
        font-size: 1.8em;
        padding: 10px 15px;
        border-radius: 25px;
        border: 1px solid $text-white;

        transition: 0.2s;

        position: relative;
        overflow: hidden;

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: -15px;
          width: 0;
          height: 100%;
          background-color: $text-white;
          transform: skew(25deg);
          transition: 0.3s;
          z-index: -1;
        }
        &:hover {
          color: $main-color;
        }
        &:hover:before {
          width: 150%;
        }
      }
      &__link {
        position: absolute;
        bottom: 0%;
        left: 50%;
        transform: translate(-50%, -100%);
      }
    }
  }
  .importance {
    height: 50vh;
    position: relative;
    &-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;

      filter: brightness(35%);
    }
    &-text {
      color: $text-white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 35px;
      text-align: center;
      &__title {
        font-size: 1.8em;
      }
      &__text {
      }
    }
  }
  .advantages {
    height: 50vh;
    position: relative;
    color: $text-white;
    &-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;

      filter: brightness(35%);
    }
    &-text {
      color: $text-white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 35px;
      text-align: center;
      &__title {
        font-size: 1.8em;
      }
      &__advantages {
        display: flex;
        gap: 45px;
        .advantage {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
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
  //main
  main {
    .intro {
      &-text {
        &__title {
          font-size: 1.6em;
        }
        &__btn {
          font-size: 1.2em;
        }
      }
    }
    .advantages {
      &-text {
        &__advantages {
          //flex-wrap: wrap;
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .container {
    width: 540px;
  }
  //main
  main {
    .intro {
      &-text {
        &__title {
          font-size: 1.4em;
        }
        &__btn {
          font-size: 1.2em;
        }
      }
    }
    .importance {
      height: 100vh;
    }
    .advantages {
      height: 100vh;
      &-text {
        &__advantages {
          //flex-direction: column;
          .advantage-img {
            width: 64px;
          }
        }
      }
    }
  }
}
@media (max-width: 480px) {
  .container {
    width: 320px;
  }
  main {
    .intro {
      &-text {
        &__title {
          font-size: 1.4em;
        }
        &__btn {
          font-size: 1.2em;
        }
      }
    }
    .importance {
      height: 100vh;
    }
    .advantages {
      height: 100vh;
      &-text {
        &__advantages {
          flex-direction: column;
        }
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
