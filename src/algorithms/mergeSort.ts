export const mergeSortGeneric = <T>(arr: T[], compareFn: (a: T, b: T) => number): T[] => {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortGeneric(arr.slice(0, mid), compareFn);
  const right = mergeSortGeneric(arr.slice(mid), compareFn);
  return mergeGeneric(left, right, compareFn);
};
const mergeGeneric = <T>(left: T[], right: T[], compareFn: (a: T, b: T) => number): T[] => {
  const result: T[] = [];
  while (left.length && right.length) {
    if (compareFn(left[0], right[0]) <= 0) result.push(left.shift()!);
    else result.push(right.shift()!);
  }
  return [...result, ...left, ...right];
};