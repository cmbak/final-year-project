// Return whether 2 arrays of numbers containg the same elements
export const arraysEquals = (arr1: number[], arr2: number[]): boolean => {
  // Arrays should be of same length
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    // And there should be the same elements in both arrays
    if (!arr2.includes(arr1[i])) return false;
  }
  return true;
};
