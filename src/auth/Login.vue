<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Mail, Lock } from "lucide-vue-next";

const router = useRouter();

const form = ref({
  email: "",
  password: "",
  remember: false,
});

const loading = ref(false);
const error = ref("");
const success = ref("");
const showPassword = ref(false);

// Verificar si ya hay un token y redirigir a Evaluación si el usuario está autenticado
onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/evaluacion");
  }
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";

  

  try {
    const response = await axios.post("https://api-financiero.onrender.com/login", {
      email: form.value.email,
      password: form.value.password,
      remember: form.value.remember,
    });

    if (response.data.token) {
      success.value = "¡Inicio de sesión exitoso! Redirigiendo...";

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "datosUsuario",
        JSON.stringify({
          nombre: response.data.usuario.nombre,
          apellido: response.data.usuario.apellido,
          email: response.data.usuario.email,
          rol: response.data.usuario.rol,
        })
      );

      if (form.value.remember) {
        localStorage.setItem("remember", "true");
      }

      setTimeout(() => {
        router.push("/evaluacion");
      }, 1000);
    } else {
      error.value = response.data.message || "Credenciales incorrectas";
    }
  } catch (err) {
    error.value = "Error de conexión. Por favor, intenta nuevamente.";
    console.error("Login error:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md">
            <!-- Logo/Título -->
            <div class="text-center mb-8">
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">
                Iniciar Sesión
              </h1>
              <p class="text-gray-600 mt-2">Bienvenido de nuevo</p>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="handleLogin">
              <!-- Email -->
              <div class="mb-4">
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

              <!-- Contraseña -->
              <div class="mb-4">
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
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                  <button
                    type="button"
                    @click="togglePassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <!-- Icono Ojo Abierto -->
                    <svg
                      v-if="!showPassword"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <!-- Icono Ojo Cerrado -->
                    <svg
                      v-else
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Recordar sesión y Olvidé contraseña -->
              <div class="flex items-center justify-between mb-6">
                <label class="flex items-center">
                  <input
                    v-model="form.remember"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <a
                  href="#"
                  class="text-sm text-blue-600 hover:text-blue-800 font-semibold transition duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <!-- Mensaje de error -->
              <div
                v-if="error"
                class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
              >
                {{ error }}
              </div>

              <!-- Mensaje de éxito -->
              <div
                v-if="success"
                class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
              >
                {{ success }}
              </div>

              <!-- Botón Iniciar Sesión -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Iniciar Sesión</span>
                <span v-else>Iniciando sesión...</span>
              </button>
            </form>

            <!-- Separador -->
            <div class="my-6 flex items-center">
              <div class="flex-1 border-t border-gray-300"></div>
              <span class="px-4 text-sm text-gray-500">O</span>
              <div class="flex-1 border-t border-gray-300"></div>
            </div>

            <!-- Registro -->
            <div class="text-center">
              <p class="text-gray-600">
                ¿No tienes una cuenta?
                <router-link
                  to="/register"
                  class="text-blue-600 font-semibold hover:text-blue-800 transition duration-200"
                >
                  Regístrate aquí
                </router-link>
              </p>
            </div>
  </div>
</template>

<style scoped>
/* Estilo adicional si es necesario */
</style>
