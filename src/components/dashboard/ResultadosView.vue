<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '../../axios';
import Swal from 'sweetalert2';
import { Search, Download } from 'lucide-vue-next';
import html2pdf from 'html2pdf.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const loading = ref(false);
const dniBuscar = ref('');
const resultado = ref<any>(null);
const cliente = ref<any>(null);
const documentoRef = ref<HTMLElement | null>(null);

const buscarResultados = async () => {
  if (!dniBuscar.value || dniBuscar.value.length !== 8) {
    Swal.fire('Error', 'Ingresa un DNI válido de 8 dígitos', 'error');
    return;
  }

  loading.value = true;
  resultado.value = null;
  cliente.value = null;
  
  try {
    const response = await axios.get(`${API_URL}/resultados/${dniBuscar.value}`);
    const data = response.data;
    
    if (data.resultados && data.resultados.length > 0) {
      resultado.value = data.resultados[0];
      cliente.value = data.cliente || null;
    } else {
      Swal.fire('Info', 'No se encontraron resultados para este DNI', 'info');
    }
  } catch (error) {
    Swal.fire('Error', 'Error al buscar resultados', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const dniParam = route.params.dni as string;
  if (dniParam && dniParam.length === 8) {
    dniBuscar.value = dniParam;
    buscarResultados();
  }
});

const formatMoney = (value: number) => {
  return value?.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric'
  });
};

const descargarPDF = () => {
  const elemento = documentoRef.value;
  if (!elemento) return;
  
  const opciones = {
    margin: 10,
    filename: `constancia_${dniBuscar.value}_${resultado.value.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opciones).from(elemento).save();
};
</script>

<template>
  <div class="p-4 md:p-6">
    <!-- Búsqueda -->
    <div class="bg-gray-50 border border-gray-200 rounded p-4 mb-4 print:hidden">
      <div class="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <h1 class="text-sm font-semibold text-gray-700">Consulta de Resultados</h1>
        <div class="flex gap-2 justify-end">
          <input
            v-model="dniBuscar"
            type="text"
            maxlength="8"
            class="w-80 px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            @keyup.enter="buscarResultados"
          />
          <button
            @click="buscarResultados"
            :disabled="loading"
            class="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            <Search class="w-4 h-4" />
          </button>
          <button
            v-if="resultado"
            @click="descargarPDF"
            class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            title="Descargar PDF"
          >
            <Download class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Documento -->
    <div v-if="resultado" ref="documentoRef" class="bg-white border border-gray-300 mx-auto max-w-2xl documento-pdf">
      
      <!-- Encabezado -->
      <div class="border-b-2 border-gray-700 p-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-base font-bold text-gray-800 tracking-wide">SISTEMA FINANCIERO</h1>
            <p class="text-xs text-gray-500 mt-1">Evaluacion de Riesgo Crediticio</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">N Documento</p>
            <p class="text-base font-bold text-gray-800">{{ String(resultado.id).padStart(6, '0') }}</p>
          </div>
        </div>
      </div>

      <!-- Título -->
      <div class="text-center py-4 border-b border-gray-300 bg-gray-50">
        <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Constancia de Evaluacion Crediticia
        </h2>
        <p class="text-xs text-gray-500 mt-1">Solicitud N {{ resultado.solicitud_id }}</p>
      </div>

      <!-- Estado -->
      <div class="mx-6 my-4 p-4 text-center border" :class="resultado.califica ? 'border-gray-400 bg-gray-50' : 'border-gray-400 bg-gray-100'">
        <p class="text-sm font-bold uppercase tracking-wide" :class="resultado.califica ? 'text-gray-700' : 'text-gray-600'">
          {{ resultado.califica ? 'CREDITO APROBADO' : 'CREDITO NO APROBADO' }}
        </p>
        <p class="text-xs mt-1 text-gray-500">
          Probabilidad de pago: {{ (resultado.probabilidad * 100).toFixed(2) }}%
        </p>
      </div>

      <!-- Contenido -->
      <div class="px-6 py-4">
        
        <!-- Datos del solicitante -->
        <div class="mb-5">
          <h3 class="text-xs font-semibold text-gray-600 uppercase border-b border-gray-300 pb-1 mb-3">
            I. Datos del Solicitante
          </h3>
          <table class="w-full text-xs">
            <tr>
              <td class="py-1.5 text-gray-500 w-1/3">Documento de Identidad:</td>
              <td class="py-1.5 text-gray-700">{{ dniBuscar }}</td>
            </tr>
            <tr v-if="cliente">
              <td class="py-1.5 text-gray-500">Nombre Completo:</td>
              <td class="py-1.5 text-gray-700">{{ cliente.nombre }}</td>
            </tr>
          </table>
        </div>

        <!-- Detalles del crédito -->
        <div class="mb-5">
          <h3 class="text-xs font-semibold text-gray-600 uppercase border-b border-gray-300 pb-1 mb-3">
            II. Detalles del Credito
          </h3>
          <table class="w-full text-xs">
            <tr>
              <td class="py-1.5 text-gray-500 w-1/3">Monto Solicitado:</td>
              <td class="py-1.5 text-gray-700">S/ {{ formatMoney(resultado.monto_aprobado) }}</td>
            </tr>
            <tr>
              <td class="py-1.5 text-gray-500">Plazo:</td>
              <td class="py-1.5 text-gray-700">{{ resultado.plazo_meses }} meses</td>
            </tr>
            <tr>
              <td class="py-1.5 text-gray-500">Tasa de Interes Anual:</td>
              <td class="py-1.5 text-gray-700">{{ resultado.tasa_interes_anual }}%</td>
            </tr>
          </table>
        </div>

        <!-- Condiciones de pago -->
        <div class="mb-5">
          <h3 class="text-xs font-semibold text-gray-600 uppercase border-b border-gray-300 pb-1 mb-3">
            III. Condiciones de Pago
          </h3>
          <table class="w-full text-xs">
            <tr>
              <td class="py-1.5 text-gray-500 w-1/3">Cuota Mensual:</td>
              <td class="py-1.5 text-gray-700">S/ {{ formatMoney(resultado.cuota_mensual) }}</td>
            </tr>
            <tr>
              <td class="py-1.5 text-gray-500">Total Intereses:</td>
              <td class="py-1.5 text-gray-700">S/ {{ formatMoney(resultado.total_a_pagar - resultado.monto_aprobado) }}</td>
            </tr>
            <tr class="border-t border-gray-200">
              <td class="py-2 text-gray-700 font-semibold">Total a Pagar:</td>
              <td class="py-2 font-semibold text-sm text-gray-800">S/ {{ formatMoney(resultado.total_a_pagar) }}</td>
            </tr>
          </table>
        </div>

        <!-- Nota -->
        <div class="mt-6 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-500">
          <p class="font-semibold mb-1 text-gray-600">Nota:</p>
          <p class="text-justify leading-relaxed">
            El presente documento es una constancia de la evaluacion crediticia realizada por el sistema. 
            La aprobacion esta sujeta a la verificacion de la informacion proporcionada y a las politicas 
            vigentes de la institucion financiera. Este documento no constituye un contrato de prestamo.
          </p>
        </div>
      </div>

      <!-- Pie -->
      <div class="border-t-2 border-gray-700 px-6 py-4 mt-4 bg-gray-50">
        <div class="flex justify-between items-end text-xs">
          <div>
            <p class="text-gray-500">Fecha de emision:</p>
            <p class="text-gray-700">{{ formatDate(resultado.fecha_prediccion) }}</p>
          </div>
          <div class="text-center">
            <div class="border-t border-gray-400 w-40 pt-1 mt-8">
              <p class="text-gray-500">Firma del Evaluador</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-gray-500">Hora:</p>
            <p class="text-gray-700">{{ new Date(resultado.fecha_prediccion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) }}</p>
          </div>
        </div>
      </div>

      <!-- Código de verificación -->
      <div class="bg-gray-100 px-6 py-2 text-center text-xs text-gray-400 border-t border-gray-200">
        Codigo de verificacion: {{ resultado.id }}-{{ resultado.solicitud_id }}-{{ dniBuscar }}
      </div>
    </div>

    <!-- Mensaje vacío -->
    <div v-if="!resultado && !loading" class="bg-gray-50 border border-gray-200 rounded p-8 text-center">
      <Search class="w-8 h-8 text-gray-300 mx-auto mb-3" />
      <p class="text-xs text-gray-400">Ingresa un DNI para buscar el resultado de evaluacion</p>
    </div>
  </div>
</template>

<style scoped>
.documento-pdf {
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
