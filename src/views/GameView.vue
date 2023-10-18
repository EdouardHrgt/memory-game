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
import { textList } from '../composables/texts';

const lang = ref(0);
const text = textList();
const displayedTexts = ref(text);
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
  lang.value = settings.lang;
  lang.value = localStorage.getItem('LANG');
});

const language = computed(() => {
  if (+lang.value === 0) {
    return displayedTexts.value[1][0];
  } else {
    return displayedTexts.value[1][1];
  }
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
  recapVictory.value = null;
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

const startTime = ref(0); // Initial timestamp
const endTime = ref(false); // Stop the time
const elapsedTime = ref(0); // Delta time since startTime (Formatted then displayed)
const isGameActive = ref(false); // Toggle visible / hidden time metrix on html
let deltaTime = 0;

function StartTimer() {
  startTime.value = new Date().getTime();
  endTime.value = false;
  updateElapsedTime();
}

function updateElapsedTime() {
  deltaTime = setInterval(() => {
    const currentTime = new Date().getTime();
    elapsedTime.value = Math.floor((currentTime - startTime.value) / 1000);
    if (endTime.value == true || elapsedTime.value > 600) clearInterval(deltaTime);
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
    endTime.value = true;
    updateElapsedTime();
    isWin.value = true;
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

function playerScore(score = 0, next = true) {
  players.value[currentPlayerIndex.value].moves += 1;
  if (score != 0) players.value[currentPlayerIndex.value].score += 1;
  if (next) switchToNextPlayer();
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
    StartTimer();
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
        //If the pair clicked has already been won
        if (winningPairs.value.includes(element1.value)) {
          playSound(alertSound);
          playerScore();
        } else {
          // If the values match, apply the "validate" class and remove the "hidden" class
          playSound(WinSound);
          winningPairs.value.push(element1.value);
          addValidate(element1.value);
          playerScore(1, false);
          // Check if the game is over
          toggleVictory();
        }
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

const WhoWin = computed(() => {
  const playersCopy = JSON.parse(JSON.stringify(players.value));
  return playersCopy.slice().sort((a, b) => b.score - a.score);
});
</script>

<template>
  <main>
    <header class="commands flex">
      <h1>mem<span>o</span>ry</h1>
      <button class="menu" @click="toggleMenu()"><h2>Menu</h2></button>
      <div class="header-icons-btns flex" :class="{ 'active-menu': isMenuOpen }">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" class="close" @click="toggleMenu()">
          <path
            d="M23.607.98l1.414 1.413L14.414 13l10.607 10.607-1.414 1.414L13 14.414 2.393 25.021.98 23.607 11.586 13 .98 2.393 2.393.98 13 11.586 23.607.98z"
            fill-rule="evenodd"
          />
        </svg>
        <div class="btn-wrapper flex">
          <button class="restart" @click="restart()">{{ language.header[0] }}</button>
          <button class="new" @click="backHome()">{{ language.header[1] }}</button>
        </div>
        <button v-show="isMuted === false" class="sound-icon" @click="toggleSound()">
          <img src="../assets/sound.png" alt="Sound On" />
        </button>
        <button v-show="isMuted === true" class="sound-icon" @click="toggleSound()">
          <img src="../assets/no-sound.png" alt="Sound Off" />
        </button>
      </div>
    </header>
    <!-- VICTORY RECAP MODAL -->
    <section class="vic-modal" v-show="isWin">
      <div class="vic-container">
        <h2 v-show="+settings.players > 1">
          {{ language.players }} <span class="vic-winner">{{ WhoWin[0].id }}</span> {{ language.victory[3] }}
        </h2>
        <h2 v-show="+settings.players == 1">{{ language.victory[0] }}</h2>
        <p>{{ language.victory[2] }}</p>
        <div class="vic-players">
          <div class="vic-player flex-all" v-for="(gamer, i) in WhoWin" :key="gamer.id">
            <h3>
              {{ language.players }}{{ gamer.id }} <span v-if="i === 0">({{ language.victory[1] }})</span>
            </h3>
            <p>{{ gamer.score }} {{ language.pairs }}</p>
          </div>
        </div>
        <div class="vic-btn flex-align">
          <button class="vic-restart" id="victory-btn" @click="restart()">{{ language.header[0] }}</button>
          <button class="vic-new" @click="backHome()">{{ language.header[1] }}</button>
        </div>
      </div>
    </section>
    <section>
      <div
        class="grid"
        :class="{ 'large-grid': settings.grid == 1, 'small-grid': settings.grid == 0 }"
        v-if="settings.theme === 'numbers'"
      >
        <button class="grid-btn hidden" v-for="(el, i) in grid" :key="i" :value="el" @click="game($event, i)">
          {{ el }}
        </button>
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

        <Loader v-show="isLoading" />
      </div>
    </section>
    <footer>
      <!-- SOLO metrix -->
      <div class="solo-metrix-wrapper flex" v-show="settings.players === 1">
        <div class="metrix flex-all">
          <h3>{{ language.footer[0] }}</h3>
          <p class="scale-anim">{{ MovesCounter }}</p>
        </div>
        <div class="metrix flex-all timer">
          <p v-show="isGameActive" class="scale-anim">{{ formatTime(elapsedTime) }}</p>
          <h3 v-show="!isGameActive">{{ language.footer[1] }}</h3>
        </div>
      </div>
      <!-- Multiplayer Metrix -->
      <div class="multiplayer flex" v-show="settings.players > 1">
        <div class="flex player" v-for="(player, i) in players" :key="i" :class="{ 'active-player': toggleStyle == i }">
          <h3 class="h3-desk">{{ language.players }} {{ i + 1 }}</h3>
          <h3 class="h3-mobile">P {{ i + 1 }}</h3>
          <p class="scale-anim" :class="{ 'active-score': toggleStyle == i }">{{ player.score }}</p>
          <div class="triangle" :class="{ 'active-triangle': toggleStyle == i }"></div>
          <h4 :class="{ 'active-h4': toggleStyle == i }">{{ language.turn }}</h4>
        </div>
      </div>
    </footer>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  --max-w: 950px;
  min-height: 100dvh;
  background-color: var(--clr-dark-gray);
}

header {
  width: var(--max-w);
  margin-inline: auto;
  padding: 3rem 0;
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

section {
  position: relative;
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
  color: transparent;
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
  width: 100%;
  margin-inline: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.solo-metrix-wrapper {
  width: 100%;
  justify-content: center;
  gap: 1rem;
  margin-inline: auto;
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

.h3-mobile {
  display: none;
}

.player {
  position: relative;
  align-items: center;
  justify-content: space-between;
  background-color: var(--clr-snow-white);
  border-radius: 10px;
  padding: 0 1rem;
  text-align: center;
  width: 12rem;
  height: 4rem;
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

.vic-modal {
  background-image: url('../assets/vic-bg.webp');
  background-size: cover;
  background-color: var(--clr-dark-gray);
  padding: 1rem 2rem;
  position: absolute;
  inset: 0;
  z-index: 10;
  text-align: center;
  overflow: hidden;
}

.vic-container {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--clr-snow-white);
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 575px;
  opacity: 0;
  animation: hide 0.4s ease-in-out forwards;
}

.vic-modal h2 {
  font-size: 48px;
  color: var(--clr-dark-gray);
  margin-bottom: 1rem;
}

.vic-winner {
  color: var(--clr-orange);
}

.vic-player p,
.vic-player h3 {
  font-size: 18px;
  color: var(--clr-light-grayish-blue);
  font-weight: bold;
}

.vic-players {
  margin-block: 1rem;
  max-width: 40rem;
  margin-inline: auto;
}

.vic-player {
  background-color: #dfe7ec;
  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
  margin-block: 1rem;
}

.vic-player p {
  font-size: 28px;
  font-weight: bold;
  color: var(--clr-dark-gray);
}

.btn {
  justify-content: center;
}

.vic-btn {
  max-width: 40rem;
  margin-inline: auto;
}

.vic-btn button {
  font-size: 18px;
  width: 100%;
  font-weight: bold;
  color: var(--clr-gray);
  border-radius: 6rem;
  background-color: #dfe7ec;
  padding: 0.7rem 2rem;
}

.vic-new:hover {
  background-color: var(--clr-light-blue);
  color: var(--clr-snow-white);
}

#victory-btn {
  color: var(--clr-snow-white);
  background-color: var(--clr-orange);
}

#victory-btn:hover {
  background-color: var(--clr-snow-white);
  color: var(--clr-orange);
}

@media screen and (max-width: 1440px) {
  main {
    --max-w: 1024px;
  }
  header {
    margin-inline: auto;
    padding: 3rem 7vw 4rem;
  }
}

@media screen and (max-width: 1030px) {
  main {
    --max-w: 900px;
  }
}

@media screen and (max-width: 900px) {
  main {
    --max-w: 800px;
  }
  .player {
    flex-direction: column;
    padding: 1rem 1rem;
    width: 5rem;
    height: 5.5rem;
  }
  .h3-desk {
    display: none;
  }
  .h3-mobile {
    display: block;
    letter-spacing: -1px;
  }

  h4 {
    font-size: 14px;
    bottom: -2.5rem;
    letter-spacing: 1px;
    display: none;
  }
  .multiplayer {
    gap: 1.5rem;
  }
}

@media screen and (max-width: 800px) {
  main {
    --max-w: 100%;
  }

  header {
    padding: 1rem 3rem;
    gap: 0;
    align-items: center;
    justify-content: space-between;
  }

  header svg {
    margin: 0;
  }

  .menu {
    display: inline-block;
    height: 3rem;
    width: 6rem;
  }

  .menu h2 {
    font-size: 18px;
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
    margin-bottom: 0;
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
  h1 {
    font-size: 38px;
  }

  .small-grid {
    --btn-w: 70px;
  }

  .large-grid {
    --btn-w: 48px;
  }

  .player {
    padding: 1rem 0.5rem;
  }

  .multiplayer {
    gap: 0;
    justify-content: space-between;
    width: 100%;
    padding: 0 0.5rem;
  }
  footer {
    margin-bottom: 2rem;
  }
  header {
    padding: 3rem 1.5rem;
  }
  .solo-metrix-wrapper {
    gap: 0.5rem;
  }
  .metrix {
    width: 100%;
  }

  .vic-modal {
    padding: 1rem 0.5rem;
  }

  .vic-container {
    padding: 1.5rem 1rem;
    width: calc(100% - 1rem);
  }

  .vic-modal h2 {
    font-size: 36px;
  }

  .vic-player p,
  .vic-player h3 {
    font-size: 16px;
  }

  .vic-player {
    padding: 0.5rem 1.5rem;
  }

  .vic-player p {
    font-size: 24px;
  }

  .vic-btn {
    flex-direction: column;
  }
}

@media screen and (max-width: 420px) {
  .grid {
    grid-column-gap: 0.8rem;
    grid-row-gap: 1rem;
  }
  .triangle {
    top: -10px;
  }
}

@media screen and (max-width: 385px) {
  .grid {
    grid-column-gap: 0.5rem;
    grid-row-gap: 1rem;
  }
  header {
    flex-direction: column;
    padding: 0 0 1rem 0;
  }
  .menu {
    margin-left: 0;
  }
}
</style>
