import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

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

export function renderTreeNodes(data) {
  return data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });
}

// 遍历树
function traverse(tree, callback) {
  tree.forEach(item => {
    callback(item);
    if (item.children)
      traverse(item.children, callback);
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
    return [];

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

export const TREE = [{
  id: '0-0',
  title: '0-0',
  key: '0-0',
  children: [{
    id: '0-0-0',
    title: '0-0-0',
    key: '0-0-0',
    parentId: '0-0',
    children: [
      { id: '0-0-0-0', title: '0-0-0-0', key: '0-0-0-0', parentId: '0-0-0' },
      { id: '0-0-0-1', title: '0-0-0-1', key: '0-0-0-1', parentId: '0-0-0' },
      { id: '0-0-0-2', title: '0-0-0-2', key: '0-0-0-2', parentId: '0-0-0' },
    ],
  }, {
    id: '0-0-1',
    title: '0-0-1',
    key: '0-0-1',
    parentId: '0-0',
    children: [
      { id: '0-0-1-0', title: '0-0-1-0', key: '0-0-1-0', parentId: '0-0-1' },
      { id: '0-0-1-1', title: '0-0-1-1', key: '0-0-1-1', parentId: '0-0-1' },
      { id: '0-0-1-2', title: '0-0-1-2', key: '0-0-1-2', parentId: '0-0-1' },
    ],
  }, {
    id: '0-0-2',
    title: '0-0-2',
    key: '0-0-2',
    parentId: '0-0',
  }],
}, {
  id: '0-1',
  title: '0-1',
  key: '0-1',
  children: [
    {
      id: '0-1-0',
      title: '0-1-0',
      key: '0-1-0',
      parentId: '0-1',
      children: [
        { id: '0-1-0-0', title: '0-1-0-0', key: '0-1-0-0', parentId: '0-1-0' },
        { id: '0-1-0-1', title: '0-1-0-1', key: '0-1-0-1', parentId: '0-1-0' },
        { id: '0-1-0-2', title: '0-1-0-2', key: '0-1-0-2', parentId: '0-1-0' },
      ],
    },
  ],
}, {
  id: '0-2',
  title: '0-2',
  key: '0-2',
}];
