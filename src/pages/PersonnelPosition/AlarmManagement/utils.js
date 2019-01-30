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
      userName: type === '0' ? userName || '未领' : '访客',
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
      prev[next] = String(values[next]); // 原来是数字，直接传到Form中的Input，提交的时候不会报错，但是validateFields中的回调函数也不会被调用
    return prev;
  }, {});
}

export function getRangeMsg(min, max) {
  if (min && max)
    return `(下级区域设定的值)${min} <= n <= ${max}(上级区域设定的值)`;
  else if (min)
    return `n >= ${min}(下级区域设定的值)`;
  return `n <= ${max}(上级区域设定的值)`;
}

function isJSON(json) {
  if (json !== null && typeof json === 'object')
    return true;

  if (typeof json === 'string') {
    const first = json[0];
    const last = json[json.length - 1];
    if (first === '[' && last === ']' || first === '{' && last === '}')
      return true;
  }

  return false;
}

export function getJSONProp(json, prop) {
  if (isJSON(json))
    return JSON.parse(json)[prop];
}
