import React from 'react';
import { Tree, TreeSelect } from 'antd';

import { MAI, GOV, OPE, COM } from '@/pages/RoleAuthorization/Role/utils';
import { getFileList } from '@/pages/BaseInfo/utils';

const initRouters = require('../../../../config/router.config');
const routes = initRouters(process.env.PROJECT_ENV);

const { TreeNode } = Tree;
const { TreeNode: TreeSelectNode } = TreeSelect;

export const FIELD_LABELS = {
  loginName: '用户名',
  password: '密码',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
  treeIds: '数据权限',
  roleId: '配置角色',
  departmentId: '所属部门',
  gridIds: '所属网格',
  userType: '用户角色',
  documentTypeId: '执法证种类',
  execCertificateCode: '执法证编号',
  regulatoryClassification: '业务分类',
  sex: '性别',
  birthday: '生日',
  degree: '学历',
  attached: '学历附件',
  major: '专业',
};

export const DEFAULT_PAGE_SIZE = 20;
export const FOLDER = 'accountDegree';
export const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';

export const SUPERVISIONS = [
  { id: '1', label: '安全生产' },
  { id: '2', label: '消防' },
  { id: '3', label: '环保' },
  { id: '4', label: '卫生' },
];

export const SUPERVISIONS_ALL = SUPERVISIONS.map(({ id }) => id);

export const SEXES = [
  { key: '0', label: '男' },
  { key: '1', label: '女' },
];
export const DEGREES = [
  {key: '0', label: '初中'},
  {key: '1', label: '高中'},
  {key: '2', label: '中专'},
  {key: '3', label: '大专'},
  {key: '4', label: '本科'},
  {key: '5', label: '硕士'},
  {key: '6', label: '博士'},
];

export function getInitPhotoList(list) {
  if (!Array.isArray(list))
    return [];
  return list.map(({ id, fileName, webUrl, dbUrl }) => ({ uid: id, name: fileName, url: webUrl, dbUrl, response: { code: 200 } }));
}

export function getSubmitPhotoList(list) {
  return list.map(({ uid, name, url, dbUrl }) => ({ id: uid, fileName: name, webUrl: url, dbUrl }));
}

export function handleFileList(list) {
  return getFileList(list).filter(({ response }) => response && response.code === 200);
}

export function renderSearchedTreeNodes(data, searchValue){
  return data.map((item) => {
    const index = item.title.indexOf(searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + searchValue.length);
    const title = index > -1 ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr}
      </span>
    ) : <span>{item.title}</span>;
    if (item.children) {
      return (
        <TreeNode key={item.key} title={title}>
          {renderSearchedTreeNodes(item.children, searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={title} />;
  });
}

export function renderTreeNodes(data, disabledKeys, childrenProp='children', titleProp='title', keyProp='key', allDisabled) {
  // disabledKeys也可以为数组拼接成的字符串，作用与数组同
  disabledKeys = disabledKeys || [];
  return data.map((item) => {
    const children = item[childrenProp];
    const disabled = allDisabled || disabledKeys.includes(item[keyProp]); // allDisabled为true，则总返回true，为false，则返回值取决于disabledKeys
    const title = item[titleProp];
    const key = item[keyProp];
    if (children) {
      return (
        <TreeNode disabled={disabled} title={title} key={key} dataRef={item}>
          {renderTreeNodes(children, disabledKeys, childrenProp, titleProp, keyProp, allDisabled)}
        </TreeNode>
      );
    }
    return <TreeNode disabled={disabled} title={title} key={key} dataRef={item}/>;
  });
}

// 遍历树
function traverse(tree, callback, childProp='children') {
  tree.forEach(item => {
    callback(item);
    if (item[childProp])
      traverse(item[childProp], callback, childProp);
  });
}

// 排序
export function sortTree(tree, sortProp='sort', childrenProp='childMenus') {
  tree.sort((n1, n2) => n1[sortProp] - n2[sortProp]);
  tree.forEach(item => {
    const children = item[childrenProp];
    if (children)
      sortTree(children, sortProp, childrenProp);
  });
}

// 获取选择的子节点所对应的父节点
export function getParentKeys(tree, value) {
  const parentIds = [];
  traverse(tree, ({ title, parentId }) => {
    if (title.includes(value) && parentId && !parentIds.includes(parentId))
      parentIds.push(parentId);
  });

  return parentIds;
}

// 初始化时，根据获取的keys数组，展开树，以下方法，若某父节点全选，则只展开其自身，其下的子节点不再展开，半选的父节点都会展开
export function getInitParentKeys(tree, keys) {
  const parentIds = [];
  traverse(tree, ({ key, parentId, children }) => {
    const isIncluded = keys.includes(key);
    if (isIncluded && parentId && !parentIds.includes(parentId))
      parentIds.push(parentId);

    // 若当前节点为父节点，则将其加入parentIds数组
    if (isIncluded && children && !parentIds.includes(key))
      parentIds.push(key);
  });

  return parentIds;
}

// 获取树中该节点下所有子节点的总数(子节点，孙子节点...的总数)
function getTreeCount(item, totalMap) {
  const { children, key } = item;

  if (children) {
    const total = children.length + children.reduce((prev, next) => {
      return prev + getTreeCount(next, totalMap);
    }, 0);
    totalMap[key] = total;
    return total;
  }

  return 0;
}

// 获取树中 key => 节点总数 的映射
export function getTotalMap(treeList) {
  const totalMaps = [];
  treeList.forEach((item, index) => {
    totalMaps[index] = {};
    getTreeCount(item, totalMaps[index]);
  });

  return totalMaps.reduce((prev, next) => Object.assign(prev, next), {});
}

/* 剔除checkedKeys中父节点全选时，对应的子节点，方法为对有序数组序数进行操作
 * Tree中的checkedKeys，当某父节点全选时，父节点和其对应的所有子节点会出现在数组中，而半选时，父节点不在该数组中，
 * 当给Tree的checkedKeys中，只有父节点的值，而不包含其所有子节点的值时，树中的父节点及其下所有子节点都会被选中
 * 所以只需要全选时，父节点的序数加上父节点下所有子节点的个数再加一，即为Tree中下一个不属于该父节点下的子节点的checkedKey，用此方法筛选速度很快
 * 但是，当从后台获取上述处理过的值时，要对checkedKeys数组补充完整，否则在提交时用上述方法会出问题
 */
export function handleMtcTree(checkedList, totalMap) {
  // const totalMap = getTotalMap(treeList);
  let i = 0;
  const result = [];
  while (i < checkedList.length) {
    const key = checkedList[i];
    const len = totalMap[key];
    result.push(key);
    if (len)
      i += len + 1;
    else
      i++;
  }

  return result;
}

// 获取树中从上到下每个节点的序号，最小的在最上面，以对乱序checkedKeys进行排序，使其顺序符合原来的树的顺序，以好进行父节点下的子节点全选时剔除对应的所有子节点的操作
export function getSortMap(treeList) {
  let index = 0;
  const sortMap = {};
  traverse(treeList, item => {
    sortMap[item.key] = index++;
  });
  return sortMap;
}

// 获取父节点下所有子节点的key值数组
function getChildrenMap(item, childrenMap) {
  const { children, key } = item;
  if (children) {
     const keys = children.reduce((prev, next) => prev.concat(getChildrenMap(next, childrenMap)), children.map(({ key }) => key));
     childrenMap[key] = keys.length ? keys : undefined;
     return keys;
  }
  return [];
}

export function getTreeListChildrenMap(treeList) {
  return treeList.reduce((prev, next) => {
    const cMap = {};
    getChildrenMap(next, cMap);
    return Object.assign(prev, cMap);
  }, {});
}

// 暴力点的方法，父节点全选时，遍历子数组，在其中找出所有子节点，并删除
export function handleMtcTreeViolently(checkedList, childrenMap) {
  if (!checkedList || !Array.isArray(checkedList))
    return;

  // 标记数组
  const flags = Array(checkedList.length).fill(true);
  // 遍历数组，若当前节点为父节点且未被标记为false，则在其中再遍历数组，找出其对应的子节点，对应位置都标记为false，不是，则不做处理
  checkedList.forEach((key, i) => {
    const childrenKeys = childrenMap[key];
    if (childrenKeys && flags[i])
      checkedList.forEach((k, j) => {
        if (childrenKeys.includes(k))
          flags[j] = false;
      });
  });

  return checkedList.filter((key, index) => flags[index]);
}

// 将数组融合并去重
export function mergeArrays(...arrs) {
  return Array.from(new Set(arrs.reduce((prev, next) => prev.concat(next))));
}

// 从源数组中筛选出不存在目标数组中的项目
export function getNoRepeat(origin, target=[]) {
  if (!origin || !Array.isArray(origin))
    return [];
  return origin.filter(item => !target.includes(item));
}

// id => parentIds, id => node
export function getIdMaps(tree) {
  const parentIdMap = {};
  // const childIdMap = {};
  const idMap = {};
  traverse(tree, item => {
    const { id, parentIds, childMenus } = item;
    parentIdMap[id] = parentIds.split(',').filter(k => k !== '0');
    // console.log(id, parentIds);
    // childIdMap[id] = childMenus ? childMenus.map(({ id }) => id) : [];
    idMap[id] = item;
  }, 'childMenus');
  return [parentIdMap, idMap];
}

// 在selectedKeys添加对应父节点，并将不存在于树中的值过滤掉
export function addParentKey(keys, parentIdMap) {
  // 过滤掉不存在于树中的值，由于parentId由源树处理而来，则parentId[id]为undefined的id不存在于树中
  const filteredKeys = keys.filter(k => parentIdMap[k]);

  // 源数组中的所有值默认都被添加过了，所以都标记为true
  const parentsFlag = filteredKeys.reduce((prev, next) => {
    prev[next] = true;
    return prev;
  }, {});

  // 遍历源数组，生成一个要添加的父节点数组
  const parents = filteredKeys.reduce((prev, next) => {
    // 遍历对应的父节点，若在parentsFlag对象中，父节点key值不存在，则未被添加过，将其加入parents数组
    parentIdMap[next].forEach(p => {
      if (!parentsFlag[p]) {
        prev.push(p);
        parentsFlag[p] = true;
      }
    });

    return prev;
  }, []);

  return [...filteredKeys, ...parents];
}

// 找出树中子节点不唯一的父节点
// export function getChildrenNotAloneKeys(tree) {
//   const keys = [];
//   traverse(tree, ({ id, childMenus }) => {
//     const children = childMenus || [];
//     if (children.length > 1)
//       keys.push(id);
//   }, 'childMenus');

//   return keys;
// }

// 获取树的所有子节点中不存在于目标数组中的节点数目
function getNotExist(node, target, cache) {
  const { id } = node;
  const cached = cache[id];
  if (cached !== undefined)
    return cached;

  const children = node.childMenus;
  let counter = 0;
  if (children)
    for (let child of children) {
      // 子节点不包含在目标数组中则计一个数字
      const flag = target.includes(child.id) ? 0 : 1;
      counter += flag + getNotExist(child, target, cache);
    }

  cache[id] = counter;
  return counter;
}

// 对节点下所有子节点进行遍历，若每个节点都在数组中则为全选，否则为半选或未选
export function removeParentKey(keys, idMap) {
  // 以下注掉的代码逻辑是错误的
  // const indexes = keys.reduce((prev, next, i) => {
  //   // 遍历每个项目的所有子节点，若只要有一个不在数组中，则将当前节点序号存入待删除的序号数组中
  //   for (let k of childIdMap[next])
  //     if (!keys.includes(k)) {
  //       prev.push(i);
  //       break;
  //     }

  //   return prev;
  // }, []);

  // idMap为空对象或keys为空数组时，不做任何处理
  if (!Object.keys(idMap).length || !keys.length)
    return [];

  const cache = {};
  const indexes = keys.reduce((prev, next, i) => {
    // 若目标节点含有子元素
    const node = idMap[next];
    if (node && Array.isArray(node.childMenus) && getNotExist(node, keys, cache))
      prev.push(i);

    return prev;
  }, []);

  return keys.filter((k, i) => !indexes.includes(i));
}

// 处理后台传过来的将key值数组拼接成的字符串并去重
export function handleKeysString(str, divider=',') {
  if (Array.isArray(str))
    return str;

  if (typeof str === 'string')
    return str.split(divider).filter(k => k);

  console.warn('permissions is not String or Array in function[handleKeysString] in utils.js');
  return [];
}

// 将当前用户的当前账号过滤掉，不然可以修改自己的账号，当前用户为某一单位的用户，将账号中的users进行过滤，只有当前企业对应的user对其可见
export function getListByUnitId(list, unitType, utId, userId) {
  if (!Array.isArray(list))
    return [];

  const isAdmin = unitType === null || unitType === undefined || +unitType === OPE;
  // const filterNotSelf = list.filter(({ users }) => {
  //   const ids = Array.isArray(users) ? users.map(({ id }) => id) : [];
  //   return !ids.includes(userId);
  // });
  return isAdmin ? list : list.map(item => ({ ...item, users: item.users.filter(({ unitId }) => unitId === utId) }));
}

export function treeData(data) {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id}>
          {treeData(item.children)}
        </TreeSelectNode>
      );
    }
    return <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id} />;
  });
};

export function generateUnitsTree(data) {
  return data.map(item => {
    if (item.child && item.child.length) {
      return (
        <TreeSelectNode title={item.name} key={item.id} value={item.id}>
          {generateUnitsTree(item.child)}
        </TreeSelectNode>
      );
    }
    return <TreeSelectNode title={item.name} key={item.id} value={item.id} />;
  });
};

const TARGET_CODES = ['dashboard', 'companyWorkbench'];
export function getScreenList(treeList, permissions, extraPermissions) {
  const extra = extraPermissions ? extraPermissions.split(',').filter(s => s) : [];
  const [dashboard, workbench] = TARGET_CODES.map(c => treeList.find(t => t.code === c));
  const [dashboardList, workbenchList] = [dashboard, workbench].map(item => item && Array.isArray(item.childMenus) ? item.childMenus : []);
  dashboardList.sort((a1, a2) => a1.sort - a2.sort);
  const list = [workbenchList[0], ...dashboardList].filter(o => o);
  if (!list || !list.length)
    return [];

  console.log(list);
  return list.filter(({ id }) => [permissions, extra].some(ids => ids.includes(id))).filter(({ showZname }) => !showZname.includes('首页'));
}

const ROUTE_MAP = {
  'dashboard.communitySafety': '/big-platform/community-safety',
  'dashboard.education': '/big-platform/education',
  'dashboard.rescue': '/big-platform/rescue',
  'dashboard.view': '/',
};
const SAFE_CODE = 'dashboard.safetyView';
export function getUserPath(code, user) {
  const { unitType, unitId } = user;
  if (code === SAFE_CODE) {
    if ([GOV, OPE].includes(unitType))
      return '/big-platform/safety/government/index';
    return `/big-platform/safety/company/${unitId}`;
  }
  return ROUTE_MAP[code];
}

const WORKBENCH_CODE = 'companyWorkbench.view';
const WORKBENCH_PATH = '/company-workbench/view';
const SYSTEM_MENU_CODE = 'dashboard.menuReveal';
const SYSTEM_MENU_PATH = '/menu-reveal';
export function getPathByCode(code, unitType) {
  if (code === WORKBENCH_CODE)
    return WORKBENCH_PATH;
  if (code === SYSTEM_MENU_CODE)
    return SYSTEM_MENU_PATH;
  const targets = routes[1].routes.filter(r => r.code === code);
  let target = targets[0];
  if (targets.length > 1)
    target = targets.find(t => t.path.includes([GOV, OPE].includes(unitType) ? 'government' : 'company'));

  return target ? target.path : '';
}

export function getRedirectPath(code, unitType, unitId, gridId) {
  let path = getPathByCode(code, unitType);
  const hasUnitId = ['unitId', 'companyId'].some(p => path.includes(p));
  const hasGridId = path.includes('gridId');
  const isUnit = [MAI, COM].includes(unitType);
  if (hasUnitId)
    path = path.replace(/:(unit|company)Id/, isUnit ? unitId : 'index');
  if (hasGridId)
    path = path.replace(/:gridId/, gridId);
  console.log(isUnit, [MAI, COM], unitType);
  return path;
}
