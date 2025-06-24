<template>
  <BaseLayout>
    <div class="container">
      <div class="contacts">
        <div class="contacts-title">
          Контакты
        </div>
        <div class="contacts-text">
          Вы можете связаться с нами с помощью:
          <ul>
            <li><a href="https://vk.com/pc_learn">Сообщество Вконтаке</a></li>
            <li><a href="https://vk.com/pc_learn">Канал телеграм</a></li>
          </ul>
          Почта: <div class="email">pc-learn@mail.ru</div>
        </div>
      </div>
    </div>
  </BaseLayout>

</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
export default {
    name: "contacts",
  components: { BaseLayout }
}
</script>

<style scoped lang="scss">
@import "@/assets/style/colors.scss";

.contacts{
  padding: 25px 0px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  &-title{
    font-size: 1.4em;
  }
  &-text{
    display: flex;
    flex-direction: column;
    gap: 15px;
    ul{
      padding: 15px 0px 15px 15px;
      li{
        a{
          color: $text-link;
        }

      }
    }
    .email{
      color: $text-link;
    }
  }
}

</style>
