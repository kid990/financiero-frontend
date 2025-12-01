<script setup>
import { ref, watch } from 'vue';
import TabHeader from '../ui/TabHeader.vue';
import InfoTab from './InfoTab.vue';
import ResultadosTab from './ResultadosTab.vue';

const props = defineProps({
  datosCliente: {
    type: Object,
    default: () => ({})
  },
  resultado: {
    type: Object,
    default: null
  }
});

const tabActiva = ref('info');

// Cambiar a tab resultados cuando llegue un resultado
watch(() => props.resultado, (newVal) => {
  if (newVal) {
    tabActiva.value = 'resultados';
  }
});

const cambiarTab = (tab) => {
  tabActiva.value = tab;
};
</script>

<template>
  <div class="bg-gray-50 h-full flex flex-col">
    <!-- Tabs -->
    <TabHeader :tabActiva="tabActiva" @cambiarTab="cambiarTab" />

    <!-- Contenido -->
    <div class="flex-1 overflow-y-auto p-4">
      <!-- Tab Informacion -->
      <InfoTab v-if="tabActiva === 'info'" :datosCliente="datosCliente" />

      <!-- Tab Resultados -->
      <ResultadosTab v-else-if="tabActiva === 'resultados'" :resultado="resultado" :datosCliente="datosCliente" />
    </div>
  </div>
</template>