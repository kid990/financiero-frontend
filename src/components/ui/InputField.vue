<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  error: String,
  icon: Object,
  disabled: Boolean,
  min: [String, Number],
  max: [String, Number],
  maxlength: [String, Number],
  step: [String, Number],
  successBorder: Boolean
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const borderClass = computed(() => {
  if (props.error) return 'border-red-500';
  if (props.successBorder) return 'border-green-500';
  return 'border-gray-300';
});
</script>

<template>
  <div class="w-[400px]">
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="relative">
      <component :is="icon" v-if="icon" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        v-model="inputValue"
        :type="type"
        :min="min"
        :max="max"
        :maxlength="maxlength"
        :step="step"
        :disabled="disabled"
        class="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        :class="borderClass"
      />
    </div>
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    <slot name="success"></slot>
  </div>
</template>
