<script setup lang="ts">
import { ref } from 'vue';
import axios from '../../axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { Search } from 'lucide-vue-next';

const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const loading = ref(false);
const paso = ref(1);

const formulario = ref({
  dni: '',
  nombre: '',
  apellidos: '',
  edad: null,
  ingreso_mensual: null,
  deuda_mensual: 0,
  puntaje_credito: null,
  monto_prestamo: null,
  meses: 12,
  present_emp_since: null,
  dependientes: 0,
  tipo_prestamo: '',
  estado_credito: 'nuevo',
  estado_civil: '',
  tipo_empleo: '',
  vivienda: ''
});

const categorias = ref({
  tipo_prestamo: ['hipotecario', 'personal', 'vehicular'],
  estado_credito: ['cancelado', 'deudor', 'nuevo', 'pendiente'],
  estado_civil: ['casado', 'divorciado', 'soltero', 'viudo'],
  tipo_empleo: ['desempleado', 'independiente', 'permanente', 'temporal'],
  vivienda: ['alquilada', 'familiar', 'propia'],
  meses: [6, 12, 18, 24, 36, 48, 60]
});

const buscarCliente = async () => {
  if (!formulario.value.dni || formulario.value.dni.length !== 8) {
    Swal.fire('Error', 'Ingresa un DNI valido de 8 digitos', 'error');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post(`${API_URL}/consultar-cliente`, {
      dni: formulario.value.dni
    });

    if (response.data.tiene_pendiente) {
      Swal.fire({
        title: 'Solicitud Pendiente',
        html: `Este cliente ya tiene una solicitud pendiente de evaluación.<br><br><strong>ID de solicitud:</strong> ${response.data.solicitud_id}`,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (response.data.encontrado) {
      const nombres = response.data.nombre.split(' ');
      formulario.value.nombre = nombres.slice(0, -2).join(' ') || nombres[0];
      formulario.value.apellidos = nombres.slice(-2).join(' ') || '';
      formulario.value.deuda_mensual = response.data.deuda_mensual;
      formulario.value.puntaje_credito = response.data.puntaje_credito;
      formulario.value.estado_credito = response.data.estado_credito;
      paso.value = 2;
    } else {
      Swal.fire('No encontrado', response.data.mensaje, 'warning');
    }
  } catch (error) {
    Swal.fire('Error', 'Error al consultar cliente', 'error');
  } finally {
    loading.value = false;
  }
};

const crearSolicitud = async () => {
  loading.value = true;
  try {
    const response = await axios.post(`${API_URL}/crear-solicitud`, formulario.value);
    
    Swal.fire({
      title: 'Solicitud creada',
      text: `ID de solicitud: ${response.data.solicitud_id}`,
      icon: 'success',
      confirmButtonText: 'Ver registros'
    }).then(() => {
      router.push('/dashboard/solicitud/registros');
    });
  } catch (error: any) {
    const mensaje = error.response?.data?.detail || 'Error al crear solicitud';
    Swal.fire('Error', mensaje, 'error');
  } finally {
    loading.value = false;
  }
};

const siguientePaso = () => {
  paso.value++;
};

const anteriorPaso = () => {
  paso.value--;
};
</script>

<template>
  <div class="p-4 md:p-6 max-w-5xl mx-auto">
    <!-- Encabezado -->
    <div class="mb-6">
      <h1 class="text-lg font-semibold text-gray-800">Nueva Solicitud de Credito</h1>
      <p class="text-xs text-gray-500 mt-1">Complete los pasos para registrar una nueva solicitud</p>
    </div>

    <!-- Indicador de pasos -->
    <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <div v-for="i in 3" :key="i" class="flex items-center flex-1">
          <div class="flex items-center">
            <div 
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                paso >= i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
              ]"
            >
              {{ i }}
            </div>
            <span 
              :class="[
                'ml-2 text-xs font-medium hidden sm:block',
                paso >= i ? 'text-gray-800' : 'text-gray-400'
              ]"
            >
              {{ i === 1 ? 'Buscar Cliente' : i === 2 ? 'Verificar Datos' : 'Completar Solicitud' }}
            </span>
          </div>
          <div v-if="i < 3" :class="['flex-1 h-px mx-3', paso > i ? 'bg-blue-600' : 'bg-gray-200']"></div>
        </div>
      </div>
    </div>

    <!-- Contenido del formulario -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <!-- Paso 1: Buscar cliente -->
      <div v-if="paso === 1" class="p-5">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
            <Search class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Buscar Cliente</h2>
            <p class="text-xs text-gray-500">Ingrese el DNI del cliente para continuar</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Numero de DNI</label>
          <div class="flex gap-2">
            <input
              v-model="formulario.dni"
              type="text"
              maxlength="8"
              
              class="flex-1 max-w-xs px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              @click="buscarCliente"
              :disabled="loading"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Search class="w-4 h-4" />
              <span class="hidden sm:inline">Buscar</span>
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-2">El DNI debe tener 8 digitos</p>
        </div>
      </div>

      <!-- Paso 2: Datos del cliente (readonly) -->
      <div v-if="paso === 2" class="p-5">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Datos del Cliente</h2>
            <p class="text-xs text-gray-500">Verifique la informacion del cliente</p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
              <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                {{ formulario.nombre || '-' }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Apellidos</label>
              <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                {{ formulario.apellidos || '-' }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Deuda Mensual</label>
              <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                S/ {{ formulario.deuda_mensual?.toFixed(2) || '0.00' }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Puntaje Crediticio</label>
              <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                <span :class="[
                  formulario.puntaje_credito >= 700 ? 'text-green-600' : 
                  formulario.puntaje_credito >= 500 ? 'text-yellow-600' : 'text-red-600'
                ]">
                  {{ formulario.puntaje_credito || '-' }}
                </span>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Estado Crediticio</label>
              <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                <span :class="[
                  'px-2 py-0.5 rounded text-xs font-medium',
                  formulario.estado_credito === 'cancelado' ? 'bg-green-100 text-green-700' :
                  formulario.estado_credito === 'nuevo' ? 'bg-blue-100 text-blue-700' :
                  formulario.estado_credito === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ formulario.estado_credito || '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-5 pt-4 border-t border-gray-100">
          <button @click="anteriorPaso" class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Anterior
          </button>
          <button @click="siguientePaso" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Continuar
          </button>
        </div>
      </div>

      <!-- Paso 3: Datos a llenar -->
      <div v-if="paso === 3" class="p-5">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-800">Completar Solicitud</h2>
            <p class="text-xs text-gray-500">Complete los datos requeridos para la evaluacion</p>
          </div>
        </div>

        <!-- Seccion: Datos Personales -->
        <div class="mb-5">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Datos Personales</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Edad</label>
                <input v-model.number="formulario.edad" type="number" min="18" max="75" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Estado Civil</label>
                <select v-model="formulario.estado_civil" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="">Seleccionar</option>
                  <option v-for="op in categorias.estado_civil" :key="op" :value="op">{{ op }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Dependientes</label>
                <input v-model.number="formulario.dependientes" type="number" min="0" max="10" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Seccion: Datos Laborales -->
        <div class="mb-5">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Datos Laborales</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Tipo de Empleo</label>
                <select v-model="formulario.tipo_empleo" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="">Seleccionar</option>
                  <option v-for="op in categorias.tipo_empleo" :key="op" :value="op">{{ op }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Anos en empleo actual</label>
                <input v-model.number="formulario.present_emp_since" type="number" min="0" max="50" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Ingreso Mensual (S/)</label>
                <input v-model.number="formulario.ingreso_mensual" type="number" min="0" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <!-- Seccion: Vivienda -->
        <div class="mb-5">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vivienda</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Tipo de Vivienda</label>
                <select v-model="formulario.vivienda" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="">Seleccionar</option>
                  <option v-for="op in categorias.vivienda" :key="op" :value="op">{{ op }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Seccion: Datos del Prestamo -->
        <div class="mb-5">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Datos del Prestamo</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Monto Solicitado (S/)</label>
                <input v-model.number="formulario.monto_prestamo" type="number" min="0" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Tipo de Prestamo</label>
                <select v-model="formulario.tipo_prestamo" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="">Seleccionar</option>
                  <option v-for="op in categorias.tipo_prestamo" :key="op" :value="op">{{ op }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Plazo</label>
                <select v-model.number="formulario.meses" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option v-for="op in categorias.meses" :key="op" :value="op">{{ op }} meses</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between pt-4 border-t border-gray-100">
          <button @click="anteriorPaso" class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Anterior
          </button>
          <button 
            @click="crearSolicitud" 
            :disabled="loading"
            class="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? 'Procesando...' : 'Crear Solicitud' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
