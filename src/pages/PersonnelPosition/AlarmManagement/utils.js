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
