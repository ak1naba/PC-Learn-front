<template>
  <BaseLayout>
    <div class="container">
      <h2 class="page-title">Личный кабинет</h2>
      <div class="user-block">
        <div class="user-block__avatar">
          <img :src="getImagePath(user.avatar)" alt="" class="user__avatar" />
          <div class="edit__avatar" @click="showFormAvatar">
            <img src="@/assets/icons/edit.png" alt="edit_icon" class="edit__avatar__icon" />
          </div>
        </div>
        <div class="user-block__info">
          <div class="user-block__info__name">{{ user.name }}</div>
          <div class="user-block__info__email">{{ user.email }}</div>
        </div>
      </div>

      <dialog class="user-avatar">
        <div class="user-avatar__header">
          <h3 class="user-avatar__header__title">Сменить аватар</h3>
          <p class="user-avatar__header__close" @click="closeFormAvatar">
            <img src="@/assets/icons/delete.svg" alt="close" />
          </p>
        </div>

        <form @submit.prevent="changeAvatar" class="user-avatar__form form-user__inputs" enctype="multipart/form-data">
          <div class="form-block">
            <BaseInput id="file" type="file" class="input" name="avatar" />
          </div>
          <BaseButton type="submit" variant="primary">Сменить</BaseButton>
        </form>
      </dialog>

      <div class="user-progress">
        <h3 class="user-progress__title">Прогресс</h3>
        <div class="user-progress__info">
          <div class="user-progress__info__all">Теория</div>
          <div class="user-progress__info__all">Практика</div>
        </div>
      </div>
      <div class="user-action">
        <h3 class="user-action__title">Сменить пароль</h3>
        <form action="" class="user-action__form">
          <div class="form__part">
            <BaseInput v-model="form.old_password" type="password" placeholder="Старый пароль" />
          </div>
          <div class="form__part">
            <BaseInput v-model="form.new_password" type="password" placeholder="Новый пароль" />
          </div>
          <div class="form__part">
            <BaseInput
              v-model="form.new_password_confirmation"
              type="password"
              placeholder="Подтвердите пароль"
            />
          </div>
          <BaseButton @click.prevent="changePassword" variant="primary" >Сменить</BaseButton>
        </form>
        <div class="success">
          {{ form.message_suc }}
        </div>
        <div class="invalid">
          {{ form.message_fail }}
        </div>
      </div>
      <div class="user-admin" v-if="this.user.role == 1">
        <h3 class="user-admin__title">Вам доступно администрование сайта</h3>
        <router-link class="user-admin__link" :to="{ name: 'admin.lessons' }"
          >Панель управления</router-link
        >
      </div>
      <div class="user-account">
        <h3 class="user-admin__title">Удаление аккаунта</h3>
        <div class="form-block">
          <BaseButton variant="danger" @click="deleteAccount">Удалить аккаунт</BaseButton>
        </div>

        <dialog class="delete-account">
          <div class="header">
            <h2>Удаление аккаунта</h2>
            <p><img @click="closeDeleteAccount" src="@/assets/icons/delete.svg" alt="" /></p>
          </div>
          <h3>Вы действительно хотите удалить аккаунт?</h3>
          <div class="btn-group">
            <BaseButton @click="closeDeleteAccount" variant="primary">Отмена</BaseButton>
            <BaseButton @click="finalDeleteAccount" variant="danger">Удалить</BaseButton>
          </div>
        </dialog>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseInput from '@/components/form/InputComponent.vue'
import BaseButton from '@/components/form/BaseButton.vue'
import { authRequest } from '@/api/api.js'

export default {
  name: 'Home',
  components: {
    BaseButton,
    BaseInput,
    BaseLayout,
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      form: {
        old_password: null,
        new_password: null,
        new_password_confirmation: null,

        passwordsErrors: {},
      },
      avatar: {
        avatar_file: null,
        avatarErrors: {},
      },
    }
  },
  props: {
    required: true,
    type: Object,
  },
  computed: {},
  methods: {
    changePassword() {
      if (!this.form.old_password || !this.form.new_password || !this.form.new_password_confirmation) {
        this.form.message_fail = 'Все поля обязательны'
        return
      }

      if (this.form.new_password !== this.form.new_password_confirmation) {
        this.form.message_fail = 'Пароли не совпадают'
        return
      }

      authRequest({
        method: 'post',
        url: '/api/changePassword',
        data: this.form
      })
        .then(response => {
          console.log(response)
          if (response.data === 'success') {
            this.form.message_suc = 'Пароль изменен успешно'
            this.form.message_fail = null
            this.resetPasswordForm()
          } else {
            this.form.message_suc = null
            this.form.message_fail = 'Старый пароль неверный'
          }
        })
        .catch(error => {
          console.error('Password change error:', error)
          this.form.message_fail = error.response?.data?.message || 'Ошибка при изменении пароля'
        })
    },

    changeAvatar() {
      const formData = new FormData()
      const imagefile = document.querySelector('#file')
      formData.append('image', imagefile.files[0])

      authRequest({
        method: 'post',
        url: '/api/changeAvatar',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          this.getUserData()
          this.closeFormAvatar()
        })
        .catch(error => {
          console.error('Avatar change error:', error)
          this.avatar.message = error.response?.data?.message || 'Неверный тип файла'
        })
    },

    getUserData() {
      authRequest({
        method: 'post',
        url: '/api/userIdOut'
      })
        .then(response => {
          this.user = response
          localStorage.setItem('user', JSON.stringify(response))
        })
        .catch(error => {
          console.error('Get user data error:', error)
        })
    },

    deleteAccount() {
      this.toggleModal('.delete-account')
    },

    closeDeleteAccount() {
      this.toggleModal('.delete-account')
    },

    finalDeleteAccount() {
      authRequest({
        method: 'post',
        url: '/api/deleteUser',
        data: this.form
      })
        .then(() => {
          return publicRequest({
            method: 'post',
            url: '/logout'
          })
        })
        .then(() => {
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          this.$router.push({ name: 'user.login' })
        })
        .catch(error => {
          console.error('Account deletion error:', error)
        })
    },

    showFormAvatar() {
      this.toggleModal('.user-avatar')
    },

    closeFormAvatar() {
      this.toggleModal('.user-avatar')
    },

    getImagePath(path) {
      return `http://localhost:8000/storage/${path}`
    },

    toggleModal(selector) {
      const modal = document.querySelector(selector)
      modal.classList.toggle(selector.includes('delete') ? 'active-modal' : 'user-avatar__active')
      modal[modal.open ? 'close' : 'showModal']()
    },

    resetPasswordForm() {
      this.form.old_password = null
      this.form.new_password = null
      this.form.new_password_confirmation = null
    }
  },
  mounted() {
    this.getUserData()
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';

.page-title {
  margin-top: 25px;
  font-size: 1.8em;
  font-weight: 600;
}
.user-block {
  padding-top: 25px;
  display: flex;
  align-items: center;
  gap: 25px;

  margin-bottom: 50px;
  &__avatar {
    position: relative;

    padding-bottom: 15%;
    padding-right: 15%;

    border-radius: 50%;

    .user__avatar {
      position: absolute;

      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      z-index: 7;
    }
    .edit__avatar {
      position: absolute;

      left: 100%;
      top: 100%;
      transform: translate(-100%, -100%);

      background-color: #59606c;
      border-radius: 50%;
      padding: 5px;
      z-index: 8;

      &__icon {
        width: 24px;
        height: 24px;
      }

      &:hover {
        background-color: #4a5568;
        cursor: pointer;
      }
    }
  }
  &__info {
    display: flex;
    flex-direction: column;
    gap: 15px;

    &__name {
      font-size: 1.8em;
    }
    &__email {
      font-size: 1.2em;
    }
  }
}
.user-avatar {
  padding: 20px;
  border-radius: 10px;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  -webkit-box-shadow: 0px 0px 28px 15px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 28px 15px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 28px 15px rgba(34, 60, 80, 0.2);

  display: none;
  z-index: 10;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    margin-bottom: 25px;
    &__title {
      font-size: 1.4em;
      font-weight: 600;
    }
    &__close {
      cursor: pointer;
      display: flex;
      padding: 5px;
      align-items: center;
    }
  }

  &__form {
    display: flex;
    gap: 25px;
    .btn {
      height: 46px;
    }
  }
}
.user-avatar__active {
  display: block !important;
}
.user-progress {
  margin-bottom: 50px;
  &__title {
    margin-bottom: 25px;
    font-size: 1.4em;
    font-weight: 600;
  }
  &__info {
    display: flex;
    gap: 35px;

    &__all {
      font-size: 1.2em;
    }
  }
}
.user-action {
  margin-bottom: 25px;

  &__title {
    margin-bottom: 25px;
    font-size: 1.4em;
    font-weight: 600;
  }
  &__form {
    display: inline-flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 25px;
    .form__part {
      display: flex;
      flex-direction: column;
      gap: 5px;
      input {
        width: 100%;
      }
    }
  }
  .success {
    color: $text-allow;
  }
  .invalid {
    color: $text-invalid;
  }
}
.user-admin {
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  &__title {
    margin-bottom: 25px;
    font-size: 1.4em;
    font-weight: 600;
  }
  &__link {
    font-size: 18px;
    color: $text-link;
  }
}

.user-account {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 50px;
  .btn-danger {
    width: auto;
  }
}
.delete-account {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  padding: 15px;

  display: none;
  flex-direction: column;
  align-items: center;
  gap: 25px;

  -webkit-box-shadow: 0px 0px 28px 15px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 28px 15px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 28px 15px rgba(34, 60, 80, 0.2);

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      font-weight: 600;
      font-size: 1.4em;
    }
    p {
      display: flex;
      align-items: center;
      padding: 5px;
      cursor: pointer;
    }
  }
}
.active-modal {
  display: flex !important;
}

@media (max-width: 1366px) {
  user-block {
    padding-top: 25px;

    display: flex;
    align-items: center;
    gap: 25px;

    margin-bottom: 50px;
    &__avatar {
      position: relative;

      padding-bottom: 10%;
      padding-right: 10%;

      border-radius: 50%;

      .user__avatar {
        position: absolute;

        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        object-fit: cover;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 15px;

      &__name {
        font-size: 1.4em;
      }
      &__email {
        font-size: 1em;
      }
    }
  }
}
@media (max-width: 960px) {
  .user-action {
    &__form {
      flex-direction: column;
    }
  }
  .user-block {
    &__avatar {
      .edit__avatar {
        padding: 5px;
        &__icon {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
  .user-action {
    &__form {
      width: 100%;
      .form__part {
        width: 100%;
        .input {
          width: 100%;
        }
      }
    }
  }
}
@media (max-width: 480px) {
  .user-block {
    flex-direction: column;
    &__avatar {
      padding-bottom: 35%;
      padding-right: 35%;
      .edit__avatar {
        padding: 5px;
        &__icon {
          width: 24px;
          height: 24px;
        }
      }
    }
    &__info {
      align-items: center;
    }
  }
  .user-avatar {
    width: 80%;

    &__header {
      &__title {
        font-size: 1em;
      }
      &__close {
        font-size: 0.8em;
      }
    }
    &__form {
      flex-direction: column;
    }
  }
}
</style>
