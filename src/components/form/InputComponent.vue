<template>
  <input
    :class="inputClasses"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'password', 'email', 'number'].includes(value),
    },
    invalid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    inputClasses() {
      return {
        input: true,
        'input-invalid': this.invalid,
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/style/colors.scss';

.input {
  padding: 10px 15px;
  border: 1px solid var(--main-color, $main-color); // fallback если переменная не определена
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--main-color-hover, $main-color);
  }
}

.input-invalid {
  border: 1px solid var(--text-invalid, #ff4444);
}
</style>
