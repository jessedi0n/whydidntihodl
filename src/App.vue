<template>
  <div class="min-h-screen bg-indigo-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col items-center relative">
    <div class="absolute top-4 right-4">
      <DarkModeToggle />
    </div>
    <Calculator />
  </div>
</template>

<script setup lang="js">
import Calculator from "./components/Calculator.vue";
import DarkModeToggle from "./components/DarkModeToggle.vue";
</script>
