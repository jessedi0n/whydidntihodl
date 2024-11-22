<template>
  <div class="min-h-screen bg-indigo-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col items-center">
    <Header />
    <Calculator />
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Calculator from "./components/Calculator.vue";
</script>
