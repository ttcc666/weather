<template>
  <WeatherApp />
</template>

<script setup lang="ts">
import WeatherApp from './components/WeatherApp.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
}
</style>