import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export const TREE = [{
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

export const METHODS = ['GET', 'PUT', 'POST', 'DELETE'];
export const NODE_TYPES = ['menu', 'node', 'page', 'button'];
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};

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

export function getIdMap(tree) {
  const idMap = {};
  const codeMap = {};
  traverse(tree, ({ id, code, parentIds }) => {
    codeMap[id] = code;
    idMap[id] = parentIds.split(',').filter(id => id);
  }, 'childMenus');

  // 手动添加顶层父节点 0 对应的值
  idMap[0] = [];
  codeMap[0] = '';
  return [idMap, codeMap];
}

export function addProps(tree) {
  traverse(tree, item => {
    item.title = item.showZname || item.showName;
    item.value = item.key = item.id;
    item.children = item.childMenus;
  }, 'childMenus');
}

export function renderRoleTreeNodes(data) {
  return data.map((item) => {
    if (item.childMenus) {
      return (
        <TreeNode title={item.showZname || item.showName} key={item.id} dataRef={item}>
          {renderRoleTreeNodes(item.childMenus)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.showZname || item.showName} key={item.id} dataRef={item} />;
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
