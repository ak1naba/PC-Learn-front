<template>
  <BaseLayout>
    <div class="container">
      <div class="menu-content">
        <h2>Обучение</h2>
        <p>Обучение сборке ПК состоит из двух важных этапов: теоретического изучения и практической отработки навыков.</p>
        <p>Во время теоретического этапа важно уделить внимание изучению всех необходимых компонентов ПК и их взаимодействию друг с другом. Это включает в себя ознакомление с материнской платой, процессором, оперативной памятью, жестким диском, видеокартой, блоком питания и другими деталями. Также важно изучить различные типы разъемов, кабелей и методы подключения компонентов.</p>
        <p>После теоретического изучения, следующим шагом является практическая отработка навыков. Для этого можно
          использовать онлайн тренажер, который предоставляет возможность виртуально собирать компьютер. Такой
          тренажер позволит проводить отработку навыков без риска повредить реальные компоненты при обучении.
        </p>
        <p>Итак, теоретическое изучение и практическая отработка навыков на онлайн тренажере являются важными этапами
          в обучении сборке ПК. Такой подход позволит не только получить теоретические знания, но и практические
          навыки, необходимые для успешной сборки компьютера.</p>
      </div>
      <div class="actions">
        <div class="action" @click.prevent="$event=>getLessonRouter('theory')">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56 47.9999H16C15.2928 47.9999 14.6145 48.2809 14.1144 48.781C13.6143 49.2811 13.3333 49.9593 13.3333 50.6666C13.3333 51.3738 13.6143 52.0521 14.1144 52.5522C14.6145 53.0523 15.2928 53.3332 16 53.3332H56V58.6666H16C13.8783 58.6666 11.8434 57.8237 10.3431 56.3234C8.84286 54.8231 8 52.7883 8 50.6666V10.6666C8 9.2521 8.5619 7.89554 9.5621 6.89535C10.5623 5.89515 11.9188 5.33325 13.3333 5.33325H56V47.9999ZM13.3333 42.7999C13.7653 42.7119 14.2107 42.6666 14.6667 42.6666H50.6667V10.6666H13.3333V42.7999ZM42.6667 23.9999H21.3333V18.6666H42.6667V23.9999Z" fill="#151029"/>
          </svg>
          <p>Теория</p>
        </div>
        <div class="action" @click.prevent="$event=>getLessonRouter('practic')">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48.0002 4.87998C46.6668 4.87998 45.3335 5.33331 44.2402 6.42664L21.3335 29.3333L25.3335 33.3333L16.0002 42.6666H10.6668L5.3335 53.3333L10.6668 58.6666L21.3335 53.3333V48L30.6668 38.6666L34.6668 42.6666L57.5735 19.76C59.2268 17.3333 59.6535 14.32 57.5735 12.24L51.7602 6.42664C51.2694 5.92951 50.6836 5.53634 50.0376 5.27061C49.3916 5.00487 48.6986 4.87202 48.0002 4.87998ZM48.0002 10.6666L53.3335 16L34.6668 34.6666L29.3335 29.3333L48.0002 10.6666Z" fill="#151029"/>
          </svg>
          <p>Практика</p>
        </div>
      </div>
    </div>
  </BaseLayout>

</template>

<script>

import BaseLayout from '@/layouts/BaseLayout.vue'

export default {
    name: "menu",
  components: { BaseLayout },
    methods:{
        getLessonRouter(type){
            this.$router.push({name:'game.list',params:{type:type}})
        },
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/style/colors.scss";
// Menu Game
.menu-content{
  padding: 20px 0px;

  display: flex;
  flex-direction: column;
  gap: 15px;

  h2{
    font-size: 1.4em;
  }
}
.actions{
  padding: 20px 0px;

  display: flex;
  gap: 10%;

  .action{
    padding: 20px 0px;
    width: 45%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    border-radius: 15px;
    border: 3px solid $main-color;

    transition: 0.2s;

    cursor: pointer;

    p{
      font-weight: 600;
      font-size: 1.1em;
    }

    & svg path{
      transition: 0.2s;
    }
  }

}
// Game List
.game-list{
  padding: 20px 0px;

  display: flex;
  flex-direction: column;
  gap: 15px;

  h2{
    font-size: 1.4em;
  }
  .game-header{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .game-items{
    display: flex;
    flex-direction: column;
    gap: 15px;

    .game-item{
      display: flex;
      flex-direction: column;
      gap: 15px;

      .title{
        font-size: 1.4em;
        font-weight: 700;
      }
      .content {
        height: 1.2em; /* Установите желаемую высоту блока */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1; /* Количество отображаемых строк */
        -webkit-box-orient: vertical;
      }

      .actions-lesson{
        display: flex;
        align-items: center;
        gap: 15px;
      }
      .lesson-status{
        .done, .queue{
          padding: 5px;
          border-radius: 5px;

        }
        .done{
          background-color: #adf3b1;
        }
        .queue{
          background-color: #fff065;
        }
      }

    }
  }
}
.user-link{
  text-decoration: none;
  font-size: 18px;
  color: #3f70e8;
}
// Сложный эффект ховера
.action:hover{
  background-color: $main-color;
  color: $text-white;
}
.action:hover svg path{
  fill: $text-white;
}
.filter{
  display: flex;
  gap: 15px;
  width: 100%;
  &-params{
    display: flex;
    gap: 15px;
    input{
      width: 100%;
    }

  }

}

</style>
