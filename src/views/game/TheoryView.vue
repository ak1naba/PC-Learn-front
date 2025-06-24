<template>
  <BaseLayout>
    <div class="container">
      <div class="lesson-block">
        <preloader v-if="isLoading"></preloader>
        <h2 class="lesson-block__title">
          {{ lesson.title }}
        </h2>
        <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id == 1">Теория</p>
        <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id == 2">Практика</p>
        <p class="lesson-block__text" v-html="lesson.theory"></p>
        <div class="image-block">
          <img v-for="image in lesson.materials" :key="image.id" :src="image.part_img" alt="" />
        </div>
        <div class="actions">
          <BaseButton variant="primary" @click.prevent="getLessonRouter()">
            Следующий
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseLayout>

</template>

<script>
import preloader from '@/components/preloader/preloader.vue'
import { authRequest } from '@/api/api.js'
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseButton from '@/components/form/BaseButton.vue'

export default {
  name: 'theory',
  components: {
    BaseButton,
    BaseLayout,
    preloader,
  },

  data() {
    return {
      url_title: this.$route.params.url_title,
      lesson: {},
      next_progress: {},
      isLoading: true,
      currentLesson: null,
      finish: false,
    }
  },
  methods: {
    getLesson() {
      authRequest({
        method: 'get',
        url: `/api/lesson/${this.url_title}`,
      })
        .then((res) => {
          this.lesson = res.data
          this.isLoading = false
          this.currentLesson = this.lesson.id

          this.getNextLesson()
          this.doneLesson()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getNextLesson() {
      authRequest({
        method: 'post',
        url: `/api/progress/find-next`,
        data: {
          lesson_id: this.currentLesson,
          type_lesson_id: this.lesson.type_lesson_id,
        }
      })
        .then((res) => {
          this.next_progress = res.lesson
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.finish = true
          }
        })
    },
    doneLesson() {
      authRequest({
        method: 'post',
        url: `/api/progress/done-lesson`,
        data: {
          lesson_id: this.currentLesson,
        }
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getLessonRouter() {
      if (this.finish){
        this.$router.push({
          name: 'game.list',
          params: { type: 'theory' }
        });
      }

      this.$router.push({
        name: 'game.theory',
        params: {
          url_title: this.next_progress.title,
        },
      })
    },
  },

  mounted() {
    this.getLesson()
    this.$watch('$route.params.url_title', (newValue, oldValue) => {
      this.url_title = newValue
      this.getLesson()
    })
  },
}
</script>

<style scoped lang="scss">
.lesson-block{
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__title{
    font-size: 1.4em;
  }

  .image-block{
    display: flex;
    flex-direction: column;
    gap: 10px;
    img{
      width: 100%;
    }
  }
}

.practic-container{
  display: flex;
  align-items: flex-start;
  gap: 25px;
}
.relative{
  position: relative;

  .switcher{
    position: absolute;
    width: 3vw;
    height: 3vw;
    background-color: #4a5568;
    z-index: 2;
  }
  .place{
    position: absolute;
    width: 5%;
    height: 5%;
    background-color: #3f70e8;
    z-index: 5;
  }


}
.daughters{
  padding: 15px 0px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .daughter{
    width: 100%;
  }
}


</style>
