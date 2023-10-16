<script setup>
import { ref } from 'vue';
const datas = ref([]);
</script>

<template>
  <section class="vic-modal">
    <h2>Player 3 Wins!</h2>
    <p>Game over! Here are the results...</p>
    <div class="vic-players">
      <div class="vic-player flex-all">
        <h3>Player 3 <span>(Winner)</span></h3>
        <p>8 Pairs</p>
      </div>
    </div>
    <div class="vic-btn flex-align"><button class="vic-restart">restart</button> <button class="vic-new">New Game</button></div>
  </section>
</template>

<style scoped>
.vic-modal {
  background-color: #f2f2f2;
  border-radius: 2rem;
  padding: 2rem;
  position: absolute;
  inset: 0;
  z-index: 10;
  text-align: center;
}

.vic-modal h2 {
  font-size: 48px;
  color: var(--clr-dark-gray);
  margin-bottom: 1rem;
}

.vic-player p,
.vic-player h3 {
  font-size: 18px;
  color: var(--clr-light-grayish-blue);
  font-weight: bold;
}

.vic-players {
  margin-block: 2rem;
  max-width: 40rem;
  margin-inline: auto;
}

.vic-player {
  background-color: #dfe7ec;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  margin-block: 1rem;
}

.vic-player p {
  font-size: 32px;
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
  font-size: 20px;
  width: 100%;
  font-weight: bold;
  color: var(--clr-gray);
  border-radius: 6rem;
  background-color: #dfe7ec;
  padding: 0.5rem 2rem;
}

.vic-new:hover {
  background-color: var(--clr-light-blue);
  color: var(--clr-snow-white);
}

.vic-restart {
  color: var(--clr-snow-white);
  background-color: var(--clr-orange);
}

.vic-restart:hover {
  background-color: var(--clr-snow-white);
  color: var(--clr-orange);
}
</style>
