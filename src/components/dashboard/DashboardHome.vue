<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from '../../axios';
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Activity } from 'lucide-vue-next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const stats = ref({
  total: 0,
  aprobadas: 0,
  rechazadas: 0,
  pendientes: 0
});

const fechaActual = computed(() => {
  const fecha = new Date();
  return fecha.toLocaleDateString('es-PE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

const tasaAprobacion = computed(() => {
  if (stats.value.total === 0) return 0;
  const evaluadas = stats.value.aprobadas + stats.value.rechazadas;
  if (evaluadas === 0) return 0;
  return ((stats.value.aprobadas / evaluadas) * 100).toFixed(1);
});

const cargarEstadisticas = async () => {
  try {
    const response = await axios.get(`${API_URL}/estadisticas`);
    stats.value = {
      total: response.data.total || 0,
      aprobadas: response.data.aprobadas || 0,
      rechazadas: response.data.rechazadas || 0,
      pendientes: response.data.pendientes || 0
    };
  } catch (error) {
    console.error('Error al cargar estadisticas:', error);
  }
};

onMounted(() => {
  cargarEstadisticas();
});
</script>

<template>
  <div class="p-4 md:p-6 bg-slate-50 min-h-full">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-lg md:text-xl font-semibold text-slate-800">Panel de Control</h1>
      <p class="text-xs text-slate-500 mt-1 capitalize">{{ fechaActual }}</p>
    </div>
    
    <!-- Estadisticas principales -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Solicitudes -->
      <div class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText class="w-5 h-5 text-slate-600" />
          </div>
          <Activity class="w-4 h-4 text-slate-400" />
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ stats.total }}</p>
        <p class="text-xs text-slate-500 mt-1">Total de solicitudes</p>
      </div>

      <!-- Aprobadas -->
      <div class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
            <CheckCircle class="w-5 h-5 text-emerald-600" />
          </div>
          <TrendingUp class="w-4 h-4 text-emerald-500" />
        </div>
        <p class="text-2xl font-bold text-emerald-600">{{ stats.aprobadas }}</p>
        <p class="text-xs text-slate-500 mt-1">Solicitudes aprobadas</p>
      </div>

      <!-- Rechazadas -->
      <div class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
            <XCircle class="w-5 h-5 text-rose-600" />
          </div>
          <TrendingDown class="w-4 h-4 text-rose-500" />
        </div>
        <p class="text-2xl font-bold text-rose-600">{{ stats.rechazadas }}</p>
        <p class="text-xs text-slate-500 mt-1">Solicitudes rechazadas</p>
      </div>

      <!-- Pendientes -->
      <div class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <Clock class="w-5 h-5 text-amber-600" />
          </div>
          <span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Activo</span>
        </div>
        <p class="text-2xl font-bold text-amber-600">{{ stats.pendientes }}</p>
        <p class="text-xs text-slate-500 mt-1">Pendientes de evaluar</p>
      </div>
    </div>

    <!-- Panel secundario -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Tasa de aprobacion -->
      <div class="bg-white border border-slate-200 rounded-lg p-5">
        <h3 class="text-sm font-medium text-slate-700 mb-4">Tasa de Aprobacion</h3>
        <div class="flex items-end gap-3">
          <span class="text-3xl font-bold text-slate-800">{{ tasaAprobacion }}%</span>
          <span class="text-xs text-slate-500 mb-1">de solicitudes evaluadas</span>
        </div>
        <div class="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-emerald-500 rounded-full transition-all duration-500"
            :style="{ width: `${tasaAprobacion}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-2 text-xs text-slate-500">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      <!-- Resumen -->
      <div class="bg-white border border-slate-200 rounded-lg p-5 lg:col-span-2">
        <h3 class="text-sm font-medium text-slate-700 mb-4">Resumen del Sistema</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="border-l-2 border-slate-300 pl-3">
            <p class="text-xs text-slate-500">Solicitudes evaluadas</p>
            <p class="text-lg font-semibold text-slate-800">{{ stats.aprobadas + stats.rechazadas }}</p>
          </div>
          <div class="border-l-2 border-amber-400 pl-3">
            <p class="text-xs text-slate-500">En cola de evaluacion</p>
            <p class="text-lg font-semibold text-slate-800">{{ stats.pendientes }}</p>
          </div>
          <div class="border-l-2 border-emerald-500 pl-3">
            <p class="text-xs text-slate-500">Creditos aprobados</p>
            <p class="text-lg font-semibold text-emerald-600">{{ stats.aprobadas }}</p>
          </div>
          <div class="border-l-2 border-rose-500 pl-3">
            <p class="text-xs text-slate-500">Creditos denegados</p>
            <p class="text-lg font-semibold text-rose-600">{{ stats.rechazadas }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Info del sistema -->
    <div class="mt-4 bg-slate-800 text-white rounded-lg p-5">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <Activity class="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <h3 class="text-sm font-medium mb-1">Sistema de Evaluacion de Riesgo Financiero</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Plataforma de analisis crediticio basada en machine learning para la evaluacion 
            de solicitudes de prestamo. Utiliza el menu lateral para gestionar solicitudes y consultar resultados.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
