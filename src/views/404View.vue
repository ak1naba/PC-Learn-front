<template>
  <BaseLayout>
    <div class="container">
      <div class="unfounded">
        <h2 class="unfounded-title">
          404
        </h2>
        <div class="unfounded-text">
          <h3 class="unfounded-text__title">Страница не найдена</h3>
          <div class="unfounded-text__description">
            Вы можете вернуться на
            <router-link class="form-user__inputs__link" :to="{name: 'main'}" >
              Главную
            </router-link>
            и оттуда попытаться найти нужную вам страницу
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>

</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'

export default {
    name: "404",
  components: { BaseLayout }
}
</script>

<style scoped lang="scss">
@import "@/assets/style/colors.scss";

.unfounded{
  padding-top: 75px;
  padding-bottom: 75px;

  display: flex;
  align-items: center;
  gap: 25px;

  &-title{
    font-size: 124px;
  }
  &-text{
    display: flex;
    flex-direction: column;
    gap: 25px;

    &__title{
      font-size: 1.8em;
    }
  }
}

@media (max-width:960px) {
  .unfounded{
    flex-direction: column;
    &-text{
      align-items: center;
    }
  }
}

</style>
