<script setup>
import { UserCircle } from 'lucide-vue-next';

const props = defineProps({
  datosCliente: {
    type: Object,
    default: () => ({})
  }
});
</script>

<template>
  <div>
    <!-- Mensaje cuando no hay datos -->
    <div v-if="!datosCliente.dni" class="text-center py-12">
      <UserCircle :size="48" class="text-gray-300 mx-auto mb-4" />
      <p class="text-gray-400 text-sm">Ingrese un DNI para ver la informacion</p>
    </div>

    <!-- Grid de datos -->
    <div v-else class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <h3 class="text-xs font-bold text-gray-500 mb-1">DNI</h3>
        <p class="text-sm text-gray-900">{{ datosCliente.dni }}</p>
      </div>

      <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <h3 class="text-xs font-bold text-gray-500 mb-1">Nombre</h3>
        <p class="text-sm text-gray-900">{{ datosCliente.nombre }}</p>
      </div>

      <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <h3 class="text-xs font-bold text-gray-500 mb-1">Puntaje Credito</h3>
        <p class="text-sm text-blue-600">{{ datosCliente.puntaje_credito }}</p>
      </div>

      <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <h3 class="text-xs font-bold text-gray-500 mb-1">Estado Credito</h3>
        <p class="text-sm text-gray-900 capitalize">{{ datosCliente.estado_credito }}</p>
      </div>

      <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm col-span-2">
        <h3 class="text-xs font-bold text-gray-500 mb-1">Deuda Mensual</h3>
        <p class="text-sm text-red-600">S/ {{ datosCliente.deuda_mensual !== undefined ? Number(datosCliente.deuda_mensual).toLocaleString() : '0' }}</p>
      </div>
    </div>
  </div>
</template>
