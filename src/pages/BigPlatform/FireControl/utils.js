export function fillZero(n, zeroLength=2) {
  const num = Number.parseInt(n, 10);
  return `${[...Array(Math.max(zeroLength - num.toString().length, 0)).keys()].fill(0).join('')}${num}`;
}
