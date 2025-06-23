<template>
  <button
    :class="buttonClasses"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="btn-content">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'primary', 'danger'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      return {
        'btn': true,
        'btn-primary': this.variant === 'primary',
        'btn-danger': this.variant === 'danger',
        'disabled': this.disabled
      }
    }
  }
}
</script>

<style scoped lang="scss">
 @import '@/assets/style/colors';

.btn {
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid var(--main-color, $main-color);
  background-color: transparent;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  min-width: 100px;

  &:hover:not(.disabled) {
    background-color: var(--main-color, $main-color);
    color: var(--text-white, #ffffff);
  }

  &-primary {
    border: 1px solid var(--text-allow, $text-allow);
    background-color: var(--text-allow, $text-allow);
    color: var(--text-white, #ffffff);

    &:hover:not(.disabled) {
      background-color: var(--text-white, #ffffff);
      color: var(--text-allow, $text-allow);
    }
  }

  &-danger {
    border: 1px solid var(--text-invalid, $text-invalid);
    background-color: var(--text-invalid, $text-invalid);
    color: var(--text-white, $text-white);

    &:hover:not(.disabled) {
      background-color: var(--text-white, #ffffff);
      color: var(--text-invalid, $text-invalid);
    }
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-content {
    position: relative;
    z-index: 1;
  }
}
</style>