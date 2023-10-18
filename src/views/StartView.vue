<script setup>
import { ref, computed, onMounted } from 'vue';
import { textList } from '../composables/texts';

const lang = ref(null);
const text = textList();
const displayedTexts = ref(text);

onMounted(() => {
  const storedLang = localStorage.getItem('LANG');
  if (storedLang) {
    lang.value = +storedLang;
  } else {
    localStorage.setItem('LANG', '0');
    lang.value = 0;
  }
});

const language = computed(() => {
  if (+lang.value === 0) {
    return displayedTexts.value[0][0];
  } else {
    return displayedTexts.value[0][1];
  }
});

const langSwitcher = (int = false) => {
  if (int) {
    lang.value = 1;
    localStorage.setItem('LANG', '1');
  } else {
    lang.value = 0;
    localStorage.setItem('LANG', '0');
  }
};

const settings = ref({
  theme: 'numbers',
  players: 1,
  grid: 0,
  speed: 1000,
  lang: lang,
});

const params = computed(() => {
  return JSON.stringify(settings.value);
});

function ChooseSettings(prop, choice) {
  if (prop == 'theme') settings.value.theme = choice;
  if (prop == 'players') settings.value.players = choice;
  if (prop == 'grid') settings.value.grid = choice;
}
</script>

<template>
  <main>
    <h1>mem<span>o</span>ry</h1>
    <section class="card">
      <div class="container">
        <h2>{{ language.lang }}</h2>
        <div class="lang flex-align">
          <img src="../assets/en.png" alt="Set the game to English" class="lang-img" @click="langSwitcher()" />
          <img src="../assets/fr.png" alt="Passez le jeu en Français" class="lang-img" @click="langSwitcher(1)" />
        </div>
      </div>
      <div class="container">
        <h2>{{ language.theme[0] }}</h2>
        <div class="btn-wrapper btn-wrapper-theme">
          <button @click="ChooseSettings('theme', 'numbers')" :class="{ active: settings.theme === 'numbers' }">
            {{ language.theme[1] }}
          </button>
          <button @click="ChooseSettings('theme', 'animals')" :class="{ active: settings.theme === 'animals' }">
            {{ language.theme[2] }}
          </button>
          <button @click="ChooseSettings('theme', 'monsters')" :class="{ active: settings.theme === 'monsters' }">
            {{ language.theme[3] }}
          </button>
        </div>
      </div>
      <div class="container">
        <h2 class="flex-align">{{ language.players }}</h2>
        <div class="btn-wrapper btn-wrapper-players">
          <button @click="ChooseSettings('players', 1)" :class="{ active: settings.players === 1 }">1</button>
          <button @click="ChooseSettings('players', 2)" :class="{ active: settings.players === 2 }">2</button>
          <button @click="ChooseSettings('players', 3)" :class="{ active: settings.players === 3 }">3</button>
          <button @click="ChooseSettings('players', 4)" :class="{ active: settings.players === 4 }">4</button>
        </div>
      </div>
      <div class="container">
        <h2>{{ language.grid[0] }}</h2>
        <div class="btn-wrapper">
          <button @click="ChooseSettings('grid', 0)" :class="{ active: settings.grid === 0 }">{{ language.grid[1] }}</button>
          <button @click="ChooseSettings('grid', 1)" :class="{ active: settings.grid === 1 }">{{ language.grid[2] }}</button>
        </div>
      </div>
      <div class="container">
        <h2>{{ language.round }}</h2>
        <div class="btn-wrapper">
          <div class="speed">
            <div class="speed-info-wrapper flex-all">
              <p class="speed-infos">-</p>
              <p class="speed-infos">+</p>
            </div>
            <input type="range" min="500" max="2000" name="speed" id="speed" v-model="settings.speed" />
            <label for="speed" hidden>{{ language.round }}</label>
          </div>
        </div>
      </div>

      <router-link
        :to="{
          path: '/Play',
          query: {
            params,
          },
        }"
        ><button class="start">{{ language.start }}</button></router-link
      >
    </section>
  </main>
</template>

<style scoped>
main {
  background-color: var(--clr-dark-gray);
  width: 100%;
}

.card {
  background-color: var(--clr-snow-white);
  border-radius: 15px;
  padding: 3rem;
  max-width: 900px;
  min-width: 45rem;
  margin-inline: auto;
}

.container {
  margin-block: 2.5rem;
}

.btn-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  color: var(--clr-light-grayish-blue);
  margin-bottom: 0.5rem;
}

button {
  font-size: 22px;
  color: var(--clr-snow-white);
  font-weight: bold;
  border-radius: 6rem;
  background-color: var(--clr-light-grayish-blue);
  padding: 0.15rem 2rem;
  position: relative;
}

button:hover {
  background-color: var(--clr-dark-gray);
}

.start {
  background-color: var(--clr-orange);
  width: 100%;
  padding: 0.7rem 0;
}

.active {
  background-color: var(--clr-dark-gray);
}

.speed-info-wrapper {
  width: var(--input-w);
  margin-top: -0.8rem;
}

.speed-infos {
  color: var(--clr-light-blue);
  font-weight: bold;
  font-size: 18px;
}

.lang-img {
  width: 2.5rem;
  aspect-ratio: 1;
  cursor: pointer;
}

@media screen and (max-width: 1024px) {
  main {
    padding: 0 1rem;
  }
  .card {
    min-width: 37rem;
    max-width: initial;
    width: 100%;
  }
  .btn-wrapper {
    gap: 1.5rem;
  }
}
@media screen and (max-width: 768px) {
  main {
    display: flex;
    flex-direction: column;
  }
  .card {
    min-width: 0;
    width: 100%;
    padding: 2rem 1.5rem;
  }

  .btn-wrapper {
    gap: 0.6rem;
  }
  button {
    font-size: 20px;
    padding: 0.15rem 1.7rem;
    margin-block: 0.2rem;
  }
  .container {
    margin-block: 2rem;
  }
}

@media screen and (max-width: 370px) {
  .btn-wrapper-theme {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .container {
    margin-block: 1.2rem;
  }
  .btn-wrapper-players button {
    padding: 0;
    width: 2.5rem;
    aspect-ratio: 1;
  }
}
</style>
