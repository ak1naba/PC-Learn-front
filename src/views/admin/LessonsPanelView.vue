<template>
  <ControlPanelView>
    <div class="lessons-panel">
      <h3 class="lessons-panel__title">
        Задания
      </h3>
      <div class="lessons-panel__lessons">
        <div class="lessons-panel__lessons__items">
          <router-link :to="{name:'admin.lessons.add'}" class="btn-primary btn">Добавить</router-link>

          <div class="filter">
            <div class="filter-params">
              <input type="text" v-model="searchText" @input="search()" placeholder="Введите название или содержимое урока" class="search input">
              <select v-model="selectedType" @change="search()" class="type input">
                <option value="">Все</option>
                <option value="1">Теория</option>
                <option value="2">Практика</option>
              </select>
            </div>
            <button @click.prevent="resetFilter" class="btn btn-primary">Сбросить</button>
          </div>


          <div class="lessons-panel__lessons__item  legend">
            <h4 class="lessons-panel__lessons__item__title"><strong>Задание</strong></h4>
            <p class="lessons-panel__lessons__item__text media-hidden"><strong>Текст</strong></p>
            <p class="lessons-panel__lessons__item__type media-hidden"><strong>Тип</strong></p>
          </div>

          <div v-if="this.searchText!='' || this.selectedType!=''" class="lessons-panel__lessons__item"  v-for="lesson in filteredLessons" :key="lesson.id">
            <h4 class="lessons-panel__lessons__item__title">
              {{lesson.title}}
            </h4>
            <p class="lessons-panel__lessons__item__text" v-html="lesson.theory"></p>

            <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==1">Теория</p>
            <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==2">Практика</p>

            <a @click.prevent="$event=>getLessonRouter(lesson.url_title)" class="btn-primary btn">Подробнее</a>
          </div>

          <div v-if="this.searchText=='' && this.selectedType==''" class="lessons-panel__lessons__item"  v-for="(lesson, index) in displayedLessons" :key="index">
            <h4 class="lessons-panel__lessons__item__title">
              {{lesson.title}}
            </h4>
            <p class="lessons-panel__lessons__item__text" v-html="lesson.theory"></p>

            <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==1">Теория</p>
            <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id==2">Практика</p>

            <button @click.prevent="$event=>getLessonRouter(lesson.url_title)" class="btn-primary btn">Подробнее</button>
          </div>
          <div v-if="this.searchText=='' && this.selectedType==''" class="pagination">
            <button v-if="currentPage > 1" @click="currentPage--">Предыдущая</button>
            <span>{{currentPage}} / {{pageCount}}</span>
            <button v-if="currentPage < pageCount" @click="currentPage++">Следующая</button>
          </div>


        </div>
      </div>
    </div>
  </ControlPanelView>
</template>

<script>

import axios from "axios";
import ControlPanelView from '@/views/admin/ControlPanelView.vue'
export default {
    name: "LessonsPanelView",
  components: { ControlPanelView },
    data(){
        return{
            data:[],
            searchText:'',
            selectedType:'',
            currentPage: 1,
            perPage: 10,
        }
    },
    methods:{
        getLessons(){
            axios.get('/api/lessons')
                .then(res=>{
                        this.data=res.data.data;
                    }
                )
                .catch(err=>{
                    console.log(err);
                })
        },

        getLessonRouter(url_title){
            this.$router.push({name:'admin.lessons.lesson',params:{url_title:url_title}})
        },
        search() {
            // debounce logic can be added here to avoid firing search too frequently
            // and to improve performance
        },
        resetFilter(){
            this.selectedType='';
            this.searchText='';
        }


    },
    computed: {
        displayedLessons() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.data.slice(start, end);
        },
        pageCount() {
            return Math.ceil(this.data.length / this.perPage);
        },
        filteredLessons() {
            return this.data.filter((lesson) => {
                const searchTerms = this.searchText.toLowerCase().trim().split(" ");
                return searchTerms.every((term) => {
                    return (
                        lesson.title.toLowerCase().includes(term) ||
                        lesson.theory.toLowerCase().includes(term)
                    );
                }) && (this.selectedType === "" || lesson.type_lesson_id === parseInt(this.selectedType));
            });
        },

    },
    mounted(){
        this.getLessons();
    }
}
</script>
<style scoped lang="scss">
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    background: #ccc;
    border: none;
    padding: 10px;
    margin: 0 5px;
    cursor: pointer;
}

.pagination span {
    display: inline-block;
    padding: 10px;
}

.lessons-panel{
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  &__title{
    font-size: 1.4em;
  }

  &__lessons__items{
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 25px;


    .lessons-panel__lessons__item{
      display: flex;
      align-items: center;
      gap: 15px;

      &__title{
        min-width: 70px;
        max-width: 70px;

        /* Эти опции - необходимые условия */
        overflow: hidden;
        white-space: nowrap;

        /* Добавляем троеточия в конце предложения, если текст
        не помещается в блок */
        text-overflow: ellipsis;
      }
      &__type{
        min-width: 70px;
      }

      &__text{
        min-width: 450px;
        max-width: 450px;

        /* Эти опции - необходимые условия */
        overflow: hidden;
        white-space: nowrap;

        /* Добавляем троеточия в конце предложения, если текст
        не помещается в блок */
        text-overflow: ellipsis;
      }
    }
  }
}
.filter{
  display: flex;
  gap: 15px;
  width: 100%;
  &-params{
    width: 75%;
    display: flex;
    gap: 15px;
    .search{
      width: 75%;
    }
    .type{
      width: 25%;
    }
  }
  .reset{

  }
}

</style>
