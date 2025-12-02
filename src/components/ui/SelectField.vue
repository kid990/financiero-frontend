<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  options: Array,
  error: String,
  icon: Object,
  placeholder: { type: String, default: 'Seleccionar...' },
  valueKey: String,
  labelKey: String,
  disabled: Boolean
});

const emit = defineEmits(['update:modelValue']);

const selectValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

function formatLabel(option) {
  if (typeof option === 'string') {
    return option.charAt(0).toUpperCase() + option.slice(1);
  }
  if (typeof option === 'number') {
    return option;
  }
  return props.labelKey ? option[props.labelKey] : option;
}

function getValue(option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return option;
  }
  return props.valueKey ? option[props.valueKey] : option;
}
</script>

<template>
  <div class="w-[400px]">
    <label class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="relative">
      <component :is="icon" v-if="icon" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <select
        v-model="selectValue"
        :disabled="disabled"
        class="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        :class="{ 'border-red-500': error, 'border-gray-300': !error }"
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="(option, index) in options" :key="index" :value="getValue(option)">
          {{ formatLabel(option) }}
        </option>
      </select>
    </div>
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
  </div>
</template>
