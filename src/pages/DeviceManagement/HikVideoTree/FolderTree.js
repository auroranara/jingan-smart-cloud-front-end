import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Tree, Icon, Spin } from 'antd';

const { TreeNode } = Tree;

// export function getIdMap(list = [], idMap = {}) {
//   list.forEach(li => {
//     const { id, parentId = null, children } = li;
//     idMap[id] = parentId;
//     if (children)
//       getIdMap(children, idMap);
//   });
// }

function renderTreeNodes(data, searchValue) {
  return data.map((item) => {
    const index = item.name.indexOf(searchValue);
    const beforeStr = item.name.slice(0, index);
    const afterStr = item.name.slice(index + searchValue.length);
    const title = index > -1 ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr}
      </span>
    ) : <span>{item.name}</span>;

    if (item.children) {
      return (
        <TreeNode
          icon={<Icon type="folder" />}
          title={title}
          key={item.id}
          dataRef={item}
          isLeaf={item.isLeaf}
        >
          {renderTreeNodes(item.children, searchValue)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        icon={<Icon type="folder" />}
        title={title}
        key={item.id}
        dataRef={item}
        isLeaf={item.isLeaf}
      />
    );
  });
};

@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/fetchFolderTree'],
}))
export default class FolderTree extends PureComponent {
  componentDidMount() {
    const { dispatch, handleExpand } = this.props;
    dispatch({
      type: 'video/fetchFolderTree',
      callback(list) {
        // 当sessionStorage中的缓存值存在，展开缓存值，不存在时默认展开第一个
        const expandedKeys = sessionStorage.getItem('expandedKeys');
        // expandedKeys存在且不为空数组
        if (expandedKeys && JSON.parse(expandedKeys).length)
          handleExpand(JSON.parse(expandedKeys), true);
        else if (list && list.length) {
          handleExpand([list[0].id], true);
        }
      },
    });
  }

  render() {
    const {
      video: {
        folderList,
      },
      loading,
      searchValue,
      expandedKeys,
      autoExpandParent,
      selectedKeys,
      handleExpand,
      handleSelect,
    } = this.props;

    // console.log(searchValue, expandedKeys, selectedKeys, autoExpandParent);

    return (
      <section>
        <Row>
          <Spin spinning={loading}>
            <Tree
              showLine
              showIcon
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={handleSelect}
              onExpand={expandedKeys => handleExpand(expandedKeys, false)}
            >
              {renderTreeNodes(folderList, searchValue)}
            </Tree>
          </Spin>
        </Row>
      </section>
    );
  }
}
