/**
 * Returns a random integer between min and max, inclusive.
 */
export const randomInt = (min, max) => {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

/**
 * Returns a random dice value from 1 to 6.
 */
export const rollDice = () => {
  return randomInt(1, 6);
};

/**
 * Returns a new shuffled copy of an array.
 * The original array is never modified.
 */
export const shuffle = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = randomInt(0, i);

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
};

/**
 * Returns one random item from an array.
 */
export const randomItem = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }

  return array[randomInt(0, array.length - 1)];
};

/**
 * Returns a specified number of unique random items.
 */
export const randomItems = (array, count) => {
  if (!Array.isArray(array) || array.length === 0 || count <= 0) {
    return [];
  }

  return shuffle(array).slice(0, Math.min(count, array.length));
};