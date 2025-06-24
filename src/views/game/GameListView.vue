<template>
    <BaseLayout>
      <div class="container">
        <div class="game-list">
          <div class="game-header">
            <h2 v-if="type=='theory'">Теоретические занятия</h2>
            <h2 v-if="type=='practic'">Практические занятия</h2>

            <router-link :to="{name:'game'}" class="user-link">Обучение</router-link>
          </div>

          <form class="filter">
            <div class="filter-params">
              <BaseInput type="text" v-model="searchText" @input="search()" placeholder="Введите название или содержимое урока" class="search input" />
            </div>
            <BaseButton @click.prevent="resetFilter" variant="primary">Сбросить</BaseButton>
          </form>
          <preloader v-if="isLoading"></preloader>
          <div class="game-items" v-if="this.searchText==''" >
            <div class="game-item" v-for="(lesson, index) in displayedLessons">
              <h3 class="title">
                {{lesson.lesson.title}}
              </h3>
              <div class="actions-lesson">
                <button class="btn btn-primary" @click.prevent="getLessonRouter(lesson.lesson)">Изучить</button>
                <div class="lesson-status">
                  <p v-if="lesson.status_id==1" class="queue">
                    Не выполнено
                  </p>
                  <p v-if="lesson.status_id==2" class="done">
                    Выполнено
                  </p>
                </div>

              </div>
            </div>
            <div v-if="this.searchText=='' " class="pagination">
              <button v-if="currentPage > 1" @click="currentPage--">Предыдущая</button>
              <span>{{currentPage}} / {{pageCount}}</span>
              <button v-if="currentPage < pageCount" @click="currentPage++">Следующая</button>
            </div>
          </div>
          <div class="game-items" v-if="this.searchText!=''" >
            <div class="game-item"  v-for="lesson in filteredLessons" :key="lesson.id">
              <h3 class="title">
                {{lesson.lesson.title}}
              </h3>
              <div class="actions-lesson">
                <button class="btn btn-primary" @click.prevent="getLessonRouter(lesson.lesson)">Изучить</button>
                <div class="lesson-status">
                  <p v-if="lesson.status_id==1" class="queue">
                    Не выполнено
                  </p>
                  <p v-if="lesson.status_id==2" class="done">
                    Выполнено
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </BaseLayout>
</template>

<script>

import preloader from '@/components/preloader/preloader.vue';
import BaseLayout from '@/layouts/BaseLayout.vue'
import { authRequest } from '@/api/api.js'
import BaseInput from '@/components/form/InputComponent.vue'
import BaseButton from '@/components/form/BaseButton.vue'

export default {
    name: "gameList",
    components:{
      BaseButton,
      BaseInput,
      BaseLayout,
        preloader,
    },

    data(){
        return{
            type: this.$route.params.type,
            lessons:[],
            searchText:'',
            currentPage: 1,
            perPage: 10,
            isLoading:true,
        }
    },
    methods:{
        get(){
          authRequest({
            method: 'post',
            url: '/api/game/progress',
            data: {type_lesson: this.type}
          })
         .then(res=>{
               this.lessons=res.data;
               this.isLoading=false;
            }).catch((err)=>{
                console.log(err)
            })
        },
        getLessonRouter(lesson) {
            if (lesson.type_lesson_id === 1) {
                this.$router.push({
                    name: 'game.theory',
                    params: {
                        url_title: lesson.title,
                    },
                });
            } else if (lesson.type_lesson_id === 2) {
                this.$router.push({
                    name: 'game.practic',
                    params: {
                        url_title: lesson.title,
                        next_lesson: 'значение дополнительного параметра',
                    },
                });
            }
        },
        search() {

        },
        resetFilter(){
            this.searchText='';
        }
    },
    computed:{
        displayedLessons() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.lessons.slice(start, end);
        },
        pageCount() {
            return Math.ceil(this.lessons.length / this.perPage);
        },
        filteredLessons() {
            return this.lessons.filter((lesson) => {
                const searchTerms = this.searchText.toLowerCase().trim().split(" ");
                return searchTerms.every((term) => {
                    return (
                        lesson.lesson &&
                        lesson.lesson.title &&
                        lesson.lesson.theory &&
                        lesson.lesson.title.toLowerCase().includes(term) ||
                        lesson.lesson.theory.toLowerCase().includes(term)
                    );
                });
            });
        },
    },
    mounted() {
        this.get()
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
