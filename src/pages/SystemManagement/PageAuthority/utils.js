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
    item.title = item.showZname;
    item.value = item.key = item.id;
    item.children = item.childMenus;
  }, 'childMenus');
}

export function renderRoleTreeNodes(data) {
  return data.map((item) => {
    if (item.childMenus) {
      return (
        <TreeNode title={item.showZname} key={item.id} dataRef={item}>
          {renderRoleTreeNodes(item.childMenus)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.showZname} key={item.id} dataRef={item} />;
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

// 返回目标项目的children数组
function findTargetInTree(targetId, tree) {
  if (!tree || !Array.isArray(tree) || !tree.length)
    return;

  if (targetId === '0')
    return tree;

  let result;
  for(const { id, children } of tree) {
    if (targetId === id)
      result = children;
    else
      result = findTargetInTree(targetId, children);

    if (result)
      return result;
  }
}

// 获取sort值，编辑时sorts数组要先把当前项目对应的sort排除，以保证其位置不会变化
export function getSortValue(parentId, tree, currentId) {
  const target = findTargetInTree(parentId, tree);
  if (!target)
    return [0, []];
  const sorts = target.filter(({ id }) => id !== currentId).map(({ sort }) => +sort).filter(sort => typeof sort === 'number');
  let sort = 0;
  while (sorts.includes(sort))
    sort++;
  return [sort, sorts];
}

function getBase64Image(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
  const dataURL = canvas.toDataURL("image/"+ext);
  return dataURL;
}

export function getBase64FromUrl(src, callback) {
  const tempImage = new Image();
  tempImage.crossOrigin = "*";
  tempImage.onload = function(){
    const base64 = getBase64Image(tempImage);
    callback(base64);
  };
  tempImage.src = src;
}
