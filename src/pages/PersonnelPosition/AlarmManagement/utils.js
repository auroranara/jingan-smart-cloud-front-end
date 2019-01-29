import { message } from 'antd';

// function cloneList(list, getNewItem) {
//   return list.map(function(item) {
//     const children = item.children;
//     const newItem = getNewItem(item);
//     if (children)
//       newItem.children = cloneList(children);
//     return newItem;
//   });
// }

// export function handleSectionTree(list) {
//   return cloneList(list, ({ id, name }) => {
//     return { title: name, value: id, key: id };
//   });
// }

export const CK_VALUES = [2, 3, 4, 5];
export const CK_OPTIONS = ['越界', '长时间不动', '超员', '缺员'].map((label, i) => ({ label, value: CK_VALUES[i] }));

export function handleAllCards(list) {
  return list.map(({ id, type, code, userName, visitorName }) => ({
      cardId: id,
      cardCode: code,
      userName: type === '0' ? userName : '访客',
      // userName: type === '0' ? userName : `访客${visitorName ? `-${visitorName}` : ''}`,
  }));
}

export function msgCallback(code, msg) {
  message[code === 200 ? 'success' : 'error'](msg);
}

export function handleInitFormValues(values, selected, props) {
  return selected.reduce((prev, next) => [...prev, ...props[next]], []).reduce((prev, next) => {
    if (next === 'canEnterUsers')
      prev[next] = values[next].map(({ cardId }) => cardId);
    else
      prev[next] = values[next]
    return prev;
  }, {});
}
