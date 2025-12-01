<template>
  <div class="w-full max-w-md">
            <!-- Logo/Título -->
            <div class="text-center mb-8">
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">
                Crear Cuenta
              </h1>
              <p class="text-gray-600 mt-2">Únete a nosotros hoy mismo</p>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="handleRegister">
              <!-- GRID DE DOS COLUMNAS -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nombre -->
                <div>
                  <label
                    for="nombre"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User class="w-5 h-5" />
                    </span>
                    <input
                      id="nombre"
                      v-model="form.nombre"
                      type="text"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <!-- Apellido -->
                <div>
                  <label
                    for="apellido"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Apellido
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User class="w-5 h-5" />
                    </span>
                    <input
                      id="apellido"
                      v-model="form.apellido"
                      type="text"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Correo Electrónico
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail class="w-5 h-5" />
                    </span>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <!-- Teléfono -->
                <div>
                  <label
                    for="telefono"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono (Opcional)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone class="w-5 h-5" />
                    </span>
                    <input
                      id="telefono"
                      v-model="form.telefono"
                      type="tel"
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <!-- Contraseña -->
                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contraseña
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock class="w-5 h-5" />
                    </span>
                    <input
                      id="password"
                      v-model="form.password"
                      type="password"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <!-- Confirmar Contraseña -->
                <div>
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmar Contraseña
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock class="w-5 h-5" />
                    </span>
                    <input
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      type="password"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              <!-- Aceptar términos -->
              <div class="flex items-center my-6">
                <input
                  v-model="form.acceptTerms"
                  type="checkbox"
                  required
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-600">
                  Acepto los
                  <a
                    href="#"
                    class="text-blue-600 hover:text-blue-800 font-semibold transition duration-200"
                    >términos y condiciones</a
                  >
                </span>
              </div>

              <!-- Mensajes -->
              <div
                v-if="error"
                class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
              >
                {{ error }}
              </div>
              <div
                v-if="success"
                class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
              >
                {{ success }}
              </div>

              <!-- Botón Registro -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Crear Cuenta</span>
                <span v-else>Registrando...</span>
              </button>
            </form>

            <!-- Separador -->
            <div class="my-6 flex items-center">
              <div class="flex-1 border-t border-gray-300"></div>
              <span class="px-4 text-sm text-gray-500">O</span>
              <div class="flex-1 border-t border-gray-300"></div>
            </div>

            <!-- Login -->
            <div class="text-center">
              <p class="text-gray-600">
                ¿Ya tienes cuenta?
                <router-link
                  to="/login"
                  class="text-blue-600 font-semibold hover:text-blue-800 transition duration-200"
                >
                  Inicia sesión aquí
                </router-link>
              </p>
            </div>
  </div>
</template>



<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { User, Mail, Phone, Lock } from 'lucide-vue-next';

const router = useRouter();

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const loading = ref(false);
const error = ref('');
const success = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  // Validación de contraseñas
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden';
    loading.value = false;
    return;
  }

  try {
    // Realizamos la solicitud POST con Axios
    const response = await axios.post('http://127.0.0.1:8000/register', {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      email: form.value.email,
      telefono: form.value.telefono,
      password: form.value.password,
      rol: 'usuario', // O el rol que desees por defecto
    });

      console.log('📩 Respuesta del backend:', response.data);

    if (response.data.success) {
      success.value = '¡Registro exitoso! Redirigiendo...';
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      error.value = response.data.message || 'Error al registrar el usuario';
    }
  } catch (err) {
    error.value = 'Error de conexión. Por favor, intenta nuevamente.';
    console.error('Registro error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estilo adicional si es necesario */
</style>
