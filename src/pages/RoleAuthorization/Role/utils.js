import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

export const LIST_PAGE_SIZE = 24;

export const MAI = 1; // 维保
export const GOV = 2; // 政府
export const OPE = 3; // 运营
export const COM = 4; // 企事业

export const COMMON_LIST_URL = '/role-authorization/commonRole/list';
export const COMMON_DETAIL_URL = '/role-authorization/commonRole/detail';
export const COMMON_ADD_URL = '/role-authorization/commonRole/add';
export const COMMON_EDIT_URL = '/role-authorization/commonRole/edit';
export const COMMON_URLS = {
  listUrl: COMMON_LIST_URL,
  detailUrl: COMMON_DETAIL_URL,
  addUrl: COMMON_ADD_URL,
  editUrl: COMMON_EDIT_URL,
};

export const PRIVATE_LIST_URL = '/role-authorization/userRole/list';
export const PRIVATE_DETAIL_URL = '/role-authorization/userRole/detail';
export const PRIVATE_ADD_URL = '/role-authorization/userRole/add';
export const PRIVATE_EDIT_URL = '/role-authorization/userRole/edit';
export const PRIVATE_URLS = {
  listUrl: PRIVATE_LIST_URL,
  detailUrl: PRIVATE_DETAIL_URL,
  addUrl: PRIVATE_ADD_URL,
  editUrl: PRIVATE_EDIT_URL,
};

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
  permissions = permissions || [];
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

export function getSelectedTree(selected, tree) {
  if (!tree || !tree.length)
    return [];
  return tree.reduce((prev, next) => {
    const { id, childMenus } = next;
    if (selected.includes(id)) {
      const node = { ...next };
      const children = getSelectedTree(selected, childMenus);
      if (children.length)
        node.childMenus = children;
      else
        delete node.childMenus;
      prev.push(node);
    }
    return prev;
  }, []);
}

// 根据unitType判断是否是管理员
export function isAdmin(unitType) {
  if (unitType === undefined || unitType === null || +unitType === 3)
    return true;
  return false;
}

// 生成树节点
export function generateTreeNode(list) {
  return list.map(item => {
    if (item.child && item.child.length) {
      return (
        <TreeNode title={item.name} key={item.id} value={item.id}>
          {generateTreeNode(item.child)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.id} value={item.id} />;
  });
};

// 获取RoleHandler组件中企业和单位类型是否可以编辑
export function getUnitDisabled(isEdit, isCommon, isAdmin) {
  if (isCommon) // 公共角色
    return false;

  // 以下皆为私有角色
  if (isEdit)
    return true;
  // 以下皆为私有角色新增
  if (!isAdmin)
    return true;

  return false;
}

function traverse(list, callback) {
  if (Array.isArray(list))
    list.forEach(item => {
      callback(item);
      traverse(item.children, callback);
    });
}

function getChildIds(item, cache) {
  const { id, children } = item;
  const cachedIds = cache[id];
  if (cachedIds)
    return cachedIds;
  let childIds = [];
  if (Array.isArray(children))
    childIds = children.reduce((prev, next) => [...prev, next.id, ...getChildIds(next, cache)], []);
  cache[id] = childIds;
  return childIds;
}

export function getIdMap(list) {
  const cache = {};
  const parentIdMap = {};
  const childIdsMap = {};
  traverse(list, item => {
    const { id, parentId } = item;
    parentIdMap[id] = parentId;
    childIdsMap[id] = getChildIds(item, cache);
  });
  return [parentIdMap, childIdsMap];
}
