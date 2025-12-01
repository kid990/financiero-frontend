<script setup>
defineProps({
  resultado: Object,
  dniValidado: Boolean
});

const emit = defineEmits(['reiniciar']);
</script>

<template>
  <div class="flex border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 justify-between items-center">
    <div class="py-3 px-4 text-sm font-medium text-white flex items-center gap-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      Solicitud de Credito
    </div>
    <button 
      v-if="resultado || dniValidado"
      @click="emit('reiniciar')" 
      type="button"
      class="mr-4 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Nueva Evaluacion
    </button>
  </div>
</template>
