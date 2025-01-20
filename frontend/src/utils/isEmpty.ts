// https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
export const isEmpty = (object: Object): boolean => {
  for (var _ in object) return false;
  return true;
};
