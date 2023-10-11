export function generateNumberGrid(x) {
  const originalArray = Array.from({ length: x + 1 }, (_, index) => index);
  const duplicatedArray = originalArray.flatMap((number) => [number, number]);
  const shuffledArray = duplicatedArray.sort(() => Math.random() - 0.5);
  return shuffledArray;
}

import { animals } from '../composables/animals';
export function generateAnimalGrid(x) {
  // take random animals on every generation
  const animalsList = animals();
  const shuffledAnimals = animalsList.sort(() => Math.random() - 0.5);
  const selectedAnimals = shuffledAnimals.slice(0, x);
  const duplicatedAnimals = selectedAnimals.flatMap((animal) => [animal, { ...animal }]);
  const shuffledValues = duplicatedAnimals.sort(() => Math.random() - 0.5);
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

  if (settings.theme === 'animals') {
    if (settings.grid == 0) {
      x = 8;
    } else if (settings.grid == 1) {
      x = 18;
    }
    return generateAnimalGrid(x);
  }
}
