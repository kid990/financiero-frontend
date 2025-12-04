<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '../../axios';
import Swal from 'sweetalert2';
import { Search, Play, Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const loading = ref(false);
const dniBuscar = ref('');
const solicitudes = ref<any[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const pages = ref(0);

const cargarSolicitudes = async () => {
  loading.value = true;
  try {
    const params: any = { page: page.value, limit: limit.value };
    if (dniBuscar.value) {
      params.dni = dniBuscar.value;
    }
    
    const response = await axios.get(`${API_URL}/solicitudes`, { params });
    solicitudes.value = response.data.solicitudes || [];
    total.value = response.data.total || 0;
    pages.value = response.data.pages || 0;
  } catch (error) {
    Swal.fire('Error', 'Error al cargar solicitudes', 'error');
  } finally {
    loading.value = false;
  }
};

const buscar = () => {
  page.value = 1;
  cargarSolicitudes();
};

const limpiarBusqueda = () => {
  dniBuscar.value = '';
  page.value = 1;
  cargarSolicitudes();
};

const cambiarPagina = (nuevaPagina: number) => {
  if (nuevaPagina >= 1 && nuevaPagina <= pages.value) {
    page.value = nuevaPagina;
    cargarSolicitudes();
  }
};

const cambiarLimit = () => {
  page.value = 1;
  cargarSolicitudes();
};

onMounted(() => {
  cargarSolicitudes();
});

const evaluarSolicitud = async (solicitudId: number) => {
  const confirm = await Swal.fire({
    title: '¿Evaluar solicitud?',
    text: 'Se procederá a evaluar esta solicitud con el modelo de IA',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, evaluar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirm.isConfirmed) return;

  loading.value = true;
  try {
    const response = await axios.post(`${API_URL}/evaluar-solicitud/${solicitudId}`);
    
    Swal.fire({
      title: 'Evaluación completada',
      text: `Resultado ID: ${response.data.resultado_id}`,
      icon: 'success'
    });
    
    cargarSolicitudes();
  } catch (error: any) {
    const mensaje = error.response?.data?.detail || 'Error al evaluar';
    Swal.fire('Error', mensaje, 'error');
  } finally {
    loading.value = false;
  }
};

const verResultado = (dni: string) => {
  router.push(`/dashboard/resultados/${dni}`);
};

const getEstadoClass = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'bg-yellow-100 text-yellow-800';
    case 'aceptada': return 'bg-green-100 text-green-800';
    case 'rechazada': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Encabezado -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Registro de Solicitudes</h1>
      <p class="text-sm text-gray-500 mt-1">Gestiona y evalua las solicitudes de credito</p>
    </div>

    <!-- Contenedor principal -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <!-- Barra de herramientas -->
      <div class="px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <label class="text-xs font-medium text-gray-600">Mostrar</label>
            <select 
              v-model="limit" 
              @change="cambiarLimit" 
              class="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
            </select>
            <span class="text-xs text-gray-500">registros</span>
          </div>
          <div class="h-4 w-px bg-gray-300 hidden sm:block"></div>
          <span class="text-xs text-gray-600 hidden sm:block">
            <span class="font-medium">{{ total }}</span> solicitudes en total
          </span>
        </div>
        
        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div class="relative">
            <input
              v-model="dniBuscar"
              type="text"
              maxlength="8"
              placeholder="Buscar DNI..."
              class="w-44 pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              @keyup.enter="buscar"
            />
            <button
              @click="buscar"
              :disabled="loading"
              class="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600"
            >
              <Search class="w-4 h-4" />
            </button>
          </div>
          <button
            v-if="dniBuscar"
            @click="limpiarBusqueda"
            class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Limpiar filtro"
          >
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Solicitante</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Monto</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Tipo</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="7" class="px-4 py-8 text-center">
                <div class="flex items-center justify-center gap-2 text-gray-500">
                  <RefreshCw class="w-4 h-4 animate-spin" />
                  <span class="text-sm">Cargando...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="solicitudes.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-500">
                No se encontraron solicitudes
              </td>
            </tr>
            <tr v-else v-for="sol in solicitudes" :key="sol.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-sm font-mono text-gray-700">#{{ sol.id }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ sol.nombre }} {{ sol.apellidos }}</div>
                <div class="text-xs text-gray-500 font-mono">{{ sol.dni }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                <span class="text-sm font-medium text-gray-900">S/ {{ sol.monto_prestamo?.toLocaleString() }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                <span class="text-sm text-gray-700 capitalize">{{ sol.tipo_prestamo }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full',
                  getEstadoClass(sol.estado_solicitud)
                ]">
                  {{ sol.estado_solicitud }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                <span class="text-sm text-gray-500">{{ new Date(sol.fecha_solicitud).toLocaleDateString('es-PE') }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-1">
                  <button
                    v-if="sol.estado_solicitud === 'pendiente'"
                    @click="evaluarSolicitud(sol.id)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    title="Evaluar solicitud"
                  >
                    <Play class="w-3 h-3" />
                    <span class="hidden sm:inline">Evaluar</span>
                  </button>
                  <button
                    v-if="sol.estado_solicitud !== 'pendiente'"
                    @click="verResultado(sol.dni)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Ver resultado"
                  >
                    <Eye class="w-3 h-3" />
                    <span class="hidden sm:inline">Ver</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginacion -->
      <div v-if="pages > 0" class="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span class="text-xs text-gray-500">
          Mostrando {{ ((page - 1) * limit) + 1 }} a {{ Math.min(page * limit, total) }} de {{ total }} registros
        </span>
        <div class="flex items-center gap-1">
          <button 
            @click="cambiarPagina(page - 1)" 
            :disabled="page === 1"
            class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center gap-1">
            <template v-for="p in pages" :key="p">
              <button
                v-if="p === 1 || p === pages || (p >= page - 1 && p <= page + 1)"
                @click="cambiarPagina(p)"
                :class="[
                  'min-w-[28px] h-7 text-xs font-medium rounded transition-colors',
                  p === page 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                {{ p }}
              </button>
              <span 
                v-else-if="p === 2 || p === pages - 1" 
                class="px-1 text-gray-400"
              >...</span>
            </template>
          </div>
          <button 
            @click="cambiarPagina(page + 1)" 
            :disabled="page === pages"
            class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
