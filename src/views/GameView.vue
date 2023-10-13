<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { generateGrid } from '../composables/gridGeneration';
import { generatePlayers } from '../composables/generatePlayers';
import clicSound from '../assets/audio/click.mp3';
import WinSound from '../assets/audio/win.wav';
import LooseSound from '../assets/audio/loose.mp3';
import victorySound from '../assets/audio/victory.wav';
import alertSound from '../assets/audio/alert.wav';
import Loader from '../components/LoaderComponent.vue';

const route = useRoute();
const router = useRouter();
const settings = JSON.parse(route.query.params);
const isMuted = ref(false);
const grid = ref([]);
const isMenuOpen = ref(false);
const isLoading = ref(false);

onMounted(() => {
  // Auto Generating the Grid
  grid.value = generateGrid(settings);
});

function restart() {
  toggleLoader();
  hardReset();
  resetTime();
  resetPlayerScore();
  winningPairs.value = [];
  MovesCounter.value = 0;
  isWin.value = false;
  isMenuOpen.value = false;
  grid.value = generateGrid(settings);
}

function toggleMenu() {
  if (isMenuOpen.value == true) {
    isMenuOpen.value = false;
  } else if (isMenuOpen.value == false) {
    isMenuOpen.value = true;
  }
}

function toggleLoader() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
}

const startTime = ref(0);
const endTime = ref(false);
const elapsedTime = ref(0);
const isGameActive = ref(false);

function timeSpent() {
  startTime.value = new Date().getTime();
  endTime.value = false;
  updateElapsedTime();
}

function updateElapsedTime() {
  const intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    elapsedTime.value = Math.floor((currentTime - startTime.value) / 1000);

    if (endTime.value == true) {
      clearInterval(intervalId);
    }
  }, 1000);
}

function formatTime(seconds) {
  if (seconds < 0 || seconds > 3600) {
    return;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) {
    return `${remainingSeconds} s`;
  } else {
    return `${minutes} min ${remainingSeconds} s`;
  }
}

function resetTime() {
  startTime.value = 0;
  endTime.value = true;
  elapsedTime.value = 0;
  isGameActive.value = false;
  updateElapsedTime();
}

function playSound(music) {
  if (isMuted.value === true) return;
  const audio = new Audio(music);
  audio.play();
}

function toggleSound() {
  isMuted.value = !isMuted.value;
  localStorage.setItem('SoundPreference', isMuted.value);
}

function backHome() {
  router.push('/');
}

function getImageUrl(theme, name) {
  return new URL(`../assets/${theme}/${name}`, import.meta.url).href;
}

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

function addValidate(val) {
  const buttons = document.querySelectorAll('.grid-btn');
  buttons.forEach((btn) => {
    if (btn.value === val) {
      btn.classList.remove('hidden');
      btn.classList.add('validate');
    }
  });
}

function toggleVictory() {
  if (winningPairs.value.length === grid.value.length / 2) {
    isWin.value = true;
    endTime.value = true;
    updateElapsedTime();
    playSound(victorySound);
  }
}

const clickedElements = ref([]);
const isClickable = ref(true);
const winningPairs = ref([]);
const MovesCounter = ref(0);
const isWin = ref(false);
const playersList = generatePlayers(settings.players);
const players = ref(playersList);
const toggleStyle = ref(0);

let currentPlayerIndex = ref(0);

function switchToNextPlayer() {
  currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length;
  toggleStyle.value = currentPlayerIndex.value % players.value.length;
}

function playerScore(score = 0) {
  players.value[currentPlayerIndex.value].moves += 1;
  if (score != 0) players.value[currentPlayerIndex.value].score += 1;
  switchToNextPlayer();
}

function resetPlayerScore() {
  toggleStyle.value = 0;
  players.value.forEach((player) => {
    player.moves = 0;
    player.score = 0;
  });
}

function game(event, i) {
  //Disable click if 2 elements are already clicked
  isGameActive.value = true;
  if (!isClickable.value) {
    return;
  }

  if (startTime.value === 0) {
    timeSpent();
  }

  playSound(clicSound);

  event.target.classList.remove('hidden');

  let value = event.target.value;

  clickedElements.value.push({ value, index: i });

  const round = clickedElements.value.length === 2;

  // If player round completed, we block clicking event, Wait 1sec and hide buttons content again then allow a new round
  if (round) {
    isClickable.value = false;
    MovesCounter.value++;
    setTimeout(() => {
      const [element1, element2] = clickedElements.value;
      if (element1.index === element2.index) {
        playSound(alertSound);
        playerScore();
        reset();
      } else if (element1.value === element2.value) {
        // If the values match, apply the "validate" class and remove the "hidden" class
        playSound(WinSound);
        winningPairs.value.push(element1.value);

        addValidate(element1.value);

        playerScore(1);
        // Check if the game is over
        toggleVictory();
        reset();
      } else {
        playSound(LooseSound);
        playerScore();
        // If the values don't match, hide the buttons again
        reset();
      }

      isClickable.value = true;
    }, settings.speed);
  }
}
</script>

<template>
  <main>
    <div class="firework" v-show="isWin"></div>
    <div class="firework" v-show="isWin"></div>
    <div class="firework" v-show="isWin"></div>
    <header class="commands flex">
      <svg width="150" height="28" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.08 21V10.64c0-1.733.287-3.053.86-3.96s1.487-1.36 2.74-1.36c.96 0 1.647.233 2.06.7.413.467.667 1.087.76 1.86.093.773.14 1.627.14 2.56V21h6.12V10.52c0-1.733.28-3.033.84-3.9.56-.867 1.453-1.3 2.68-1.3.987 0 1.693.233 2.12.7.427.467.693 1.087.8 1.86.107.773.16 1.627.16 2.56V21h6.08V8.92c0-2.693-.48-4.753-1.44-6.18C29.04 1.313 27.293.6 24.76.6c-1.387 0-2.673.28-3.86.84a7.44 7.44 0 0 0-2.94 2.48c-.453-1.093-1.153-1.92-2.1-2.48C14.913.88 13.653.6 12.08.6c-1.467 0-2.72.347-3.76 1.04-1.04.693-1.787 1.413-2.24 2.16l-.76-2.64H0V21h6.08Zm39.2.48c1.627 0 3.22-.36 4.78-1.08 1.56-.72 2.86-1.84 3.9-3.36l-4.84-1.76c-.373.427-.9.78-1.58 1.06s-1.487.42-2.42.42c-1.12 0-2.14-.347-3.06-1.04-.92-.693-1.433-1.733-1.54-3.12H55.2c.133-2.347-.2-4.42-1-6.22-.8-1.8-1.98-3.213-3.54-4.24C49.1 1.113 47.227.6 45.04.6c-1.92 0-3.687.427-5.3 1.28a10.074 10.074 0 0 0-3.88 3.6c-.973 1.547-1.46 3.373-1.46 5.48 0 2.187.46 4.067 1.38 5.64a9.228 9.228 0 0 0 3.84 3.62c1.64.84 3.527 1.26 5.66 1.26ZM49.56 9h-9.04c.187-1.36.727-2.347 1.62-2.96.893-.613 1.913-.92 3.06-.92 1.173 0 2.187.327 3.04.98.853.653 1.293 1.62 1.32 2.9Zm14.6 12V10.64c0-1.733.287-3.053.86-3.96s1.487-1.36 2.74-1.36c.96 0 1.647.233 2.06.7.413.467.667 1.087.76 1.86.093.773.14 1.627.14 2.56V21h6.12V10.52c0-1.733.28-3.033.84-3.9.56-.867 1.453-1.3 2.68-1.3.987 0 1.693.233 2.12.7.427.467.693 1.087.8 1.86.107.773.16 1.627.16 2.56V21h6.08V8.92c0-2.693-.48-4.753-1.44-6.18C87.12 1.313 85.373.6 82.84.6c-1.387 0-2.673.28-3.86.84a7.44 7.44 0 0 0-2.94 2.48c-.453-1.093-1.153-1.92-2.1-2.48C72.993.88 71.733.6 70.16.6c-1.467 0-2.72.347-3.76 1.04-1.04.693-1.787 1.413-2.24 2.16l-.76-2.64h-5.32V21h6.08Zm38.84.48c1.813 0 3.52-.373 5.12-1.12 1.6-.747 2.893-1.9 3.88-3.46.987-1.56 1.48-3.527 1.48-5.9 0-2.4-.493-4.367-1.48-5.9-.987-1.533-2.28-2.667-3.88-3.4-1.6-.733-3.307-1.1-5.12-1.1-1.84 0-3.56.367-5.16 1.1-1.6.733-2.893 1.867-3.88 3.4-.987 1.533-1.48 3.5-1.48 5.9 0 2.373.493 4.34 1.48 5.9.987 1.56 2.28 2.713 3.88 3.46 1.6.747 3.32 1.12 5.16 1.12Zm0-4.72c-1.227 0-2.253-.44-3.08-1.32-.827-.88-1.24-2.36-1.24-4.44 0-2.107.42-3.58 1.26-4.42.84-.84 1.86-1.26 3.06-1.26 1.173 0 2.18.42 3.02 1.26.84.84 1.26 2.313 1.26 4.42 0 2.08-.407 3.56-1.22 4.44-.813.88-1.833 1.32-3.06 1.32ZM122.52 21V11c0-1.573.393-2.707 1.18-3.4.787-.693 1.913-1.04 3.38-1.04.293 0 .56.007.8.02.24.013.52.047.84.1V.6c-1.52-.08-2.813.2-3.88.84-1.067.64-1.907 1.76-2.52 3.36l-1.08-3.64h-4.8V21h6.08Zm11.36 6.44c1.733 0 3.107-.187 4.12-.56 1.013-.373 1.847-1.027 2.5-1.96s1.3-2.24 1.94-3.92l7.6-19.84h-6.52l-3.8 12.4-3.88-12.4h-6.52l7.6 19.72c-.213.667-.447 1.153-.7 1.46-.253.307-.607.5-1.06.58-.453.08-1.133.12-2.04.12h-1.2v4.4h1.96Z"
          fill="rgb(252, 252, 252)"
          fill-rule="nonzero"
        />
      </svg>
      <button class="menu" @click="toggleMenu()"><h2>Menu</h2></button>
      <div class="header-icons-btns flex" :class="{ 'active-menu': isMenuOpen }">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" class="close" @click="toggleMenu()">
          <path
            d="M23.607.98l1.414 1.413L14.414 13l10.607 10.607-1.414 1.414L13 14.414 2.393 25.021.98 23.607 11.586 13 .98 2.393 2.393.98 13 11.586 23.607.98z"
            fill-rule="evenodd"
          />
        </svg>
        <div class="btn-wrapper flex">
          <button class="restart" @click="restart()">Restart</button>
          <button class="new" @click="backHome()">New Game</button>
        </div>
        <button v-show="isMuted === false" class="sound-icon" @click="toggleSound()">
          <img src="../assets/sound.png" alt="Sound On" />
        </button>
        <button v-show="isMuted === true" class="sound-icon" @click="toggleSound()">
          <img src="../assets/no-sound.png" alt="Sound Off" />
        </button>
      </div>
    </header>
    <section>
      <div
        class="grid"
        :class="{ 'large-grid': settings.grid == 1, 'small-grid': settings.grid == 0 }"
        v-if="settings.theme === 'numbers'"
      >
        <button class="grid-btn hidden" v-for="(el, i) in grid" :key="i" :value="el" @click="game($event, i)">
          {{ el }}
        </button>
        <div class="win-modal" v-show="isWin"></div>
        <Loader v-show="isLoading" />
      </div>
      <div
        class="grid"
        :class="{ 'large-grid': settings.grid == 1, 'small-grid': settings.grid == 0 }"
        v-if="settings.theme === 'animals' || settings.theme === 'monsters'"
      >
        <button
          class="grid-btn hidden grid-btn-animals"
          v-for="(el, i) in grid"
          :key="i"
          :value="el.value"
          @click="game($event, i)"
          :style="{ backgroundImage: `url(${getImageUrl(settings.theme, el.img)})` }"
        ></button>

        <div class="win-modal" v-show="isWin"></div>
        <Loader v-show="isLoading" />
      </div>
    </section>
    <footer>
      <!-- SOLO metrix -->
      <div class="metrix flex-all" v-show="settings.players === 1">
        <h3>Moves</h3>
        <p class="scale-anim">{{ MovesCounter }}</p>
      </div>
      <div class="metrix flex-all timer" v-show="settings.players === 1">
        <p v-show="isGameActive" class="scale-anim">{{ formatTime(elapsedTime) }}</p>
        <h3 v-show="!isGameActive">Time</h3>
      </div>
      <!-- Multiplayer Metrix -->
      <div class="multiplayer flex" v-show="settings.players > 1">
        <div
          class="metrix flex-all player"
          v-for="(player, i) in players"
          :key="i"
          :class="{ 'active-player': toggleStyle == i }"
        >
          <h3>Player {{ i + 1 }}</h3>
          <p class="scale-anim" :class="{ 'active-score': toggleStyle == i }">{{ player.score }}</p>
          <div class="triangle" :class="{ 'active-triangle': toggleStyle == i }"></div>
          <h4 :class="{ 'active-h4': toggleStyle == i }">Current turn</h4>
        </div>
      </div>
    </footer>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  min-height: 100dvh;
  --max-w: 950px;
  background-color: var(--clr-dark-gray);
}

header {
  max-width: var(--max-w);
  margin-inline: auto;
  padding: 4rem 0 3rem;
  align-items: baseline;
  justify-content: flex-end;
  gap: 1rem;
}

header svg {
  margin-right: auto;
}

.menu {
  height: 3rem;
  width: 9rem;
  border-radius: 6rem;
  display: none;
  margin-left: auto;
  background-color: var(--clr-orange);
}

.close {
  display: none;
}

.menu h2 {
  font-size: 22px;
  font-weight: bold;
  color: var(--clr-snow-white);
}

.menu:hover {
  background-color: var(--clr-snow-white);
}

.menu:hover h2 {
  color: var(--clr-orange);
}

.header-icons-btns {
  align-items: center;
}

.btn-wrapper {
  gap: 1rem;
  margin-right: 2rem;
}

.btn-wrapper button {
  padding: 0.7rem 2rem;
  border-radius: 6rem;
  font-size: 20px;
  font-weight: bold;
  max-height: 3rem;
}

.sound-icon {
  padding: 0;
  background: transparent;
  width: 3.8rem;
  aspect-ratio: 1;
  transition: 0.3s ease-in-out;
}

.sound-icon:hover {
  filter: grayscale(1);
}

.restart {
  background-color: var(--clr-orange);
  color: var(--clr-snow-white);
}

.restart:hover {
  background-color: var(--clr-snow-white);
  color: var(--clr-orange);
}

.new {
  background-color: var(--clr-snow-white);
  color: var(--clr-dark-gray);
}

.new:hover {
  background-color: var(--clr-light-blue);
  color: var(--clr-snow-white);
}

.win-modal {
  background-color: var(--clr-dark-gray);
  background-image: url('../assets/winer.png');
  background-position: center;
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  border-radius: 10px;
  transition: 0.4s;
}

.win-modal h1 {
  text-align: center;
  font-size: 3.5rem;
  color: var(--clr-orange);
}

.grid {
  max-width: fit-content;
  margin-inline: auto;
  display: grid;
  grid-column-gap: 1.2rem;
  grid-row-gap: 1.2rem;
  padding: 1rem;
  position: relative;
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
  background-size: 72%;
  background-position: center;
  animation: hide 0.4s ease-in-out forwards;
}

.grid-btn:hover {
  background-color: var(--clr-light-blue);
}

.grid-btn-img {
  position: relative;
}

.hidden {
  background-color: var(--clr-gray);
  color: lightgoldenrodyellow;
  background-size: 0;
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

/*-- Footer --*/
footer {
  background-color: var(--clr-dark-gray);
  padding: 4rem 0;
  max-width: var(--max-w);
  margin-inline: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
}

.metrix {
  background-color: var(--clr-snow-white);
  border-radius: 10px;
  padding: 0 1rem;
  text-align: center;
  width: 12rem;
  height: 4rem;
}

h3 {
  font-size: 1.6rem;
  color: var(--clr-dark-gray);
  animation: hide 0.4s ease-in-out;
}

footer p {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--clr-orange);
}

.timer p {
  font-size: 1.2rem;
  color: var(--clr-dark-gray);
  text-align: center;
  width: 100%;
}

.scale-anim {
  animation: modal 0.4s forwards;
}

.multiplayer {
  gap: 1rem;
}

.player {
  position: relative;
}

.triangle {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  content: '';
  background: transparent;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 12px solid var(--clr-orange);
  display: none;
}

h4 {
  color: var(--clr-snow-white);
  opacity: 0.9;
  font-size: 16px;
  text-transform: uppercase;
  position: absolute;
  bottom: -1.5rem;
  text-align: center;
  left: 0;
  right: 0;
  font-weight: normal;
  letter-spacing: 1px;
  animation: modal 0.5s forwards;
  display: none;
}

.active-h4 {
  display: inline-block;
}

.active-triangle {
  display: inline-block;
}

.active-score {
  color: var(--clr-snow-white);
}

.active-player {
  background-color: var(--clr-orange);
}

@media screen and (max-width: 1440px) {
  main {
    --max-w: 100%;
  }
  header {
    max-width: var(--max-w);
    margin-inline: auto;
    padding: 6rem 7vw 4rem;
  }
}

@media screen and (max-width: 800px) {
  header {
    padding: 3rem 1rem 3rem;
    gap: 0;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  header svg {
    margin: 0;
  }
  .menu {
    display: inline-block;
  }

  .close {
    display: block;
    fill: var(--clr-orange);
    position: absolute;
    top: 2rem;
    right: 2rem;
    cursor: pointer;
  }

  .header-icons-btns {
    position: fixed;
    inset: 0;
    background-color: var(--clr-trans-dark-gray);
    z-index: 150;
    display: none;
    place-content: center;
  }

  .active-menu {
    display: grid;
    transform: translateX(1000px);
    animation: pop 0.4s linear forwards;
  }

  .btn-wrapper {
    flex-direction: column;
    margin: auto;
    gap: 2rem;
  }

  .sound-icon {
    margin: 2rem auto;
  }

  .btn-wrapper button {
    padding: 1rem 2rem;
    font-size: 26px;
    max-height: none;
  }

  .new {
    background-color: var(--clr-dark-gray);
    color: var(--clr-snow-white);
  }

  .restart:hover {
    background-color: var(--clr-dark-gray);
  }

  .grid {
    padding: 1.5rem 0.5rem 1rem;
    grid-column-gap: 1rem;
    grid-row-gap: 1.5rem;
  }

  .grid-btn {
    font-size: 38px;
  }

  footer {
    padding: 3rem 0.5rem 0;
  }

  .rounds {
    padding: 1rem;
    width: fit-content;
  }

  h3 {
    font-size: 1.4rem;
  }

  footer p {
    font-size: 1.3rem;
  }
}

@media screen and (max-width: 525px) {
  .small-grid {
    --btn-w: 70px;
  }

  .large-grid {
    --btn-w: 48px;
  }
}

@media screen and (max-width: 420px) {
  .grid {
    grid-column-gap: 0.8rem;
    grid-row-gap: 1rem;
  }
}

@media screen and (max-width: 385px) {
  .grid {
    grid-column-gap: 0.5rem;
    grid-row-gap: 1rem;
  }
}

@keyframes firework {
  0% {
    transform: translate(var(--x), var(--initialY));
    width: var(--initialSize);
    opacity: 1;
  }
  50% {
    width: 0.5vmin;
    opacity: 1;
  }
  100% {
    width: var(--finalSize);
    opacity: 0;
  }
}

.firework,
.firework::before,
.firework::after {
  --initialSize: 0.5vmin;
  --finalSize: 45vmin;
  --particleSize: 0.2vmin;
  --color1: yellow;
  --color2: khaki;
  --color3: white;
  --color4: lime;
  --color5: gold;
  --color6: mediumseagreen;
  --y: -30vmin;
  --x: -50%;
  --initialY: 60vmin;
  content: '';
  animation: firework 2s 4;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, var(--y));
  width: var(--initialSize);
  aspect-ratio: 1;
  background: radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 50% 0%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 50%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 50% 100%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 50%,
    /* bottom right */ radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80% 90%,
    radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 90%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 70%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 60%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 55% 80%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 70% 77%,
    /* bottom left */ radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 22% 90%,
    radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 45% 90%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 70%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 10% 60%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 31% 80%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 28% 77%,
    radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 13% 72%,
    /* top left */ radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 80% 10%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 95% 14%,
    radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 90% 23%,
    radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 100% 43%,
    radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 85% 27%,
    radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 77% 37%,
    radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 60% 7%,
    /* top right */ radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 22% 14%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 45% 20%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 33% 34%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 10% 29%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 31% 37%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 28% 7%,
    radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 13% 42%;
  background-size: var(--initialSize) var(--initialSize);
  background-repeat: no-repeat;
}

.firework::before {
  --x: -50%;
  --y: -50%;
  --initialY: -50%;
  /*   transform: translate(-20vmin, -2vmin) rotate(40deg) scale(1.3) rotateY(40deg); */
  transform: translate(-50%, -50%) rotate(40deg) scale(1.3) rotateY(40deg);
  /*   animation: fireworkPseudo 2s infinite; */
}

.firework::after {
  --x: -50%;
  --y: -50%;
  --initialY: -50%;
  /*   transform: translate(44vmin, -50%) rotate(170deg) scale(1.15) rotateY(-30deg); */
  transform: translate(-50%, -50%) rotate(170deg) scale(1.15) rotateY(-30deg);
  /*   animation: fireworkPseudo 2s infinite; */
}

.firework:nth-child(2) {
  --x: 30vmin;
}

.firework:nth-child(2),
.firework:nth-child(2)::before,
.firework:nth-child(2)::after {
  --color1: pink;
  --color2: violet;
  --color3: fuchsia;
  --color4: orchid;
  --color5: plum;
  --color6: lavender;
  --finalSize: 40vmin;
  left: 30%;
  top: 60%;
  animation-delay: -0.25s;
}

.firework:nth-child(3) {
  --x: -30vmin;
  --y: -50vmin;
}

.firework:nth-child(3),
.firework:nth-child(3)::before,
.firework:nth-child(3)::after {
  --color1: cyan;
  --color2: lightcyan;
  --color3: lightblue;
  --color4: PaleTurquoise;
  --color5: SkyBlue;
  --color6: lavender;
  --finalSize: 35vmin;
  left: 70%;
  top: 60%;
  animation-delay: -0.4s;
}
</style>
