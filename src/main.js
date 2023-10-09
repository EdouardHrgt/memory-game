import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Start from './views/StartView.vue';
import Play from './views/GameView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Start', component: Start },
    { path: '/play', name: 'Play', component: Play },
  ],
});

createApp(App).use(router).mount('#app');
