<script setup>
import { UserCircle, FileCheck } from 'lucide-vue-next';

const props = defineProps({
  tabActiva: {
    type: String,
    default: 'info'
  }
});

const emit = defineEmits(['cambiarTab']);
</script>

<template>
  <div class="flex border-b border-gray-200 bg-white">
    <button
      @click="emit('cambiarTab', 'info')"
      :class="[
        'flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2',
        tabActiva === 'info' 
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
          : 'text-gray-500 hover:text-gray-700'
      ]"
    >
      <UserCircle :size="18" />
      Informacion
    </button>
    <button
      @click="emit('cambiarTab', 'resultados')"
      :class="[
        'flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2',
        tabActiva === 'resultados' 
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
          : 'text-gray-500 hover:text-gray-700'
      ]"
    >
      <FileCheck :size="18" />
      Resultados
    </button>
  </div>
</template>
