<template>
  <ControlPanelView>
    <div class="lesson-add">
      <h2 class="lesson-add__title">Добавить занятие</h2>
      <form @submit.prevent="addWork" class="lesson-add__form">
        <div class="lesson-add__form__block">
          <BaseInput v-model="this.work.title" type="text" placeholder="Название" />
        </div>
        <div class="lesson-add__form__block">
          <QuillEditor
            theme="snow"
            v-model:content="work.theory"
            contentType="html"
            :options="editorOptions"
          />
        </div>
        <div class="lesson-add__form__block">
          <select v-model="this.work.type_lesson_id" name="type_lesson" class="input">
            <option value="1" class="input">Теория</option>
            <option value="2" class="input">Практика</option>
          </select>
        </div>
        <div class="lesson-add__form__block line">
          <input type="checkbox" class="input" v-model="this.work.hard_binding" id="hard_binding" />
          <label for="hard_binding">Жесткая привязка объектов</label>
        </div>
        <div class="lesson-add__form__block">
          <BaseButton type="submit" class="btn btn-primary"> Добавить </BaseButton>
        </div>
        <div class="alert" v-if="this.work.error != null">
          {{ this.work.error }}
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
  name: 'AddLessonView',
  components: {
    BaseButton,
    ControlPanelView,
    BaseInput,
    QuillEditor
  },
  data() {
    return {
      work: {
        title: null,
        theory: null,
        type_lesson_id: null,
        hard_binding: false,

        error: null,
      },
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
  computed: {},
  methods: {
    addWork() {
      if (this.work.theory != '' && this.work.theory != null) {
        authRequest({
          method: 'post',
          url: '/api/lessons/add',
          data: this.work,
        })
          .then((res) => {
            console.log(res)
            this.$router.push({ name: 'admin.lessons' })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.work.error = 'Заполните поле с информацией для задания'
      }
    },
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
