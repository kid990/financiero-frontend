<script setup lang="ts">
import { ref } from 'vue';
import { DollarSign, User, ChevronDown, LogOut, Settings } from 'lucide-vue-next';

const props = defineProps<{
  datosUsuario: {
    nombre?: string
    apellido?: string
    email?: string
    rol?: string
  }
}>();

const menuAbierto = ref(false);

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value;
};

const cerrarMenu = () => {
  menuAbierto.value = false;
};
</script>

<template>
  <header class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-20">
    <div class="mx-auto py-2 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Marca -->
        <div class="flex items-center gap-3">
          <div class="bg-white rounded-lg p-2">
            <DollarSign :size="28" class="text-blue-900" :stroke-width="2.5" />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-white text-xl font-bold">Evaluar Préstamos</h1>
            <p class="text-blue-200 text-xs">Sistema de evaluación crediticia</p>
          </div>
          <h1 class="sm:hidden text-white text-lg font-bold">Préstamos</h1>
        </div>

        <!-- Usuario con dropdown -->
        <div class="relative">
          <button
              @click="toggleMenu"
              class="flex items-center gap-2 bg-blue-800/50 hover:bg-blue-800 rounded-lg px-3 py-2 transition-colors"
          >
            <div class="bg-blue-700 rounded-full p-1.5">
              <User :size="20" class="text-white" />
            </div>
            <div v-if="datosUsuario?.nombre" class="hidden md:block text-left">
              <p class="text-white text-sm font-medium">
                {{ datosUsuario.nombre }} {{ datosUsuario.apellido }}
              </p>
              <p class="text-blue-200 text-xs">{{ datosUsuario.rol }}</p>
            </div>
            <ChevronDown
                :size="16"
                class="text-white transition-transform"
                :class="{ 'rotate-180': menuAbierto }"
            />
          </button>

          <!-- Dropdown Menu -->
          <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
          >
            <div
                v-if="menuAbierto"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50"
                @click="cerrarMenu"
            >
              <!-- Info del usuario en móvil -->
              <div class="md:hidden px-4 py-3 border-b border-gray-200">
                <p class="text-gray-900 text-sm font-medium">
                  {{ datosUsuario?.nombre }} {{ datosUsuario?.apellido }}
                </p>
                <p class="text-gray-500 text-xs">{{ datosUsuario?.email }}</p>
                <p class="text-blue-600 text-xs mt-1">{{ datosUsuario?.rol }}</p>
              </div>

              <!-- Opciones del menú -->
              <button
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings :size="18" />
                <span>Configuración</span>
              </button>

              <button
                  @click="$emit('cerrar-sesion')"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut :size="18" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar el menú al hacer clic fuera -->
    <div
        v-if="menuAbierto"
        @click="cerrarMenu"
        class="fixed inset-0 z-40"
    ></div>
  </header>
</template>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}
</style>