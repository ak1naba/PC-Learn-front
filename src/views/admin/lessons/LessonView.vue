<template>
  <BaseLayout>
    <div class="container">
      <div v-if="!isLoading" class="lesson-block">
        <div class="btn-group">
          <BaseButton variant="danger" @click=" this.isModalActive = !this.isModalActive">Удалить</BaseButton>
          <BaseButton variant="primary" @click="getLessonEdit()"
            >Редактировать
          </BaseButton>
        </div>
        <div v-if="isModalActive" class="modal-window">
          <h3>Вы действительно хотите удалить задание?</h3>
          <div class="btn-group">
            <BaseButton @click="deleteLesson" variant="danger">Удалить</BaseButton>
            <BaseButton variant="primary ">Отмена</BaseButton>
          </div>
        </div>
        <h2 class="lesson-block__title">
          {{ lesson.title }}
          <span class="lesson-block__title__sub">
            {{ lesson.url_title }}
          </span>
        </h2>
        <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id == 1">Теория</p>
        <p class="lessons-panel__lessons__item__type" v-if="lesson.type_lesson_id == 2">Практика</p>
        <p class="lesson-block__text" v-html="lesson.theory"></p>
        <div class="media-block">
          <h3 class="media-block__title">Добавление медиаматериалов</h3>
          <div class="media-block__theory" v-if="lesson.type_lesson_id == 1">
            <form
              method="post"
              @submit.prevent="addMedia"
              class="media-block__form"
              enctype="multipart/form-data"
            >
              <div class="form-block">
                <input id="file" name="material" type="file" class="input" />
              </div>
              <div class="form-block">
                <BaseButton type="submit" variant="primary">Добавить</BaseButton>
              </div>
            </form>
            <div class="lesson-panel__img__container">
              <div
                v-for="material in lesson.materials"
                :key="material.id"
                class="material-container"
                @mouseover="addHoverClassImg($event)"
                @mouseout="addHoverClassImg($event)"
              >
                <img class="img-material" :src="material.part_img" />
                <BaseButton variant="primary" @click="deleteMaterial(material.id)"
                  >Удалить</BaseButton
                >
              </div>
            </div>
          </div>
          <div class="media-block__practic" v-if="lesson.type_lesson_id == 2">
            <div v-if="lesson.materials.length === 0">
              <form
                method="post"
                @submit.prevent="addMediaRelative"
                class="media-block__form"
                enctype="multipart/form-data"
              >
                <h4>Выбор родительского элемента</h4>
                <div class="form-block">
                  <input id="fileRelative" name="materialRelative" type="file" class="input" />
                </div>
                <div class="form-block">
                  <BaseButton type="submit" variant="primary">Добавить</BaseButton>
                </div>
              </form>
            </div>
            <div v-else-if="!lesson.materials.some((material) => material.relative_element == 1)">
              <Form
                method="post"
                @submit="addMediaRelative"
                class="media-block__form"
                enctype="multipart/form-data"
              >
                <h4>Выбор родительского элемента</h4>
                <div class="form-block">
                  <input id="fileRelative" name="materialRelative" type="file" class="input" />
                </div>
                <div class="form-block">
                  <BaseButton type="submit" variant="primary">Добавить</BaseButton>
                </div>
              </Form>
            </div>
            <div
              v-if="
                lesson.materials.some((material) => material.relative_element) &&
                relative_element.state.length < 2
              "
            >
              <form
                method="post"
                @submit.prevent="addMediaStateRelative"
                class="media-block__form"
                enctype="multipart/form-data"
              >
                <h4>Выбор состояния родителя</h4>
                <div class="form-block">
                  <input
                    id="materialStateRelative"
                    name="materialStateRelative"
                    type="file"
                    class="input"
                  />
                </div>
                <div class="form-block">
                  <BaseButton type="submit" variant="primary">Добавить</BaseButton>
                </div>
              </form>
            </div>
            <div>
              <form
                method="post"
                @submit.prevent="addMediaDaughter"
                class="media-block__form"
                enctype="multipart/form-data"
              >
                <h4>Выбор дочернего элемента</h4>
                <div class="form-block">
                  <input id="fileDaughter" name="materialDaughter" type="file" class="input" />
                </div>
                <div class="form-block">
                  <BaseButton type="submit" variant="primary">Добавить</BaseButton>
                </div>
              </form>
            </div>
            <div class="practic">
              <div
                class="relative-container"
                v-for="material in relative_elements"
                :key="material.id"
                @contextmenu="addHoverClassImg($event)"
                @dragover.prevent
                @dragenter="dragEnter"
                @dragleave="dragLeave"
                @drop="dropElement"
              >
                <div class="practic-relative__img">
                  <img :src="material.part_img" class="img-material" />
                  <BaseButton variant="danger" class="btn-delete" @click="deleteMaterial(material.id)">
                    Удалить
                  </BaseButton>
                </div>
              </div>
              <div class="practic-daughter">
                <div
                  :data-id="material.id"
                  @dragstart="dragStart(material.id)"
                  v-for="material in daughter_elements"
                  :key="material.id"
                  class="practic-daughter__img"
                  draggable="true"
                  @contextmenu="addHoverClassImg($event)"
                >
                  <img :src="material.part_img" class="img-material" />
                  <div class="btn btn-danger btn-delete lower-delete">
                    <svg
                      class=" "
                      @click="deleteMaterial(material.id)"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 1L1 13M1 1L13 13"
                        stroke="#fff"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  :data-id="relative_element.id"
                  @dragstart="dragStart(relative_element.id)"
                  draggable="true"
                  class="switcher"
                  v-if="relative_element.id && relative_element.state.length != 0"
                ></div>
              </div>
            </div>
            <div class="states">
              <div v-for="state in relative_element.state" :key="state.id">
                <img :src="state.part_img" class="img-material" />
                <BaseButton variant="danger" @click="deleteState(state.id)">
                  Удалить
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else> Ждите... </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseButton from '@/components/form/BaseButton.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { authRequest } from '@/api/api.js'

export default {
  name: 'lesson',
  data() {
    return {
      // url - который является индикатором
      url_title: this.$route.params.url_title,
      // крутой массив, который содержит всю инфу по уроку
      lesson: {},
      // родительский элемент
      relative_element: {},
      // родительские элементы
      relative_elements: [],
      // дочерние элементы
      daughter_elements: [],
      // таскаемый элемент
      draggedElement: null,

      isModalActive: false,

      isLoading: true,
    }
  },
  // импорт компонентов
  components: {
    BaseLayout,
    BaseButton,
  },
  methods: {
    // Получеам данные от сервера по уроку и парсим их
    getLesson() {
      this.reset()
      authRequest({
        method: 'get',
        url: `/api/lesson/${this.url_title}`,
        data: this.form,
      })
        .then((res) => {
          this.lesson = res.data
          if (this.lesson.type_lesson_id == 2) {
            this.lesson.materials.forEach((item) => {
              if (item.relative_element == 1) {
                this.relative_elements.push(item)
                this.relative_element = item
              }
              if (item.relative_element == 0) {
                this.daughter_elements.push(item)
              }
            })
          }

        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    // Показать модальное коно удаления
    showModalWindow() {
      console.log('modal')
      this.isModalActive = !this.isModalActive
    },
    deleteLesson() {
      authRequest({
        method: 'delete',
        url: `/api/lessons/${this.lesson.id}`,
        data: this.form,
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      this.$router.push({ name: 'admin.lessons' })
    },
    getLessonEdit() {
      this.$router.push({ name: 'admin.lessons.edit', params: { url_title: this.url_title } })
    },

    addMedia() {
      var formData = new FormData()
      var imagefile = document.querySelector('#file')
      formData.append('image', imagefile.files[0])

      authRequest({
        method: 'post',
        url: `/api/lesson/${this.lesson.id}/materials/add`,
        data: formData,
        contentType: 'multipart/form-data',
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addMediaRelative() {
      var formData = new FormData()
      var imagefile = document.querySelector('#fileRelative')
      formData.append('image', imagefile.files[0])

      authRequest({
        method: 'post',
        url: `/api/lesson/${this.lesson.id}/materials/add/relative`,
        data: formData,
        contentType: 'multipart/form-data',
      })
        .then((res) => {
          this.getLesson()
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addMediaStateRelative() {
      var formData = new FormData()
      var imagefile = document.querySelector('#materialStateRelative')
      formData.append('image', imagefile.files[0])

      authRequest({
        method: 'post',
        url: `/api/states/add/${this.relative_element.id}`,
        data: formData,
        contentType: 'multipart/form-data',
      })
        .then((res) => {
          this.getLesson()
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      //location.reload();
    },
    addMediaDaughter() {
      var formData = new FormData()
      var imagefile = document.querySelector('#fileDaughter')
      formData.append('image', imagefile.files[0])

      authRequest({
        method: 'post',
        url: `/api/lesson/${this.lesson.id}/materials/add/daughter`,
        data: formData,
        contentType: 'multipart/form-data',
      })
        .then((res) => {
          this.getLesson()
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteMaterial(materialId) {
      authRequest({
        method: 'delete',
        url: `/api/materials/${materialId}/`,
      })
        .then((response) => {
          this.getLesson()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deleteState(stateId) {
      authRequest({
        method: 'delete',
        url: `/api/states/delete/${stateId}/`,
      })
        .then((response) => {
          this.getLesson()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addHoverClassImg(event) {
      event.preventDefault()
      const materialContainer = event.currentTarget
      materialContainer.querySelector('.img-material').classList.toggle('low-brightness')
      materialContainer.querySelector('.btn-delete').classList.toggle('active-btn')
    },

    dragStart(id) {
      this.draggedElement = id
    },
    dragEnter(event) {
      event.target.classList.add('over')
    },
    dragLeave(event) {
      event.target.classList.remove('over')
    },
    dropElement(event) {
      event.preventDefault()
      event.target.classList.remove('over')

      const draggedElement = this.draggedElement
      const droppedElement = document.querySelector(`[data-id="${draggedElement}"]`)

      const parentElement = event.currentTarget
      const parentRect = parentElement.getBoundingClientRect()

      if (droppedElement) {
        const droppedRect = droppedElement.getBoundingClientRect()

        console.log(droppedRect.height + ' ' + droppedRect.width)

        const top =
          ((event.clientY - parentRect.top - droppedRect.height / 2) / parentRect.height) * 100
        const left =
          ((event.clientX - parentRect.left - droppedRect.width / 2) / parentRect.width) * 100

        droppedElement.style.position = 'absolute'
        droppedElement.style.zIndex = '10'
        droppedElement.style.top = `${top}%`
        droppedElement.style.left = `${left}%`

        parentElement.appendChild(droppedElement)

        axios
          .patch('/api/materials/' + this.draggedElement + '/update', {
            position_x: left,
            position_y: top,
          })
          .then((response) => {
            console.log(response)
          })
      }
    },
    getImagePath(path) {
      return `http://localhost:8000/storage/${path}`
    },
    reset(){
      this.lesson = {}
      this.relative_element = {}
      this.relative_elements = []
      this.daughter_elements = []
      this.draggedElement = null

      console.log('reset')
      console.log(this.lesson,
      this.relative_element,
      this.relative_elements,
      this.daughter_elements,
      this.draggedElement,)
    }
  },
  mounted() {
    this.getLesson()
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';

.btn-group {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.lesson-block {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__title {
    font-size: 1.4em;

    &__sub {
      font-size: 0.7em;
    }
  }

  .lesson-panel {
    &__img__container {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .material-container {
        position: relative;

        .img-material {
          width: 100%;
          border-radius: 10px;
          transition: 0.2s;
        }

        .btn-delete {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: none;
        }
      }
    }
  }
}

.modal-window {
  display: flex;

  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -90%);
  z-index: 10;

  border-radius: 10px;
  padding: 140px 200px;
  background-color: $text-white;

  -webkit-box-shadow: 0px 4px 36px 52px rgba(34, 60, 80, 0.15);
  -moz-box-shadow: 0px 4px 36px 52px rgba(34, 60, 80, 0.15);
  box-shadow: 0px 4px 36px 52px rgba(34, 60, 80, 0.15);

  flex-direction: column;
  align-items: center;
  gap: 25px;

  h3 {
    font-size: 1.4em;
    font-weight: 700;
    text-align: center;
  }
}

.modal-window__active {
  display: flex;
}

.media-block {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__title {
    font-size: 1.4em;
  }

  &__theory,
  &__practic {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}

.practic {
  display: flex;

  gap: 15px;
}

.relative-container {
  position: relative;
}

.practic-relative__img {
  position: relative;

  .btn-delete {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.practic-daughter {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.practic-daughter__img {
  position: relative;
  transition: 0.2s;

  .btn-delete {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.lower-delete {
  &:hover {
    svg path {
      stroke: $text-invalid;
    }
  }
}

.low-brightness {
  filter: brightness(0.4);
}

.active-btn {
  display: block !important;
}

.states {
  display: flex;
  align-items: center;

  div {
    width: auto;
    width: auto;

    img {
      width: 65%;
    }
  }
}

.switcher {
  width: 5vw;
  height: 5vh;
  background-color: #4a5568;
}
</style>
