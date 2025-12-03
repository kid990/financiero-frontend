<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { 
  LayoutDashboard, 
  FileText, 
  FilePlus, 
  List, 
  ClipboardList,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(true);
const mobileSidebarOpen = ref(false);
const solicitudMenuOpen = ref(true);
const isMobile = ref(false);
const perfilMenuOpen = ref(false);

// Computed para detectar ruta activa
const isActive = computed(() => (path: string) => {
  return route.path === path;
});

const isSolicitudActive = computed(() => {
  return route.path.startsWith('/dashboard/solicitud');
});

const datosUsuario = ref({
  nombre: '',
  apellido: '',
  email: '',
  rol: ''
});

const cargarUsuario = () => {
  const usuario = localStorage.getItem('datosUsuario');
  if (usuario) datosUsuario.value = JSON.parse(usuario);
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    sidebarOpen.value = false;
  }
};

onMounted(() => {
  cargarUsuario();
  checkMobile();
  window.addEventListener('resize', checkMobile);
  document.addEventListener('click', cerrarMenuPerfil);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('click', cerrarMenuPerfil);
});

const toggleSidebar = () => {
  if (isMobile.value) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value;
  } else {
    sidebarOpen.value = !sidebarOpen.value;
  }
};

const toggleSolicitudMenu = () => {
  solicitudMenuOpen.value = !solicitudMenuOpen.value;
};

const navegarA = (ruta: string) => {
  router.push(ruta);
  if (isMobile.value) {
    mobileSidebarOpen.value = false;
  }
  perfilMenuOpen.value = false;
};

const cerrarMenuPerfil = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.perfil-menu')) {
    perfilMenuOpen.value = false;
  }
};

const cerrarSesion = () => {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Deseas cerrar tu sesión?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('datosUsuario');
      localStorage.removeItem('datosCliente');
      localStorage.removeItem('pasoActual');
      router.push('/login');
    }
  });
};
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Overlay móvil -->
    <div 
      v-if="isMobile && mobileSidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="mobileSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-slate-800 text-white transition-all duration-300 flex flex-col z-50',
        isMobile ? 'fixed h-full' : 'relative',
        isMobile ? (mobileSidebarOpen ? 'w-64 left-0' : '-left-64 w-64') : (sidebarOpen ? 'w-56' : 'w-14')
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between p-3 border-b border-slate-700">
        <span v-if="sidebarOpen || mobileSidebarOpen" class="text-base font-bold">FinCredit</span>
        <button @click="toggleSidebar" class="p-1 rounded hover:bg-slate-700">
          <Menu v-if="!sidebarOpen && !mobileSidebarOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 p-3 space-y-1">
        <!-- Dashboard -->
        <button
          @click="navegarA('/dashboard')"
          class="flex items-center w-full p-2 rounded-lg transition-colors text-sm"
          :class="[
            isActive('/dashboard') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700',
            { 'justify-center': !sidebarOpen && !isMobile }
          ]"
        >
          <LayoutDashboard class="w-4 h-4" />
          <span v-if="sidebarOpen || mobileSidebarOpen" class="ml-2">Dashboard</span>
        </button>

        <!-- Solicitud con submenu -->
        <div>
          <button
            @click="toggleSolicitudMenu"
            class="flex items-center w-full p-2 rounded-lg transition-colors text-sm"
            :class="[
              isSolicitudActive ? 'bg-slate-700' : 'hover:bg-slate-700',
              { 'justify-center': !sidebarOpen && !isMobile }
            ]"
          >
            <FileText class="w-4 h-4 flex-shrink-0" />
            <span v-if="sidebarOpen || mobileSidebarOpen" class="ml-2 flex-1 text-left">Solicitud</span>
            <ChevronDown v-if="(sidebarOpen || mobileSidebarOpen) && solicitudMenuOpen" class="w-4 h-4 flex-shrink-0" />
            <ChevronRight v-if="(sidebarOpen || mobileSidebarOpen) && !solicitudMenuOpen" class="w-4 h-4 flex-shrink-0" />
          </button>
          
          <!-- Submenu -->
          <div v-if="(sidebarOpen || mobileSidebarOpen) && solicitudMenuOpen" class="ml-4 mt-1 space-y-1">
            <button
              @click="navegarA('/dashboard/solicitud/nueva')"
              class="flex items-center w-full p-2 rounded-lg transition-colors text-sm"
              :class="isActive('/dashboard/solicitud/nueva') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'"
            >
              <FilePlus class="w-4 h-4 flex-shrink-0" />
              <span class="ml-2">Nueva</span>
            </button>
            <button
              @click="navegarA('/dashboard/solicitud/registros')"
              class="flex items-center w-full p-2 rounded-lg transition-colors text-sm"
              :class="isActive('/dashboard/solicitud/registros') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'"
            >
              <List class="w-4 h-4 flex-shrink-0" />
              <span class="ml-2">Registros</span>
            </button>
          </div>
        </div>

        <!-- Resultados -->
        <button
          @click="navegarA('/dashboard/resultados')"
          class="flex items-center w-full p-2 rounded-lg transition-colors text-sm"
          :class="[
            isActive('/dashboard/resultados') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700',
            { 'justify-center': !sidebarOpen && !isMobile }
          ]"
        >
          <ClipboardList class="w-4 h-4" />
          <span v-if="sidebarOpen || mobileSidebarOpen" class="ml-2">Resultados</span>
        </button>
      </nav>

      <!-- Usuario -->
      <div class="p-3 border-t border-slate-700 relative">
        <!-- Perfil expandido -->
        <div v-if="sidebarOpen || mobileSidebarOpen" class="relative">
          <button
            @click.stop="perfilMenuOpen = !perfilMenuOpen"
            class="flex items-center w-full p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <div class="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <User class="w-4 h-4" />
            </div>
            <div class="ml-2 text-left">
              <p class="text-xs font-medium">{{ datosUsuario.nombre }} {{ datosUsuario.apellido }}</p>
              <p class="text-xs text-slate-400">{{ datosUsuario.rol }}</p>
            </div>
          </button>
          
          <!-- Menu desplegable expandido -->
          <div 
            v-if="perfilMenuOpen" 
            class="absolute bottom-full left-0 mb-2 w-full bg-slate-700 rounded-lg shadow-lg py-2 z-50"
          >
            <button
              @click="cerrarSesion"
              class="flex items-center w-full px-3 py-2 hover:bg-red-600 transition-colors text-sm"
            >
              <LogOut class="w-4 h-4" />
              <span class="ml-2">Cerrar sesion</span>
            </button>
          </div>
        </div>
        
        <!-- Perfil colapsado (solo icono) -->
        <div v-else class="relative">
          <button
            @click.stop="perfilMenuOpen = !perfilMenuOpen"
            class="flex items-center justify-center w-full p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <User class="w-4 h-4" />
          </button>
          
          <!-- Menu desplegable colapsado -->
          <div 
            v-if="perfilMenuOpen" 
            class="absolute bottom-full left-full ml-2 mb-2 bg-slate-700 rounded-lg shadow-lg py-2 min-w-40 z-50"
          >
            <div class="px-3 py-2 border-b border-slate-600">
              <p class="text-xs font-medium">{{ datosUsuario.nombre }} {{ datosUsuario.apellido }}</p>
              <p class="text-xs text-slate-400">{{ datosUsuario.rol }}</p>
            </div>
            <button
              @click="cerrarSesion"
              class="flex items-center w-full px-3 py-2 hover:bg-red-600 transition-colors text-sm"
            >
              <LogOut class="w-4 h-4" />
              <span class="ml-2">Cerrar sesion</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header móvil -->
      <header v-if="isMobile" class="bg-white shadow-sm p-3 flex items-center">
        <button @click="toggleSidebar" class="p-1 rounded hover:bg-gray-100">
          <Menu class="w-5 h-5" />
        </button>
        <span class="ml-3 font-semibold text-sm">FinCredit</span>
      </header>
      
      <main class="flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
