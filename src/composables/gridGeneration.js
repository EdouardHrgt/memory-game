export function generateNumberGrid(x) {
  const originalArray = Array.from({ length: x + 1 }, (_, index) => index);
  const duplicatedArray = originalArray.flatMap((number) => [number, number]);
  const shuffledArray = duplicatedArray.sort(() => Math.random() - 0.5);
  return shuffledArray;
}

import { animals } from '../composables/animals';
import { monsters } from '../composables/monsters';

export function generateAnimalGrid(x) {
  const list = animals();
  const shuffleList = list.sort(() => Math.random() - 0.5);
  const selectedObjects = shuffleList.slice(0, x);
  const duplicateList = selectedObjects.flatMap((animal) => [animal, { ...animal }]);
  const shuffledValues = duplicateList.sort(() => Math.random() - 0.5);
  return shuffledValues;
}

export function generateMonstersGrid(x) {
  const list = monsters();
  const shuffleList = list.sort(() => Math.random() - 0.5);
  const selectedObjects = shuffleList.slice(0, x);
  const duplicateList = selectedObjects.flatMap((animal) => [animal, { ...animal }]);
  const shuffledValues = duplicateList.sort(() => Math.random() - 0.5);
  return shuffledValues;
}

export function generateThemeGrid(x, theme) {
  let list;
  if (theme === 'animals') list = animals();
  if (theme === 'monsters') list = monsters();
  const shuffleList = list.sort(() => Math.random() - 0.5);
  const selectedObjects = shuffleList.slice(0, x);
  const duplicateList = selectedObjects.flatMap((obj) => [obj, { ...obj }]);
  const shuffledValues = duplicateList.sort(() => Math.random() - 0.5);
  return shuffledValues;
}

export function generateGrid(settings) {
  let x;
  if (settings.theme === 'numbers') {
    if (settings.grid == 0) {
      x = 7;
    } else if (settings.grid == 1) {
      x = 17;
    }
    return generateNumberGrid(x);
  }

  if (settings.theme != 'numbers') {
    if (settings.grid == 0) {
      x = 8;
    } else if (settings.grid == 1) {
      x = 18;
    }
    return generateThemeGrid(x, settings.theme);
  }
}
