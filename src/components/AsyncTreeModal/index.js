import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tree, /* Input, */ Modal, Icon, Spin } from 'antd';

const { TreeNode } = Tree;
// const { Search } = Input;

/**
 * 1. 点击展开异步加载子节点，并且根据当前节点是否被选中来设置子节点选中状态
 * 2. 点击复选框，如果选中，则将子节点都选中，并且判断父节点是半选还是选中，如果当前节点是取消选中，则将子节点都取消选中，并且判断父节点是半选还是选中还是取消选中
 * 3. 点击搜索查询
 */

// 默认的字段
const defaultFieldNames = {
  id: 'id',
  children: 'children',
  title: 'title',
  isLeaf: 'isLeaf',
};
/* 根据parentIds从数组中找到对应的节点并判断选中状态 */
const checkParents = ({ list, parentIds, checkedKeys, fieldNames }) => {
  const { checked, halfChecked } = checkedKeys;
  const { id: idField, children: childrenField } = fieldNames;
  let length = 0;
  list.forEach(({ [idField]: id, [childrenField]: children }) => {
    if (parentIds.includes(id)) {
      const result = checkParents({
        list: children,
        parentIds,
        checkedKeys,
        fieldNames,
      });
      if (result === children.length) {
        checked.push(id);
        const index = halfChecked.indexOf(id);
        if (index !== -1) {
          halfChecked.splice(index, 1);
        }
        length += 1;
      }
      else if (result === 0) {
        let index = checked.indexOf(id);
        if (index !== -1) {
          checked.splice(index, 1);
        }
        index = halfChecked.indexOf(id);
        if (index !== -1) {
          halfChecked.splice(index, 1);
        }
      }
      else {
        halfChecked.push(id);
        const index = checked.indexOf(id);
        if (index !== -1) {
          checked.splice(index, 1);
        }
        length += 0.5;
      }
    }
    else {
      let index = checked.indexOf(id);
      if (index !== -1) {
        length += 1;
      }
      index = halfChecked.indexOf(id);
      if (index !== -1) {
        length += 0.5;
      }
    }
  });
  return length;
};

/* 根据当前节点是否选中来设置子节点 */
const checkChildren = ({ list, checkedKeys, isChecked, fieldNames }) => {
  const { checked, halfChecked } = checkedKeys;
  const { id: idField, children: childrenField } = fieldNames;
  list.forEach(({ [idField]: id, [childrenField]: children }) => {
    let index = checked.indexOf(id);
    if (isChecked) {
      if (index === -1) {
        checked.push(id);
        index = halfChecked.indexOf(id);
        if (index !== -1) {
          halfChecked.splice(index, 1);
        }
      }
    }
    else if (index !== -1) {
      checked.splice(index, 1);
    }
    if (children && children.length > 0) {
      checkChildren({
        list: children,
        checkedKeys,
        isChecked,
        fieldNames,
      });
    }
  });
};

/* 获取树节点 */
const renderTreeNodes = ({ data, fieldNames, fileIcon}) => {
  const { id: idField, children: childrenField, title: titleField, isLeaf: isLeafField } = fieldNames;
  return data.map((item) => {
    const { [idField]: key, [childrenField]: children, [titleField]: title, [isLeafField]: isLeaf } = item;
    if (children) {
      return (
        <TreeNode
          title={title}
          key={key}
          dataRef={item}
          selectable={false}
          icon={({ expanded }) => {
            return (
              <Icon type={expanded ? 'folder-open' : 'folder'} />
            )
          }}
        >
          {renderTreeNodes({
            data: children,
            fieldNames,
            fileIcon,
          })}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        title={title}
        key={key}
        dataRef={item}
        isLeaf={!!isLeaf}
        selectable={false}
        icon={<Icon type={isLeaf ? fileIcon : "folder"} />}
      />
    );
  });
};

export default class AsyncTreeModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    maskClosable: PropTypes.bool,
    keyboard: PropTypes.bool,
    destroyOnClose: PropTypes.bool,
    confirmLoading: PropTypes.bool,
    loading: PropTypes.bool,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    tree: PropTypes.shape({
      dataSource: PropTypes.array.isRequired,
      showIcon: PropTypes.bool,
      fileIcon: PropTypes.string,
      checkable: PropTypes.bool.isRequired,
      expandedKeys: PropTypes.array,
      checkedKeys: PropTypes.shape({
        checked: PropTypes.array,
        halfChecked: PropTypes.array,
      }),
      loadData: PropTypes.func.isRequired,
      onCheck: PropTypes.func,
    }).isRequired,
  }

  static defaultProps = {
    maskClosable: false,
    keyboard: false,
    destroyOnClose: true,
    confirmLoading: false,
    loading: false,
    okText: '确定',
    cancelText: '取消',
  }

  constructor(props) {
    super(props);
    const { expandedKeys, checkedKeys } = props;
    this.state = {
      expandedKeys: expandedKeys || [],
      checkedKeys: checkedKeys || { checked: [], halfChecked: [] },
      autoExpandParent: true,
      // searchValue: '',
    }
  }



  // /* 搜索框查询 */
  // handleSearch = (value) => {
  //   const searchValue = value.trim();
  //   if (searchValue) {
  //     // 调用接口获取根据搜索框输入的内容匹配得到的树
  //     this.setState({
  //       searchValue,
  //       autoExpandParent: true,
  //     });
  //   }
  // }

  /* 异步加载数据 */
  handleLoadData = (treeNode) => {
    return new Promise((resolve) => {
      const { props: { dataRef, children, checked: isChecked } } = treeNode;
      if (children) {
        resolve();
        return;
      }
      const { tree: { loadData, fieldNames } } = this.props;
      const { checkedKeys } = this.state;
      loadData(dataRef, (list) => {
        checkChildren({
          list,
          checkedKeys,
          isChecked,
          fieldNames: {
            ...defaultFieldNames,
            ...fieldNames,
          },
        });
        resolve();
      });
    });
  }

  /* 展开事件 */
  handleExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  /* check事件 */
  handleCheck = (checkedKeys, { checked: isChecked, node: { props: { dataRef: { children, parentIds } } } }) => {
    const { tree: { fieldNames, dataSource } } = this.props;
    if (parentIds !== '0') {
      checkParents({
        list: dataSource,
        parentIds,
        checkedKeys,
        fieldNames: {
          ...defaultFieldNames,
          ...fieldNames,
        },
      });
    }
    if (children && children.length > 0) {
      checkChildren({
        list: children,
        checkedKeys,
        isChecked,
        fieldNames: {
          ...defaultFieldNames,
          ...fieldNames,
        },
      });
    }
    this.setState({
      checkedKeys,
    });
  }

  handleOk = () => {
    const { onOk } = this.props;
    const { checkedKeys } = this.state;
    onOk(checkedKeys);
  }

  render() {
    const { expandedKeys, checkedKeys, autoExpandParent } = this.state;
    const {
      visible,
      title,
      maskClosable,
      keyboard,
      destroyOnClose,
      confirmLoading,
      loading,
      okText,
      cancelText,
      onCancel,
      tree: {
        dataSource,
        showIcon,
        fileIcon,
        checkable,
        fieldNames,
      },
    } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        maskClosable={maskClosable}
        keyboard={keyboard}
        destroyOnClose={destroyOnClose}
        confirmLoading={confirmLoading}
        okText={okText}
        cancelText={cancelText}
        onOk={this.handleOk}
        onCancel={onCancel}
      >
        <Spin spinning={loading}>
          {/* <Search
            onSearch={this.handleSearch}
            onPressEnter={this.handleSearch}
            style={{ marginBottom: 8 }}
          /> */}
          <Tree
            showIcon={showIcon || true}
            checkable={checkable}
            checkStrictly
            autoExpandParent={autoExpandParent}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            loadData={this.handleLoadData}
            onExpand={this.handleExpand}
            onCheck={this.handleCheck}
          >
            {renderTreeNodes({
              data: dataSource,
              fieldNames: {
                ...defaultFieldNames,
                ...fieldNames,
              },
              fileIcon: fileIcon || 'video-camera',
            })}
          </Tree>
        </Spin>
      </Modal>
    );
  };
}
