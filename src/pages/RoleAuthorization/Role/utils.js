export const LIST_PAGE_SIZE = 24;

export function getUnitTypeLabel(type, types) {
  if (!types || !types.length || !type)
    return;
  const target = types.find(({ id }) => type === id);
  if (!target)
    return;
  return target.label;
}

/* 根据选中的子节点获取父节点 */
export function checkParent(list, permissions) {
  let newList = [];
  list.forEach(item => {
    const { id, childMenus } = item;
    if (childMenus) {
      const newChildMenu = checkParent(childMenus, permissions);
      if (newChildMenu.length !== 0) {
        newList = newList.concat(newChildMenu, id);
      }
    } else {
      permissions.includes(id) && newList.push(id);
    }
  });
  return newList;
};

/* 移除子元素未全部选中的父元素 */
export function uncheckParent(list, permissions) {
  let newList = [];
  list.forEach(({ id, childMenus }) => {
    if (childMenus) {
      const newChildMenu = uncheckParent(childMenus, permissions);
      if (newChildMenu.length !== 0) {
        newList = newList.concat(newChildMenu);
        if (childMenus.every(({ id }) => newChildMenu.includes(id))) {
          newList = newList.concat(id);
        }
      }
    } else {
      permissions.includes(id) && newList.push(id);
    }
  });
  return newList;
};

/* 对树排序 */
export function sortTree(list) {
  const newList = [];
  list.forEach(item => {
    const { childMenus, sort } = item;
    if (!sort && sort !== 0) {
      newList.push({
        ...item,
      });
      return;
    }
    if (childMenus) {
      newList[sort] = {
        ...item,
        childMenus: sortTree(childMenus),
      };
    } else {
      newList[sort] = {
        ...item,
      };
    }
  });
  for (var i = newList.length - 1; i >= 0; i--) {
    if (!newList[i]) {
      newList.splice(i, 1);
    }
  }
  return newList;
};

/* 获取无数据 */
export function getEmptyData() {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

/* 设置相对定位 */
export function getRootChild() {
  return document.querySelector('#root>div');
}

// 阻止默认行为
export function preventDefault(e) {
  e.preventDefault();
};

/* 去除两边空格 */
export function transform(value) {
  return value.trim();
}
