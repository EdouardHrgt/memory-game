<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import victorySound from '../assets/audio/victory.wav';

const route = useRoute();
const router = useRouter();
function playSound(music) {
  const audio = new Audio(music);
  audio.play();
}

onMounted(() => {
  // Récup les params et display les infos
});
</script>

<template>
  <h1>RECAP</h1>
</template>

<style scoped>
h1 {
  color: white;
  padding: 2rem 3rem;
}
</style>
