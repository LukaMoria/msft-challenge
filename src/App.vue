<script setup lang="ts">
import { ref } from 'vue';
import VCombobox, { type ItemOptions } from './components/VCombobox.vue';

const options = [
  { label: '🍈 Melon', value: 'melon' },
  { label: '🍉 Watermelon', value: 'watermelon' },
  { label: '🍋 Lemon', value: 'lemon' },
  { label: '🍌 Banana', value: 'banana' },
  { label: '🍍 Pineapple', value: 'pineapple' },
  { label: '🥭 Mango', value: 'mango' },
  { label: '🍎 Red Apple', value: 'redApple' },
  { label: '🍏 Green Apple', value: 'greenApple' },
];
const value = ref('');
const onChange = (payload: ItemOptions) => {
  value.value = payload.value;
};
</script>

<template>
  <main>
    <VCombobox
      :options="options"
      :value="value"
      label-name="label"
      @change="onChange"
    />
  </main>
</template>
