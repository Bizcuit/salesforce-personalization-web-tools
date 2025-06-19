<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],

  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      required: true
    }
  }
})
</script>

<template>
  <div class="buttons is-right">
    <div class="buttons has-addons is-small">
      <span class="is-size-7 mr-5">{{ label }}</span>
      <button :class="{ 'button is-small': true, 'is-selected is-success': modelValue }"
        @click="$emit('update:modelValue', true)">Yes</button>
      <button :class="{ 'button is-small': true, 'is-selected is-danger': !modelValue }"
        @click="$emit('update:modelValue', false)">No</button>
    </div>
  </div>
</template>
