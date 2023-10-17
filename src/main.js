import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Start from './views/StartView.vue';
import Play from './views/GameView.vue';
import Recap from './views/VictoryView.vue';
import PageNotFound from './views/Error404.vue';
import Timer from './views/ChronoTester.vue';

import { createPinia } from 'pinia';

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Start', component: Start },
    { path: '/play', name: 'Play', component: Play },
    { path: '/recap/:players', name: 'Recap', component: Recap },
    { path: '/timer', name: 'Timer', component: Timer },
    // { path: '/:pathMatch(*)*', name: 'PageNotFound', component: PageNotFound },
  ],
});

createApp(App).use(router).use(pinia).mount('#app');
