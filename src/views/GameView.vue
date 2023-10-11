<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { animals } from '../composables/animals';
import clicSound from '../assets/audio/click.mp3';
import WinSound from '../assets/audio/win.wav';
import LooseSound from '../assets/audio/loose.mp3';

const route = useRoute();
const router = useRouter();
const settings = JSON.parse(route.query.params);
const animalsList = animals();
const grid = ref([]);

function playSound(music) {
  const audio = new Audio(music);
  audio.play();
}

function backHome() {
  router.push('/');
}

function restart() {
  hardReset();
  winningPairs.value = [];
}

function getImageUrl(name) {
  return new URL(`../assets/animals/${name}`, import.meta.url).href;
}

// Generating the numbers grid
function generateNumberGrid(x) {
  const originalArray = Array.from({ length: x + 1 }, (_, index) => index);
  const duplicatedArray = originalArray.flatMap((number) => [number, number]);
  const shuffledArray = duplicatedArray.sort(() => Math.random() - 0.5);
  return shuffledArray;
}
// Generating the animals grid
function generateAnimalGrid(x) {
  // Mélanger aléatoirement la liste des animaux
  const shuffledAnimals = animalsList.sort(() => Math.random() - 0.5);
  // Sélectionner les x premiers animaux mélangés
  const selectedAnimals = shuffledAnimals.slice(0, x);
  // Dupliquer chaque animal pour créer les paires
  const duplicatedAnimals = selectedAnimals.flatMap((animal) => [animal, { ...animal }]);
  // Mélanger à nouveau les animaux pour obtenir l'ordre aléatoire
  const shuffledValues = duplicatedAnimals.sort(() => Math.random() - 0.5);
  return shuffledValues;
}

// Define Grid Size + Theme
function generateGrid() {
  let x;
  if (settings.theme === 'numbers') {
    if (settings.grid == 0) {
      x = 7;
    } else if (settings.grid == 1) {
      x = 17;
    }
    return generateNumberGrid(x);
  }

  if (settings.theme === 'animals') {
    if (settings.grid == 0) {
      x = 8;
    } else if (settings.grid == 1) {
      x = 18;
    }
    return generateAnimalGrid(x);
  }
}

onMounted(() => {
  // Générez la grille en fonction de settings
  grid.value = generateGrid();
});

function reset() {
  // mask all buttons content (default style)
  const buttons = document.querySelectorAll('.grid-btn');
  buttons.forEach((btn) => {
    if (btn.classList.contains('validate')) {
      return;
    } else {
      btn.classList.add('hidden');
    }
  });
  clickedElements.value = [];
}

function hardReset() {
  const buttons = document.querySelectorAll('.grid-btn');
  buttons.forEach((btn) => {
    btn.classList.remove('validate');
    btn.classList.add('hidden');
  });
  clickedElements.value = [];
}

// Save clicked elements (max 2 per round)
const clickedElements = ref([]);
//Cancel the ability to clic on more than 2 button per rounds
const isClickable = ref(true);
//Stocking winning pairs
const winningPairs = ref([]);

//Counter of rounds
const counter = ref(0);

function game(event, i) {
  //Disable click if 2 elements are already clicked
  if (!isClickable.value) {
    return;
  }
  playSound(clicSound);
  event.target.classList.remove('hidden');
  let value;

  if (settings.theme === 'animals') {
    value = event.target.alt;
  } else {
    value = event.target.value;
  }

  clickedElements.value.push({ value, index: i });
  const round = clickedElements.value.length === 2;

  // If player round completed, we block clicking event, Wait 1sec and hide buttons content again then allow a new round
  if (round) {
    isClickable.value = false;
    counter.value++;
    setTimeout(() => {
      const [element1, element2] = clickedElements.value;

      if (element1.value === element2.value) {
        // If the values match, apply the "validate" class and remove the "hidden" class
        playSound(WinSound);
        winningPairs.value.push(element1.value);
        if (settings.theme === 'animals') {
          const images = document.querySelectorAll('.img-btn');
          images.forEach((img) => {
            if (img.alt === element1.value) {
              img.classList.remove('hidden');
              img.classList.add('validate');
            }
          });
        }
        const buttons = document.querySelectorAll('.grid-btn');
        buttons.forEach((btn) => {
          if (btn.value === element1.value) {
            btn.classList.remove('hidden');
            btn.classList.add('validate');
          }
        });
        reset();
      } else {
        playSound(LooseSound);
        // If the values don't match, hide the buttons again
        reset();
      }

      isClickable.value = true;
    }, 1000);
  }
}
</script>

<template>
  <main>
    <header class="commands flex-all">
      <svg width="150" height="28" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.08 21V10.64c0-1.733.287-3.053.86-3.96s1.487-1.36 2.74-1.36c.96 0 1.647.233 2.06.7.413.467.667 1.087.76 1.86.093.773.14 1.627.14 2.56V21h6.12V10.52c0-1.733.28-3.033.84-3.9.56-.867 1.453-1.3 2.68-1.3.987 0 1.693.233 2.12.7.427.467.693 1.087.8 1.86.107.773.16 1.627.16 2.56V21h6.08V8.92c0-2.693-.48-4.753-1.44-6.18C29.04 1.313 27.293.6 24.76.6c-1.387 0-2.673.28-3.86.84a7.44 7.44 0 0 0-2.94 2.48c-.453-1.093-1.153-1.92-2.1-2.48C14.913.88 13.653.6 12.08.6c-1.467 0-2.72.347-3.76 1.04-1.04.693-1.787 1.413-2.24 2.16l-.76-2.64H0V21h6.08Zm39.2.48c1.627 0 3.22-.36 4.78-1.08 1.56-.72 2.86-1.84 3.9-3.36l-4.84-1.76c-.373.427-.9.78-1.58 1.06s-1.487.42-2.42.42c-1.12 0-2.14-.347-3.06-1.04-.92-.693-1.433-1.733-1.54-3.12H55.2c.133-2.347-.2-4.42-1-6.22-.8-1.8-1.98-3.213-3.54-4.24C49.1 1.113 47.227.6 45.04.6c-1.92 0-3.687.427-5.3 1.28a10.074 10.074 0 0 0-3.88 3.6c-.973 1.547-1.46 3.373-1.46 5.48 0 2.187.46 4.067 1.38 5.64a9.228 9.228 0 0 0 3.84 3.62c1.64.84 3.527 1.26 5.66 1.26ZM49.56 9h-9.04c.187-1.36.727-2.347 1.62-2.96.893-.613 1.913-.92 3.06-.92 1.173 0 2.187.327 3.04.98.853.653 1.293 1.62 1.32 2.9Zm14.6 12V10.64c0-1.733.287-3.053.86-3.96s1.487-1.36 2.74-1.36c.96 0 1.647.233 2.06.7.413.467.667 1.087.76 1.86.093.773.14 1.627.14 2.56V21h6.12V10.52c0-1.733.28-3.033.84-3.9.56-.867 1.453-1.3 2.68-1.3.987 0 1.693.233 2.12.7.427.467.693 1.087.8 1.86.107.773.16 1.627.16 2.56V21h6.08V8.92c0-2.693-.48-4.753-1.44-6.18C87.12 1.313 85.373.6 82.84.6c-1.387 0-2.673.28-3.86.84a7.44 7.44 0 0 0-2.94 2.48c-.453-1.093-1.153-1.92-2.1-2.48C72.993.88 71.733.6 70.16.6c-1.467 0-2.72.347-3.76 1.04-1.04.693-1.787 1.413-2.24 2.16l-.76-2.64h-5.32V21h6.08Zm38.84.48c1.813 0 3.52-.373 5.12-1.12 1.6-.747 2.893-1.9 3.88-3.46.987-1.56 1.48-3.527 1.48-5.9 0-2.4-.493-4.367-1.48-5.9-.987-1.533-2.28-2.667-3.88-3.4-1.6-.733-3.307-1.1-5.12-1.1-1.84 0-3.56.367-5.16 1.1-1.6.733-2.893 1.867-3.88 3.4-.987 1.533-1.48 3.5-1.48 5.9 0 2.373.493 4.34 1.48 5.9.987 1.56 2.28 2.713 3.88 3.46 1.6.747 3.32 1.12 5.16 1.12Zm0-4.72c-1.227 0-2.253-.44-3.08-1.32-.827-.88-1.24-2.36-1.24-4.44 0-2.107.42-3.58 1.26-4.42.84-.84 1.86-1.26 3.06-1.26 1.173 0 2.18.42 3.02 1.26.84.84 1.26 2.313 1.26 4.42 0 2.08-.407 3.56-1.22 4.44-.813.88-1.833 1.32-3.06 1.32ZM122.52 21V11c0-1.573.393-2.707 1.18-3.4.787-.693 1.913-1.04 3.38-1.04.293 0 .56.007.8.02.24.013.52.047.84.1V.6c-1.52-.08-2.813.2-3.88.84-1.067.64-1.907 1.76-2.52 3.36l-1.08-3.64h-4.8V21h6.08Zm11.36 6.44c1.733 0 3.107-.187 4.12-.56 1.013-.373 1.847-1.027 2.5-1.96s1.3-2.24 1.94-3.92l7.6-19.84h-6.52l-3.8 12.4-3.88-12.4h-6.52l7.6 19.72c-.213.667-.447 1.153-.7 1.46-.253.307-.607.5-1.06.58-.453.08-1.133.12-2.04.12h-1.2v4.4h1.96Z"
          fill="#152938"
          fill-rule="nonzero"
        />
      </svg>
      <p class="error">Winning Pairs: {{ winningPairs }}</p>
      <p class="error">Rounds: {{ counter }}</p>
      <div class="btn-wrapper flex">
        <button class="restart" @click="restart()">Restart</button>
        <button class="new" @click="backHome()">New Game</button>
      </div>
    </header>
    <section>
      <div
        class="grid"
        :class="{ 'large-grid': settings.grid == 1, 'small-grid': settings.grid == 0 }"
        v-if="settings.theme === 'numbers'"
      >
        <button class="grid-btn hidden" v-for="(el, i) in grid" :key="el" :value="el" @click="game($event, i)">
          {{ el }}
        </button>
      </div>
      <div
        class="grid"
        :class="{ 'large-grid': settings.grid == 1, 'small-grid': settings.grid == 0 }"
        v-if="settings.theme === 'animals'"
      >
        <img
          class="img-btn hidden"
          v-for="(el, i) in grid"
          :key="el.id"
          :value="el.value"
          @click="game($event, i)"
          :src="getImageUrl(el.img)"
          :alt="el.value"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100dvh;
  --max-w: 1024px;
}

header {
  max-width: var(--max-w);
  margin-inline: auto;
  margin-block: 10vh 5rem;
}

.btn-wrapper {
  gap: 1rem;
}

.btn-wrapper button {
  padding: 0.7rem 2rem;
  border-radius: 6rem;
  font-size: 20px;
  font-weight: bold;
}

.restart {
  background-color: var(--clr-orange);
  color: var(--clr-snow-white);
}

.new {
  background-color: var(--clr-light-gray);
  color: var(--clr-dark-gray);
}

.grid {
  max-width: fit-content;
  margin-inline: auto;
  display: grid;
  grid-column-gap: 1.2rem;
  grid-row-gap: 1.2rem;
  padding: 1rem;
}

.small-grid {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  --btn-w: 95px;
}

.large-grid {
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  --btn-w: 70px;
}

.grid-btn {
  width: var(--btn-w);
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--clr-light-gray);
  font-size: 40px;
  color: var(--clr-snow-white);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.grid-btn-img {
  position: relative;
}

.hidden {
  background-color: var(--clr-gray);
  color: rgb(86, 97, 109);
  animation: hide 0.4s ease-in-out forwards;
}

.validate {
  background-color: var(--clr-orange);
}

img {
  width: var(--btn-w);
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--clr-light-gray);
  padding: 0.7rem;
  cursor: pointer;
  position: relative;
}

@keyframes hide {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
