<script setup>
import { ref } from 'vue';

const startTime = ref(0); // Initial TimeStamp
const elapsedTime = ref(0); // Chrono Time
const pausedTime = 5; // pauseChrono after 5s
const isGameActive = ref(false); // = endTime
let intervalId = null;
let pauseTimestamp = null;

function startChrono() {
  if (isGameActive.value) {
    return;
  }
  isGameActive.value = true;
  if (pauseTimestamp) {
    startTime.value += Date.now() - pauseTimestamp;
    pauseTimestamp = null;
  } else {
    startTime.value = Date.now();
  }
  updateChrono();
}

function pauseChrono() {
  if (isGameActive.value) {
    clearInterval(intervalId);
    pauseTimestamp = Date.now();
  } else {
    startTime.value += Date.now() - pauseTimestamp;
    pauseTimestamp = null;
    updateChrono();
  }
  isGameActive.value = !isGameActive.value;
}

function updateChrono() {
  intervalId = setInterval(() => {
    if (isGameActive.value) {
      const currentTime = Date.now();
      elapsedTime.value = Math.floor((currentTime - startTime.value) / 1000);
      if (elapsedTime.value === pausedTime) {
        pauseChrono();
      }
    }
  }, 1000);
}

function formatTime(seconds) {
  if (seconds < 0 || seconds > 3600) {
    return '';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) {
    return `${remainingSeconds} s`;
  } else {
    return `${minutes} min ${remainingSeconds} s`;
  }
}

function resetChrono() {
  isGameActive.value = false;
  startTime.value = 0;
  pauseTimestamp = null;
  elapsedTime.value = 0;
  clearInterval(intervalId);
}
</script>

<template>
  <main class="flex-align">
    <h1>
      Time:<span>{{ formatTime(elapsedTime) }}</span>
    </h1>
    <button @click="startChrono()">Start</button>
    <button @click="pauseChrono()">Pause</button>
    <button @click="resetChrono()">Reset</button>
  </main>
</template>

<style scoped>
main {
  background-color: lightslategray;
  padding: 5rem;
}
button {
  font-weight: bold;
  font-size: 18px;
  padding: 0.2rem 1rem;
  margin-right: 1rem;
  margin-block: 1rem 0;
  cursor: pointer;
}
span {
  color: rgb(2, 255, 120);
  margin-left: 1rem;
}
</style>
