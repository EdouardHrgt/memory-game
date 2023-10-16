<script setup>
import { ref } from 'vue';
const datas = ref([]);
</script>

<template>
  <section class="modal">
    <h2>Player 3 Wins!</h2>
    <p>Game over! Here are the results...</p>
    <div class="players">
      <div class="player flex-all">
        <h3>Player 3 <span>(Winner)</span></h3>
        <p>8 Pairs</p>
      </div>
      <div class="player flex-all">
        <h3>Player 1 <span></span></h3>
        <p>1 Pairs</p>
      </div>
    </div>
    <div class="btn flex-align"><button class="restart">restart</button> <button class="new">New Game</button></div>
  </section>
</template>

<style scoped>
.modal {
  background-color: #f2f2f2;
  border-radius: 2rem;
  padding: 2rem;
  position: absolute;
  inset: 0;
  z-index: 10;
  text-align: center;
}

h2 {
  font-size: 48px;
  color: var(--clr-dark-gray);
  margin-bottom: 1rem;
}

p,
h3 {
  font-size: 18px;
  color: var(--clr-light-grayish-blue);
  font-weight: bold;
}

.players {
  margin-block: 2rem;
  max-width: 40rem;
  margin-inline: auto;
}

.player {
  background-color: #dfe7ec;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  margin-block: 1rem;
}

.player p {
  font-size: 32px;
  font-weight: bold;
  color: var(--clr-dark-gray);
}

.btn {
  justify-content: center;
}

.btn {
  max-width: 40rem;
  margin-inline: auto;
}

button {
  font-size: 20px;
  width: 100%;
  font-weight: bold;
  color: var(--clr-gray);
  border-radius: 6rem;
  background-color: #dfe7ec;
  padding: 0.5rem 2rem;
}

.new:hover {
  background-color: var(--clr-light-blue);
  color: var(--clr-snow-white);
}

.restart {
  color: var(--clr-snow-white);
  background-color: var(--clr-orange);
}

.restart:hover {
  background-color: var(--clr-snow-white);
  color: var(--clr-orange);
}
</style>
