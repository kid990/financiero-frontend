
     <template>
       <div
         class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600"
       >
         <div class="w-full lg:h-screen flex">
           <div class="grid lg:grid-cols-2 gap-0 bg-white w-full lg:overflow-hidden">
             <!-- Columna 1: Imagen de Fondo con Descripción (Oculta en móviles) -->
             <div
               class="hidden lg:flex lg:flex-col justify-center items-center p-12 relative overflow-hidden bg-cover bg-center"
               style="
                 background-image: 
   url('https://itusers.today/wp-content/uploads/2024/11/evaluacion-crediticia-es-rapida-y-precisa-en-peru-gracias-a-la-ia.webp');
               "
             >
               <div class="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/50 to-cyan-900/60"></div>
               <div class="absolute inset-0 opacity-10">
                 <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                 <div class="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
               </div>
               <div class="relative z-10 text-center text-white">
                 <div class="space-y-4">
                   <h2 class="text-4xl font-bold leading-tight">Evaluación Crediticia Inteligente</h2>
                   <p class="text-lg text-blue-100 leading-relaxed max-w-md mx-auto">
                     Nuestra IA analiza tu perfil financiero en tiempo real para ofrecerte las mejores opciones de crédito personalizadas.     
                   </p>
                   <div class="mt-8 space-y-3 text-left max-w-md mx-auto">
                     <div class="flex items-center space-x-3">
                       <svg class="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707        
   9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                       </svg>
                       <span class="text-blue-100">Evaluación instantánea con IA</span>
                     </div>
                     <div class="flex items-center space-x-3">
                       <svg class="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707        
   9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                       </svg>
                       <span class="text-blue-100">Análisis predictivo de riesgo</span>
                     </div>
                     <div class="flex items-center space-x-3">
                       <svg class="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707        
   9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                       </svg>
                       <span class="text-blue-100">Decisiones precisas y automatizadas</span>
                     </div>
                     <div class="flex items-center space-x-3">
                       <svg class="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                         <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707        
   9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                       </svg>
                       <span class="text-blue-100">100% seguro y confidencial</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <!-- Columna 2: Contenido dinámico (Login/Register) -->
             <div class="flex items-center justify-center p-8 lg:p-12 min-h-screen lg:min-h-0 overflow-y-auto">
               <router-view v-slot="{ Component }">
                 <transition name="fade-slide" mode="out-in">
                   <component :is="Component" />
                 </transition>
               </router-view>
             </div>
           </div>
         </div>
       </div>
     </template>

     <script setup>
     </script>

     <style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
     </style>