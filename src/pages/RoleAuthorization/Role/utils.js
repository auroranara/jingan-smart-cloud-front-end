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

export function getSelectedTree(selected, tree, childProp='childMenus') {
  if (!tree || !tree.length)
    return [];
  return tree.reduce((prev, next) => {
    const { id, [childProp]: childMenus } = next;
    if (selected.includes(id)) {
      const node = { ...next };
      const children = getSelectedTree(selected, childMenus, childProp);
      if (children.length)
        node[childProp] = children;
      else
        delete node[childProp];
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

// 当children属性为空数组时，在对象上删除这个属性
export function removeEmptyChildren(list) {
  if (!Array.isArray(list))
    return [];

  list.forEach(item => {
    if (!item.children)
      return;
    if (!item.children.length)
      delete item.children;
    else
      removeEmptyChildren(item.children);
  });
  return list;
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
  const idMap = {};
  traverse(list, item => {
    const { id, parentId, children } = item;
    idMap[id] = {
      parentId,
      childIds: children ? children.map(({ id }) => id) : [], // 只是子节点的id
      allChildIds: getChildIds(item, cache), // 所有子孙节点的id
      node: item,
    };
  });
  return idMap;
}

export function getNewMsgs(id, state, idMap) { // msgs -> newMsgs
  const root = '0';
  const newState = { ...state };
  const current = newState[id] = !state[id];
  const { parentId, allChildIds } = idMap[id];
  let parent = parentId;
  while (parent !== root) { // 非顶层节点才要考虑所有父节点问题
    if (current) // 选中时，同级节点都已经选中，则父节点选中
      newState[parent] = idMap[parent].childIds.every(id => newState[id]);
    else // 取消选中时，父节点必然取消选中
      newState[parent] = false;
    parent = idMap[parent].parentId;
  }

  allChildIds.forEach(id => newState[id] = current); // 勾上则子节点全打勾，取消则子节点全取消

  return newState;
}

export function getNewAccountMsgs(id, i, state, idMap) { // msgs -> newMsgs
  const root = '0';
  const newState = Object.entries(state).reduce((prev, next) => {
    const [id, [mobile, app]] = next;
    prev[id] = [mobile, app];
    return prev;
  }, {});
  let checks = newState[id];
  if (!checks)
    checks = newState[id] = [];
  const current = checks[i] = !checks[i];
  const { parentId, allChildIds } = idMap[id];
  let parent = parentId;
  while (parent !== root) { // 非顶层节点才要考虑父节点问题
    if (!newState[parent])
      newState[parent] = [];
    if (current) // 选中时，同级节点都已经选中，则父节点选中
      newState[parent][i] = idMap[parent].childIds.every(id =>  newState[id] ? newState[id][i] : false);
    else // 取消选中时，父节点必然取消选中
      newState[parent][i] = false;
    parent = idMap[parent].parentId;
  }

  allChildIds.forEach(id => {
    if (!newState[id])
      newState[id] = [];
    newState[id][i] = current;
  }); // 勾上则子节点全打勾，取消则子节点全取消

  // console.log(id, parentIdMap, state, newState);
  return fixMsgs(newState, i, current);
}

function fixMsgs(state, mobileOrApp, checked) { // mobileOrApp[0 mobile 1 app] checked[0 取消 1 选中]
  const entries = Object.entries(state);
  if (!mobileOrApp && checked) // mobile选中则app比选中
    return entries.reduce((prev, next) => {
      const [id, [mobile, app]] = next;
      if (mobile)
        prev[id] = [true, true];
      else
        prev[id] = [mobile, app];
      return prev;
    }, {});
  if (mobileOrApp && !checked) // app取消则mobile也取消
    return entries.reduce((prev, next) => {
      const [id, [mobile, app]] = next;
      if (!app)
        prev[id] = [false, false];
      else
        prev[id] = [mobile, app];
      return prev;
    }, {});
  return state;
}

// {"messageTypeId":"id","appAcceptStatus":0,"webAcceptStatus":0} 0 不接收 1 接受
export function convertToMsgs(list, idMap) {
  if (!Array.isArray(list))
    return {};
  const ids = list.map(({ messageTypeId }) => messageTypeId);
  const filteredIds = removeParentId(ids, idMap); // 过滤掉不存在的节点，以及修正父节点选中而子孙节点未全选中的情况
  const filteredList = list.filter(({ messageTypeId }) => filteredIds.includes(messageTypeId));
  return filteredList.reduce((prev, next) => {
    const { messageTypeId, appAcceptStatus, webAcceptStatus } = next;
    prev[messageTypeId] = [appAcceptStatus, webAcceptStatus].map(s => !!+s);
    return prev;
  }, {});
}

export function convertToMsgList(msgs) {
  return Object.entries(msgs).reduce((prev, next) => {
    const [id, [mobile, app]] = next;
    prev.push({ messageTypeId: id, appAcceptStatus: +!!mobile, webAcceptStatus: +!!app });
    return prev;
  }, []);
}

// 补上半选的父节点，逻辑为遍历数组，加入当前节点的往上的所有父节点，避免重复添加就行
export function addParentId(ids, idMap) {
  const root = '0';
  let parents = []; // 需要添加的父节点数组
  for(let id of ids) {
    let parent = idMap[id].parentId;
    while(parent !== root) { // 添加当前节点的所有父节点
      if (!parents.includes(parent) && !ids.includes(parent)) // 当父节点已经存在于需要添加的数组或本身就包含时，不需要重复添加
        parents.push(parent);
      parent = idMap[parent].parentId;
    }
  }
  return ids.concat(parents);
}

// 剔除半选的父节点，逻辑为遍历数组，查看当前节点的所有子节点是否存在于数组中，不存在就删除，存在就保留
export function removeParentId(ids, idMap) {
  if (!Array.isArray(ids))
    return [];
  const parents = []; // 需要剔除的父节点数组
  for (let id of ids) {
    const targetMap = idMap[id]; // 若id在树中不存在，则当前id也要过滤掉
    if (!targetMap) {
      parents.push(id);
      continue;
    }
    // const { childIds } = targetMap;
    // if (childIds.length && !childIds.every(id => ids.includes(id))) // 当前节点有子节点，且不是每个子节点都包含在数组中
    //   parents.push(id);
    const { allChildIds } = targetMap;
    if (allChildIds.length && !allChildIds.every(id => ids.includes(id))) // 当前节点有子节点，且不是所有子孙节点都包含在数组中
      parents.push(id);
  }
  return ids.filter(id => !parents.includes(id));
}
