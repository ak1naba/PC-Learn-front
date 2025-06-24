<template>
  <div ref="editor"></div>
</template>

<script>
export default {
  props: {
    modelValue: String
  },
  emits: ['update:modelValue'],
  mounted() {
    $(this.$refs.editor).summernote({
      height: 300,
      callbacks: {
        onChange: (content) => {
          this.$emit('update:modelValue', content)
        }
      }
    })

    // Устанавливаем начальное значение
    if (this.modelValue) {
      $(this.$refs.editor).summernote('code', this.modelValue)
    }
  },
  watch: {
    modelValue(newValue) {
      // Обновляем редактор при изменении значения извне
      if (newValue !== $(this.$refs.editor).summernote('code')) {
        $(this.$refs.editor).summernote('code', newValue)
      }
    }
  },
  beforeUnmount() {
    $(this.$refs.editor).summernote('destroy')
  }
}
</script>

<style>
@import 'summernote/dist/summernote-lite.min.css';
</style>