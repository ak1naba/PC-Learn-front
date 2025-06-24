<template>
    <BaseLayout>
      <div class="container">
        <div class="admin-panel">
          <h2 class="admin-panel__title">
            Панель управления
          </h2>
          <div class="admin-panel__columns">
            <aside class="admin-panel__columns__nav">
              <router-link :to="{name:'admin.users'}" class="admin-panel__columns__nav__link">Пользователи</router-link>
              <router-link :to="{name:'admin.lessons'}" class="admin-panel__columns__nav__link">Задания</router-link>
            </aside>
            <div class="admin-panel__columns__content">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>

</template>

<script>

import BaseLayout from '@/layouts/BaseLayout.vue'

export default {
    name: "ControlPanelView",
  components: { BaseLayout }

}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';
.admin-panel{
  padding: 20px 0;

  &__title{
    font-size: 1.8em;
  }

  &__columns{
    padding: 20px 0;

    display: flex;
    align-items: flex-start;
    gap: 25px;

    width: 100%;
    &__nav{
      display: flex;
      flex-direction: column;
      gap: 15px;
      width: 20%;
      &__link{
        font-size: 1.5em;
        color: $text-link;
      }
    }
    &__content{
      width: 80%;
    }
  }
}

@media(max-width: 1024px){
  .admin-panel{
    &__title{
      font-size: 1.4em;
    }

    &__columns{
      flex-direction: column;
      &__nav{
        display: flex;
        gap: 15px;
        flex-direction: row;
        &__link{
          font-size: 1.5em;
          color: $text-link;
        }
      }
      &__content{
        padding: 15px 0;
      }
    }
  }
}
@media(max-width: 425px){
  .admin-panel{
    &__columns{
      flex-direction: column;
      &__content{
        width: 100%;
      }
    }
  }
}

</style>
