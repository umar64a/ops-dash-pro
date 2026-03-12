export const quickSortGeneric = <T>(arr: T[], compareFn: (a: T, b: T) => number): T[] => {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left: T[] = [];
  const right: T[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (compareFn(arr[i], pivot) < 0) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSortGeneric(left, compareFn), pivot, ...quickSortGeneric(right, compareFn)];
};