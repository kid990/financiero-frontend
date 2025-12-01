<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Header from './Header.vue';
import InfoPanel from './panel/InfoPanel.vue';
import FormularioCredito from './formulario/FormularioCredito.vue';

const router = useRouter();

// Estado del USUARIO (para el header)
const datosUsuario = ref({
  nombre: '',
  apellido: '',
  email: '',
  rol: ''
});

// Estado del CLIENTE (para el flujo de evaluación)
const datosCliente = ref({});
const resultado = ref(null);
const pasoActual = ref(0);
const totalPasos = 10;

// Cargar datos desde localStorage
const cargarDesdeLocalStorage = () => {
  const usuario = localStorage.getItem('datosUsuario');
  if (usuario) datosUsuario.value = JSON.parse(usuario);

  const cliente = localStorage.getItem('datosCliente');
  if (cliente) datosCliente.value = JSON.parse(cliente);

  const paso = localStorage.getItem('pasoActual');
  if (paso) pasoActual.value = parseInt(paso, 10);
};

// Sincronizar cambios entre pestañas
const sincronizarStorage = (e: StorageEvent) => {
  if (e.key === 'token' && !localStorage.getItem('token')) {
    router.push('/login');
  }
  if (['datosUsuario', 'datosCliente', 'pasoActual'].includes(e.key || '')) {
    cargarDesdeLocalStorage();
  }
};

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  cargarDesdeLocalStorage();
  window.addEventListener('storage', sincronizarStorage);
});

onUnmounted(() => {
  window.removeEventListener('storage', sincronizarStorage);
});

// Actualizar datos del cliente
const actualizarDatos = (datos: Record<string, any>) => {
  datosCliente.value = datos;
  localStorage.setItem('datosCliente', JSON.stringify(datos));
};

// Actualizar resultado de evaluación
const actualizarResultado = (res: any) => {
  resultado.value = res;
};

// Actualizar paso actual
const actualizarPaso = (paso: number) => {
  pasoActual.value = paso;
  localStorage.setItem('pasoActual', paso.toString());
};

// Reiniciar evaluación
const reiniciarEvaluacion = () => {
  datosCliente.value = {};
  resultado.value = null;
  pasoActual.value = 0;
  localStorage.removeItem('datosCliente');
  localStorage.removeItem('pasoActual');
};

// Cerrar sesión con confirmación
const cerrarSesion = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas cerrar tu sesión?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
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
  <div class="bg-gray-100 lg:flex lg:flex-col lg:h-screen">
    <Header
      :datos-usuario="datosUsuario"
      @cerrar-sesion="cerrarSesion"
    />

    <div class="lg:flex lg:flex-1 lg:overflow-hidden">
      <!-- Formulario de Crédito (Izquierda - 75%) -->
      <section class="flex flex-col w-full min-h-screen border-b border-gray-300 lg:min-h-0 lg:w-[75%] lg:border-b-0 lg:border-r">
        <FormularioCredito
          @update:datos-cliente="actualizarDatos"
          @update:resultado="actualizarResultado"
          @update:paso-actual="actualizarPaso"
          @reiniciar="reiniciarEvaluacion"
        />
      </section>

      <!-- Info Panel Section (Derecha - 25%) -->
      <section class="w-full lg:w-[25%] lg:overflow-y-auto">
        <InfoPanel
          :datos-cliente="datosCliente"
          :resultado="resultado"
        />
      </section>
    </div>
  </div>
</template>
