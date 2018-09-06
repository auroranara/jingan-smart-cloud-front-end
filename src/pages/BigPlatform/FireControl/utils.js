export function fillZero(n, zeroLength=2) {
  const num = Number.parseInt(n, 10);
  return `${[...Array(Math.max(zeroLength - num.toString().length, 0)).keys()].fill(0).join('')}${num}`;
}

export function myParseInt(n) {
  return Number.parseInt(n, 10);
}

// Element.getBoundingClientRect 可以代替一下函数
// export function getOffset(prop='left', node=null, show=false) {
//   const key = `offset${prop[0].toUpperCase()}${prop.slice(1)}`;
//   let res = 0;
//   let parent = node;
//   while (parent) {
//     const offset = parent[key];
//     show && console.log('top', offset);
//     res += offset;
//     parent = parent.offsetParent;
//   }

//   return res;
// }
