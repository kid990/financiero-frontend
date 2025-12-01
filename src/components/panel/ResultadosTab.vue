<script setup>
import { ref } from 'vue';
import { FileCheck, ChevronDown, ChevronUp } from 'lucide-vue-next';

const props = defineProps({
  resultado: {
    type: Object,
    default: null
  },
  datosCliente: {
    type: Object,
    default: () => ({})
  }
});

const resultadoVisible = ref(true);

const toggleResultado = () => {
  resultadoVisible.value = !resultadoVisible.value;
};
</script>

<template>
  <div>
    <!-- Sin resultado -->
    <div v-if="!resultado" class="text-center py-12">
      <FileCheck :size="48" class="text-gray-300 mx-auto mb-4" />
      <p class="text-gray-400 text-sm">Complete el formulario para ver los resultados</p>
    </div>

    <!-- Con resultado -->
    <div v-else class="space-y-4">
      <!-- Header del resultado -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div :class="[ 'w-10 h-10 rounded-full flex items-center justify-center', resultado.califica === 'SI' ? 'bg-green-100' : 'bg-red-100' ]">
            <svg v-if="resultado.califica === 'SI'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div>
            <p :class="[ 'text-sm font-bold', resultado.califica === 'SI' ? 'text-green-600' : 'text-red-600' ]">
              {{ resultado.califica === 'SI' ? 'APROBADO' : 'RECHAZADO' }}
            </p>
          </div>
        </div>
        <button @click="toggleResultado" class="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronUp v-if="resultadoVisible" :size="18" class="text-gray-600" />
          <ChevronDown v-else :size="18" class="text-gray-600" />
        </button>
      </div>

      <div v-show="resultadoVisible" class="space-y-3">
        <!-- Datos principales -->
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <h3 class="text-xs font-bold text-blue-600 mb-1">Monto Aprobado</h3>
            <p class="text-sm text-blue-700">S/ {{ resultado.monto_aprobado?.toLocaleString() }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-3 border border-green-200">
            <h3 class="text-xs font-bold text-green-600 mb-1">Cuota Mensual</h3>
            <p class="text-sm text-green-700">S/ {{ resultado.cuota_mensual?.toLocaleString() }}</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <h3 class="text-xs font-bold text-purple-600 mb-1">Total a Pagar</h3>
            <p class="text-sm text-purple-700">S/ {{ resultado.total_a_pagar?.toLocaleString() }}</p>
          </div>
          <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <h3 class="text-xs font-bold text-orange-600 mb-1">Probabilidad</h3>
            <p class="text-sm text-orange-700">{{ resultado.probabilidad }}</p>
          </div>
        </div>

        <!-- Detalles financieros -->
        <div class="bg-gray-100 rounded-lg p-3 border border-gray-200">
          <h3 class="text-xs font-bold text-gray-700 mb-2">Detalles</h3>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <p class="text-xs text-gray-500">Plazo</p>
              <p class="text-sm text-gray-800">{{ resultado.plazo_meses }}m</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Tasa Anual</p>
              <p class="text-sm text-gray-800">{{ resultado.tasa_interes_anual }}%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Tasa Mensual</p>
              <p class="text-sm text-gray-800">{{ resultado.tasa_interes_mensual }}%</p>
            </div>
          </div>
        </div>

        <!-- Datos del solicitante -->
        <div class="bg-gray-100 rounded-lg p-3 border border-gray-200">
          <h3 class="text-xs font-bold text-gray-700 mb-2">Solicitante</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p class="text-xs text-gray-500">DNI</p>
              <p class="text-sm text-gray-800">{{ datosCliente.dni }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Nombre</p>
              <p class="text-sm text-gray-800 truncate">{{ datosCliente.nombre }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Edad</p>
              <p class="text-sm text-gray-800">{{ datosCliente.edad }} anios</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Estado Civil</p>
              <p class="text-sm text-gray-800 capitalize">{{ datosCliente.estado_civil }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Tipo Empleo</p>
              <p class="text-sm text-gray-800 capitalize">{{ datosCliente.tipo_empleo }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Ingreso</p>
              <p class="text-sm text-green-600">S/ {{ datosCliente.ingreso_mensual?.toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Anios Empleo</p>
              <p class="text-sm text-gray-800">{{ datosCliente.present_emp_since }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Vivienda</p>
              <p class="text-sm text-gray-800 capitalize">{{ datosCliente.vivienda }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Dependientes</p>
              <p class="text-sm text-gray-800">{{ datosCliente.dependientes }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Tipo Prestamo</p>
              <p class="text-sm text-gray-800 capitalize">{{ datosCliente.tipo_prestamo }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Puntaje</p>
              <p class="text-sm text-blue-600">{{ datosCliente.puntaje_credito }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Deuda</p>
              <p class="text-sm text-red-600">S/ {{ datosCliente.deuda_mensual?.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Razon -->
        <div class="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <h3 class="text-xs font-bold text-yellow-700 mb-1">Analisis</h3>
          <p class="text-xs text-gray-800">{{ resultado.razon }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
