<script setup>
import { ref, onMounted } from "vue";
import { 
  CreditCard, 
  Calendar, 
  Heart, 
  Users, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Home, 
  FileText, 
  Banknote,
  CalendarDays
} from "lucide-vue-next";
import axios from 'axios';
import FormHeader from './FormHeader.vue';
import InputField from '../ui/InputField.vue';
import SelectField from '../ui/SelectField.vue';

const API_URL = "https://api-financiero.onrender.com";

const emit = defineEmits(['update:datosCliente', 'update:pasoActual', 'update:resultado', 'reiniciar']);

// Estado del formulario
const formulario = ref({
  dni: '',
  edad: null,
  tipo_prestamo: '',
  monto_prestamo: null,
  meses: null,
  tipo_empleo: '',
  ingreso_mensual: null,
  present_emp_since: null,
  estado_civil: '',
  dependientes: null,
  vivienda: ''
});

// Datos del cliente obtenidos del DNI
const datosCliente = ref({
  nombre: '',
  deuda_mensual: 0,
  puntaje_credito: 0,
  estado_credito: 'nuevo'
});

const resultado = ref(null);
const isLoading = ref(false);
const errores = ref({});
const mensajeExito = ref('');
const dniValidado = ref(false);

// Opciones para selects
const opcionesTipoPrestamo = ['hipotecario', 'personal', 'vehicular'];
const opcionesEstadoCivil = ['soltero', 'casado', 'divorciado', 'viudo'];
const opcionesTipoEmpleo = ['desempleado', 'independiente', 'permanente', 'temporal'];
const opcionesVivienda = ['propia', 'alquilada', 'familiar'];
const opcionesMeses = [6, 12, 18, 24, 36, 48, 60];
const opcionesMesesFormateado = opcionesMeses.map(m => ({ value: m, label: `${m} meses` }));

// Validar DNI
async function validarDNI() {
  if (!formulario.value.dni || formulario.value.dni.length !== 8) {
    errores.value.dni = 'El DNI debe tener 8 dígitos';
    return;
  }

  isLoading.value = true;
  errores.value.dni = '';

  try {
    const response = await axios.post(`${API_URL}/consultar-cliente`, {
      dni: formulario.value.dni
    });

    const data = response.data;

    if (data.encontrado) {
      datosCliente.value = {
        nombre: data.nombre,
        deuda_mensual: data.deuda_mensual,
        puntaje_credito: data.puntaje_credito,
        estado_credito: data.estado_credito
      };
      dniValidado.value = true;
      mensajeExito.value = `Cliente encontrado: ${data.nombre}`;
      
      // Emitir datos al InfoPanel
      emit('update:datosCliente', {
        dni: formulario.value.dni,
        nombre: data.nombre,
        deuda_mensual: data.deuda_mensual,
        puntaje_credito: data.puntaje_credito,
        estado_credito: data.estado_credito
      });
    } else {
      errores.value.dni = data.mensaje || 'DNI no encontrado';
      dniValidado.value = false;
    }
  } catch (error) {
    errores.value.dni = 'Error al validar DNI';
    dniValidado.value = false;
  } finally {
    isLoading.value = false;
  }
}

// Validar formulario completo
function validarFormulario() {
  errores.value = {};

  if (!dniValidado.value) {
    errores.value.dni = 'Debes validar el DNI primero';
    return false;
  }

  if (!formulario.value.edad || formulario.value.edad < 18 || formulario.value.edad > 75) {
    errores.value.edad = 'La edad debe estar entre 18 y 75 años';
    return false;
  }

  if (!formulario.value.tipo_prestamo) {
    errores.value.tipo_prestamo = 'Selecciona un tipo de préstamo';
    return false;
  }

  if (!formulario.value.monto_prestamo || formulario.value.monto_prestamo <= 0) {
    errores.value.monto_prestamo = 'Ingresa un monto válido';
    return false;
  }

  if (!formulario.value.meses) {
    errores.value.meses = 'Selecciona un plazo';
    return false;
  }

  if (!formulario.value.tipo_empleo) {
    errores.value.tipo_empleo = 'Selecciona un tipo de empleo';
    return false;
  }

  if (!formulario.value.ingreso_mensual || formulario.value.ingreso_mensual <= 0) {
    errores.value.ingreso_mensual = 'Ingresa un ingreso válido';
    return false;
  }

  if (formulario.value.present_emp_since === null || formulario.value.present_emp_since < 0 || formulario.value.present_emp_since > 12) {
    errores.value.present_emp_since = 'Los años deben estar entre 0 y 12';
    return false;
  }

  if (!formulario.value.estado_civil) {
    errores.value.estado_civil = 'Selecciona un estado civil';
    return false;
  }

  if (formulario.value.dependientes === null || formulario.value.dependientes < 0 || formulario.value.dependientes > 10) {
    errores.value.dependientes = 'Los dependientes deben estar entre 0 y 10';
    return false;
  }

  if (!formulario.value.vivienda) {
    errores.value.vivienda = 'Selecciona un tipo de vivienda';
    return false;
  }

  return true;
}

// Enviar formulario
async function enviarFormulario() {
  if (!validarFormulario()) return;

  isLoading.value = true;

  try {
    const datosEvaluacion = {
      dni: formulario.value.dni,
      ingreso_mensual: formulario.value.ingreso_mensual,
      deuda_mensual: datosCliente.value.deuda_mensual,
      puntaje_credito: datosCliente.value.puntaje_credito,
      monto_prestamo: formulario.value.monto_prestamo,
      meses: formulario.value.meses,
      tipo_prestamo: formulario.value.tipo_prestamo,
      estado_credito: datosCliente.value.estado_credito,
      estado_civil: formulario.value.estado_civil,
      edad: formulario.value.edad,
      tipo_empleo: formulario.value.tipo_empleo,
      vivienda: formulario.value.vivienda,
      present_emp_since: formulario.value.present_emp_since,
      dependientes: formulario.value.dependientes
    };

    emit('update:datosCliente', datosEvaluacion);

    const response = await axios.post(`${API_URL}/evaluar-credito`, datosEvaluacion);
    resultado.value = response.data;
    emit('update:resultado', response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      errores.value.general = error.response.data.detail;
    } else {
      errores.value.general = 'Error al procesar la solicitud';
    }
  } finally {
    isLoading.value = false;
  }
}

function reiniciar() {
  formulario.value = {
    dni: '',
    edad: null,
    tipo_prestamo: '',
    monto_prestamo: null,
    meses: null,
    tipo_empleo: '',
    ingreso_mensual: null,
    present_emp_since: null,
    estado_civil: '',
    dependientes: null,
    vivienda: ''
  };
  datosCliente.value = {
    nombre: '',
    deuda_mensual: 0,
    puntaje_credito: 0,
    estado_credito: 'nuevo'
  };
  resultado.value = null;
  errores.value = {};
  mensajeExito.value = '';
  dniValidado.value = false;
  emit('update:datosCliente', {});
  emit('update:resultado', null);
  emit('update:pasoActual', 0);
  emit('reiniciar');
}

onMounted(() => {
  reiniciar();
});
</script>

<template>
  <div class="h-full bg-white flex flex-col">
    <!-- ENCABEZADO -->
    <FormHeader 
      :resultado="resultado" 
      :dniValidado="dniValidado" 
      @reiniciar="reiniciar" 
    />

    <!-- FORMULARIO -->
    <div class="flex-1 overflow-y-auto p-4 bg-gray-50 flex items-center justify-center">
      <form @submit.prevent="enviarFormulario">
        
        <!-- Error general -->
        <div v-if="errores.general" class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-3 text-sm">
          {{ errores.general }}
        </div>

        <!-- Grid que se ajusta automaticamente -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-6 w-fit mx-auto">
          
          <!-- DNI (campo especial con boton) -->
          <div class="w-[400px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <CreditCard :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="formulario.dni"
                  type="text"
                  maxlength="8"
                  class="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': errores.dni, 'border-green-500': dniValidado }"
                  :disabled="dniValidado"
                />
              </div>
              <button
                type="button"
                @click="validarDNI"
                :disabled="isLoading || dniValidado"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                {{ dniValidado ? 'OK' : 'Validar' }}
              </button>
            </div>
            <p v-if="errores.dni" class="text-red-500 text-xs mt-1">{{ errores.dni }}</p>
            <p v-if="mensajeExito" class="text-green-600 text-xs mt-1">{{ mensajeExito }}</p>
          </div>

          <!-- Campos con InputField -->
          <InputField v-model="formulario.edad" label="Edad" type="number" :icon="Calendar" :error="errores.edad" :min="18" :max="75" :disabled="!dniValidado" />
          <InputField v-model="formulario.dependientes" label="Dependientes" type="number" :icon="Users" :error="errores.dependientes" :min="0" :max="10" :disabled="!dniValidado" />
          <InputField v-model="formulario.ingreso_mensual" label="Ingreso Mensual (S/)" type="number" :icon="DollarSign" :error="errores.ingreso_mensual" :min="0" :step="100" :disabled="!dniValidado" />
          <InputField v-model="formulario.present_emp_since" label="Anos en Empleo" type="number" :icon="Clock" :error="errores.present_emp_since" :min="0" :max="12" :disabled="!dniValidado" />
          <InputField v-model="formulario.monto_prestamo" label="Monto Solicitado (S/)" type="number" :icon="Banknote" :error="errores.monto_prestamo" :min="1000" :step="1000" :disabled="!dniValidado" />

          <!-- Campos con SelectField -->
          <SelectField v-model="formulario.estado_civil" label="Estado Civil" :options="opcionesEstadoCivil" :icon="Heart" :error="errores.estado_civil" :disabled="!dniValidado" />
          <SelectField v-model="formulario.tipo_empleo" label="Tipo Empleo" :options="opcionesTipoEmpleo" :icon="Briefcase" :error="errores.tipo_empleo" :disabled="!dniValidado" />
          <SelectField v-model="formulario.vivienda" label="Vivienda" :options="opcionesVivienda" :icon="Home" :error="errores.vivienda" :disabled="!dniValidado" />
          <SelectField v-model="formulario.tipo_prestamo" label="Tipo Prestamo" :options="opcionesTipoPrestamo" :icon="FileText" :error="errores.tipo_prestamo" :disabled="!dniValidado" />
          <SelectField v-model="formulario.meses" label="Plazo (meses)" :options="opcionesMesesFormateado" :icon="CalendarDays" :error="errores.meses" valueKey="value" labelKey="label" :disabled="!dniValidado" />

        </div>
        
        <!-- Botones fuera del grid -->
        <div class="flex gap-2 mt-4 ">
          <button
            type="submit"
            :disabled="isLoading || !dniValidado"
            class="bg-blue-900 hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            {{ isLoading ? 'Evaluando...' : 'Evaluar' }}
          </button>
          <button
            type="button"
            @click="reiniciar"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Limpiar
          </button>
        </div>
        
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>