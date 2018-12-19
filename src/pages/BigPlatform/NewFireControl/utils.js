export function fillZero(n, zeroLength=2) {
  const num = Number.parseInt(n, 10);
  return `${[...Array(Math.max(zeroLength - num.toString().length, 0)).keys()].fill(0).join('')}${num}`;
}

export function myParseInt(n) {
  return Number.parseInt(n, 10);
}

export function getGridId(gridId, initVal='index') {
  return !gridId || gridId === initVal ? undefined : gridId;
}

// 遍历新数组，若新数组的项目不存在于老数组中，则为新项目
export function getNewAlarms(newList, formerList) {
  const items = [];
  for(const item of newList)
    if (!formerList.find(({ id }) => item.id === id))
      items.push(item);

  return items;
}

export function getUrl(arr) {
  if (!Array.isArray(arr) || !arr.length)
    return '';

  for (const { fileWebUrl } of arr) {
    if (typeof fileWebUrl !== 'string')
      continue;

    const url = fileWebUrl.split(',').filter(u => u);
    if (url.length)
      return url[0];
  }

  return '';
}

export const TREE_DATA = [{
  title: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: 'Child Node1',
    value: '0-0-1',
    key: '0-0-1',
  }, {
    title: 'Child Node2',
    value: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: 'Node2',
  value: '0-1',
  key: '0-1',
}];

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
