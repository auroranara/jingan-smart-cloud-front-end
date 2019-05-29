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

const CHECK_NONE = 0; // 全不选
const CHECK_PART = 1; // 半选
const CHECK_ALL = 2; // 全选
export function getChecked(status) { // [indeterminate, checked] indeterminate控制半选还是全选的样式，checked表示选中状态
  switch(+status) {
    case CHECK_NONE:
      return [false, false];
    case CHECK_PART:
      return [true, true];
    case CHECK_ALL:
      return [false, true];
    default:
      return [false, false];
  }
}

function getNextStatus(status) { // 点击时下一个状态只可能是全选或全不选
  status = status ? +status : 0;
  // if (hasChild) { // 有子元素，则有三种状态
  //   if (status === CHECK_ALL) // 全选点击时，下一个状态是全不选
  //     return CHECK_NONE;
  //   return CHECK_ALL; // 半选或全不选点击时，下一个状态是全选
  // }

  // 没有子元素，只有两种状态，无半选
  if (status === CHECK_ALL)
    return CHECK_NONE;
  return CHECK_ALL;
}

// export function getNewMsgs(id, state, idMap) { // msgs -> newMsgs
//   const root = '0';
//   const newState = { ...state };
//   const current = newState[id] = !state[id];
//   const { parentId, allChildIds } = idMap[id];
//   let parent = parentId;
//   while (parent !== root) { // 非顶层节点才要考虑所有父节点问题
//     if (current) // 选中时，同级节点都已经选中，则父节点选中
//       newState[parent] = idMap[parent].childIds.every(id => newState[id]);
//     else // 取消选中时，父节点必然取消选中
//       newState[parent] = false;
//     parent = idMap[parent].parentId;
//   }

//   allChildIds.forEach(id => newState[id] = current); // 勾上则子节点全打勾，取消则子节点全取消

//   return newState;
// }

export function getNewMsgs(id, state, idMap) { // msgs -> newMsgs
  const root = '0';
  const newState = { ...state };
  const current = newState[id] = getNextStatus(state[id]); // 点击节点的下一状态只可能是全选或全不选
  const { parentId, allChildIds } = idMap[id];
  let parent = parentId;
  while (parent !== root) { // 非顶层节点才要考虑所有父节点问题
    const statuses = idMap[parent].childIds.map(id => newState[id]); // newState[id]可能为undefined，等同于0
    newState[parent] = getFatherNodeStatus(current, statuses);
    // if (current) // 全选时，同级节点都全选，则父节点全选，否则为半选
    //   newState[parent] = statuses.every(s => s === CHECK_ALL) ? CHECK_ALL : CHECK_PART;
    // else // 取消选中时，同级子节点都未选中，则父节点未选中，否则未半选
    //   newState[parent] = statuses.every(s => !s) ? CHECK_NONE : CHECK_PART;
    parent = idMap[parent].parentId;
  }

  allChildIds.forEach(id => newState[id] = current); // 全选则子节点全打勾，取消则子节点全取消

  return newState;
}

// 点击时修正父节点的状态
function getFatherNodeStatus(current, statuses) {
  if (current) // 全选时，同级节点都全选，则父节点全选，否则为半选
    return statuses.every(s => s === CHECK_ALL) ? CHECK_ALL : CHECK_PART;
  // 取消选中时，同级子节点都未选中，则父节点未选中，否则未半选
  return statuses.every(s => !s) ? CHECK_NONE : CHECK_PART;
}

export function getInitialMsgs(ids, idMap) {
  ids = ids.filter(id => idMap[id]); // 过滤掉不存在于树中的节点
  return ids.reduce((prev, next) => {
    const { allChildIds } = idMap[next];
    let status;
    if (allChildIds.length) { // 有子节点，通过子节点选中状态判断
      const statuses = allChildIds.map(childId => ids.includes(childId)); // 当前节点的所有子孙节点在ids中是否存在
      status = getCurrentNodeStatus(statuses);
    } else // 没有子节点，保留当前状态
      status = ids.includes(next) ? CHECK_ALL : CHECK_NONE;
    prev[next] = status;
    return prev;
  }, {});
}

// 初始化时当前节点的状态
function getCurrentNodeStatus(statuses) {
  if (statuses.every(s => s)) // 全存在
    return CHECK_ALL;
  if (statuses.every(s => !s)) // 全都不存在
    return CHECK_NONE;
  return CHECK_PART; // 部分存在
}

// export function getNewAccountMsgs(id, i, state, idMap) { // msgs -> newMsgs
//   const root = '0';
//   const newState = Object.entries(state).reduce((prev, next) => {
//     const [id, [mobile, app]] = next;
//     prev[id] = [mobile, app];
//     return prev;
//   }, {});
//   let checks = newState[id];
//   if (!checks)
//     checks = newState[id] = [];
//   const current = checks[i] = !checks[i];
//   const { parentId, allChildIds } = idMap[id];
//   let parent = parentId;
//   while (parent !== root) { // 非顶层节点才要考虑父节点问题
//     if (!newState[parent])
//       newState[parent] = [];
//     if (current) // 选中时，同级节点都已经选中，则父节点选中
//       newState[parent][i] = idMap[parent].childIds.every(id =>  newState[id] ? newState[id][i] : false);
//     else // 取消选中时，父节点必然取消选中
//       newState[parent][i] = false;
//     parent = idMap[parent].parentId;
//   }

//   allChildIds.forEach(id => {
//     if (!newState[id])
//       newState[id] = [];
//     newState[id][i] = current;
//   }); // 勾上则子节点全打勾，取消则子节点全取消

//   // console.log(id, parentIdMap, state, newState);
//   return fixMsgs(newState, i, current);
// }

function isExist(arg) {
  return arg !== undefined && arg !== null;
}

export function getNewAccountMsgs(id, i, state, idMap, nextStatus) { // msgs -> newMsgs nextStatus只能是全选或不选状态，不可能是半选状态
  const root = '0';
  const newState = Object.entries(state).reduce((prev, next) => {
    const [id, [mobile, app]] = next;
    prev[id] = [mobile, app];
    return prev;
  }, {});
  let checks = newState[id];
  if (!checks)
    checks = newState[id] = [0, 0];
  if (!isExist(nextStatus))
    nextStatus = getNextStatus(checks[i]);
  const current = checks[i] = nextStatus;
  const { parentId, allChildIds } = idMap[id];
  let parent = parentId;
  while (parent !== root) { // 非顶层节点才要考虑父节点问题
    if (!newState[parent])
      newState[parent] = [0, 0];
    const statuses = idMap[parent].childIds.map(id =>  newState[id] ? newState[id][i] : 0);
    newState[parent][i] = getFatherNodeStatus(current, statuses);
    // if (current) // 选中时，同级节点都全选，则父节点全选，否则半选
    //   newState[parent][i] = statuses.every(s => s === CHECK_ALL) ? CHECK_ALL : CHECK_PART;
    // else // 取消选中时，同级子节点都未选中，则父节点未选中，否则半选
    //   newState[parent][i] = statuses.every(s => !s) ? CHECK_NONE : CHECK_PART;
    parent = idMap[parent].parentId;
  }

  allChildIds.forEach(id => {
    if (!newState[id])
      newState[id] = [0, 0];
    newState[id][i] = current;
  }); // 勾上则子节点全打勾，取消则子节点全取消

  // console.log(id, parentIdMap, state, newState);
  return fixMsgs(id, newState, i, current, idMap);
}

// function fixMsgs(state, mobileOrApp, checked) { // mobileOrApp[0 mobile 1 app] checked[0 取消 1/2 选中]
//   const entries = Object.entries(state);
//   if (!mobileOrApp && checked) // mobile选中则app必选中
//     return entries.reduce((prev, next) => {
//       const [id, [mobile, app]] = next;
//       if (mobile)
//         prev[id] = [mobile, mobile];
//       else
//         prev[id] = [mobile, app];
//       return prev;
//     }, {});
//   if (mobileOrApp && !checked) // app取消则mobile也取消
//     return entries.reduce((prev, next) => {
//       const [id, [mobile, app]] = next;
//       if (!app)
//         prev[id] = [0, 0];
//       else
//         prev[id] = [mobile, app];
//       return prev;
//     }, {});
//   return state;
// }

function fixMsgs(id, state, mobileOrApp, status, idMap) { // mobileOrApp[0 mobile 1 app] checked[0 取消 2 全选]
  const [mobile, app] = state[id];
  if (!mobileOrApp && status && app !== CHECK_ALL) // mobile全选，且app未全选则将app全选
    return getNewAccountMsgs(id, 1, state, idMap, status);
  if (mobileOrApp && !status && mobile) // app全不选且mobile部分或全选，则将mobile也设值为全不选
    return getNewAccountMsgs(id, 0, state, idMap, status);
  return state;
}

// {"messageTypeId":"id","appAcceptStatus":0,"webAcceptStatus":0} 0 不接收 1 接受
// export function convertToMsgs(list, idMap) {
//   if (!Array.isArray(list))
//     return {};
//   const ids = list.map(({ messageTypeId }) => messageTypeId);
//   const filteredIds = removeParentId(ids, idMap); // 过滤掉不存在的节点，以及修正父节点选中而子孙节点未全选中的情况
//   const filteredList = list.filter(({ messageTypeId }) => filteredIds.includes(messageTypeId));
//   return filteredList.reduce((prev, next) => {
//     const { messageTypeId, appAcceptStatus, webAcceptStatus } = next;
//     prev[messageTypeId] = [appAcceptStatus, webAcceptStatus].map(s => !!+s);
//     return prev;
//   }, {});
// }

export function convertToMsgs(list, idMap) {
  if (!Array.isArray(list))
    return {};
  const filteredList = list.filter(({ messageTypeId }) => idMap[messageTypeId]); // 过滤掉不存在的节点
  const msgs = filteredList.reduce((prev, next) => {
    const { messageTypeId, appAcceptStatus, webAcceptStatus } = next;
    prev[messageTypeId] = [appAcceptStatus, webAcceptStatus].map(s => +s);
    return prev;
  }, {});

  const ids = filteredList.map(({ messageTypeId }) => messageTypeId);
  const newMsgs = {};
  ids.forEach(id => {
    const { allChildIds } = idMap[id];
    let sts;
    if (allChildIds.length) { // 当前节点有子节点，状态由子节点状态绝对
      const statuses = allChildIds.map(childId => msgs[childId] ? msgs[childId] : [0, 0]);
      const stsList = statuses.reduce((prev, next) => {
        prev.forEach((lst, i) => lst.push(next[i]));
        return prev;
      }, [[], []]);
      sts = [0, 1].map(i => getCurrentNodeStatus(stsList[i]));
    } else // 当前节点无子节点 0->未选 1->全选
      sts = msgs[id].map(s => s ? CHECK_ALL : CHECK_NONE);

    newMsgs[id] = sts;
  });
  return newMsgs;
}

// export function convertToMsgList(msgs) {
//   return Object.entries(msgs).reduce((prev, next) => {
//     const [id, [mobile, app]] = next;
//     prev.push({ messageTypeId: id, appAcceptStatus: +!!mobile, webAcceptStatus: +!!app });
//     return prev;
//   }, []);
// }

export function convertToMsgList(msgs) {
  return Object.entries(msgs).reduce((prev, next) => {
    const [id, [mobile, app]] = next;
    prev.push({ messageTypeId: id, appAcceptStatus: +!!mobile, webAcceptStatus: +!!app }); // 0->0 1/2->1
    return prev;
  }, []);
}

// 全选的时候，将树转化为对应的msg state
export function treeConvertToMsgs(list) {
  const msgs = {};
  traverse(list, ({ id }) => {
    msgs[id] = [CHECK_ALL, CHECK_ALL];
  });
  return msgs;
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
