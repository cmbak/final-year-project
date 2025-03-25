// Create 2d array of numbers/matrix with numEls arrays, with each of these arrays being empty
// https://stackoverflow.com/questions/18163234/declare-an-empty-two-dimensional-array-in-javascript
export const createMatrix = (numEls: number): number[][] => {
  return new Array(numEls).fill(0).map(() => new Array());
};
