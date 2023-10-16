<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();

function backHome() {
  router.push('/');
}
</script>

<template>
  <main>
    <h1>Page not found...</h1>
    <button @click="backHome()">Back To Home</button>
  </main>
</template>

<style scoped>
main {
  display: grid;
  place-content: center;
}

h1 {
  font-size: 3.5rem;
  color: var(--clr-snow-white);
  width: 100%;
  text-align: center;
}

button {
  background-color: var(--clr-orange);
  color: var(--clr-snow-white);
  font-size: 20px;
  font-weight: bold;
  display: block;
  padding: 0.5rem 1rem;
  margin-inline: auto;
  margin-block: 1.5rem;
}
</style>
