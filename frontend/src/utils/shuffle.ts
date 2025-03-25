// Based on Knuth's version of the Fisher-Yates shuffle
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

export const shuffle = <T>(arr: T[]): T[] => {
  let shuffledArray = [...arr];
  for (let i = shuffledArray.length - 1; i >= 1; i--) {
    // Get random number (index) between 0 and i
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at current index and random index
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
