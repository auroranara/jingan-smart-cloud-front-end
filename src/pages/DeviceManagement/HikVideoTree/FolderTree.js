import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Tree, Icon, Spin } from 'antd';

const { TreeNode } = Tree;

@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/fetchFolderTree'],
}))
export default class FolderTree extends PureComponent {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    selectedKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'video/fetchFolderTree',
      callback: () => {
        // 默认展开第一个
        // if (list && list.length) {
        //   this.setState({
        //     expandedKeys: [...this.state.expandedKeys, list[0].id],
        //   });
        // }
      },
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 选择文件夹
  onSelect = (selectedKeys) => {
    this.setState({
      selectedKeys,
    });
    this.props.handleFormReset(selectedKeys[0]);
  };

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            icon={<Icon type="folder" />}
            title={item.name}
            key={item.id}
            dataRef={item}
            isLeaf={item.isLeaf}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          icon={<Icon type="folder" />}
          title={item.name}
          key={item.id}
          dataRef={item}
          isLeaf={item.isLeaf}
        />
      );
    });
  };

  render() {
    const {
      video: {
        folderList,
      },
      loading,
    } = this.props;
    return (
      <section>
        <Row>
          <Spin spinning={loading}>
            <Tree
              showLine
              showIcon
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {this.renderTreeNodes(folderList)}
            </Tree>
          </Spin>
        </Row>
      </section>
    );
  }
}
