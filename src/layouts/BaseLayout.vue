<template>
  <div class="wrapper">
    <HeaderComponent />
    <main>
      <slot></slot>
    </main>
    <FooterComponent />
  </div>

</template>

<script>
import HeaderComponent from '@/components/PageElements/HeaderComponent.vue'
import FooterComponent from '@/components/PageElements/FooterComponent.vue'

export default {
  name: 'BaseLayout',
  components: { HeaderComponent, FooterComponent },
  data() {
    return {
      token: '',
    }
  },
  methods: {},
}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';
</style>
