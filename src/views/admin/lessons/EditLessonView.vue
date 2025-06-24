<template>
  <ControlPanelView>
    <div class="lesson-add">
      <h2 class="lesson-add__title">Добавить занятие</h2>
      <form v-if="lesson" @submit.prevent="editWork" class="lesson-add__form">
        <div class="lesson-add__form__block">
          <BaseInput v-model="this.lesson.title" type="text" placeholder="Название" />
        </div>
        <div class="lesson-add__form__block">
          <QuillEditor
            theme="snow"
            v-model:content="lesson.theory"
            contentType="html"
            :options="editorOptions"
          />
        </div>
        <div class="lesson-add__form__block">
          <select v-model="this.lesson.type_lesson_id" name="type_lesson" class="input">
            <option value="1" class="input">Теория</option>
            <option value="2" class="input">Практика</option>
          </select>
        </div>
        <div class="lesson-add__form__block line">
          <input type="checkbox" class="input" v-model="this.lesson.hard_binding" id="hard_binding" />
          <label for="hard_binding">Жесткая привязка объектов</label>
        </div>
        <div class="lesson-add__form__block">
          <BaseButton type="submit" class="btn btn-primary"> Сохранить </BaseButton>
        </div>
        <div class="alert" v-if="this.lesson.error != null">
          {{ this.lesson.error }}
        </div>
      </form>
    </div>
  </ControlPanelView>
</template>

<script>
import { authRequest } from '@/api/api.js'

import BaseInput from '@/components/form/InputComponent.vue'
import ControlPanelView from '@/views/admin/ControlPanelView.vue'
import BaseButton from '@/components/form/BaseButton.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  name: 'editLesson',
  components: {
    BaseButton,
    ControlPanelView,
    BaseInput,
    QuillEditor
  },
  data() {
    return {
      lesson: {},
      url_title: this.$route.params.url_title,
      error: null,
      editorOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      }
    }
  },

  methods: {
    editWork() {
      if (this.lesson.theory != '' && this.lesson.theory != null) {
        authRequest({
          method: 'patch',
          url: `/api/lessons/${this.lesson.id}`,
          data: this.lesson,
        })
          .then((res) => {
            console.log(res)
            this.$router.push({ name: 'admin.lessons' })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.error = 'Заполните поле с информацией для задания'
      }
    },
    getLesson() {
      authRequest({
        method: 'get',
        url: `/api/lesson/${this.url_title}`,
      })
        .then((res) => {
          this.lesson = res.data
          this.lesson.hard_binding = Boolean(res.data.data.hard_binding)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  mounted() {
    this.getLesson()
  },
}
</script>

<style scoped lang="scss">
.tox-notifications-container {
  display: none;
}

.lesson-add {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__title {
    font-size: 1.2em;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 15px;

    &__block {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
}

.line {
  display: flex;
  align-items: center;
  flex-direction: row;
}

/* Стили для Quill Editor */
:deep(.ql-toolbar) {
  border-radius: 4px 4px 0 0;
  border: 1px solid #ccc;
}

:deep(.ql-container) {
  border-radius: 0 0 4px 4px;
  border: 1px solid #ccc;
  height: 300px;
}

:deep(.ql-editor) {
  min-height: 200px;
  font-size: 16px;
}
</style>
