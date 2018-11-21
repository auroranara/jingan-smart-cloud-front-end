import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';

import AsyncTreeModal from '../../components/AsyncTreeModal';

export default class Text extends PureComponent {
  state = {
    tree: [
      {
        title: 'Expand to load',
        key: 'a',
        children: [
          { title: 'Expand to load', key: 'd', parentIds: '0,a' },
          {
            title: 'Tree Node',
            key: 'e',
            children: [
              { title: 'Expand to load', key: 'f', parentIds: '0,a,e' },
              { title: 'Tree Node', key: 'g', parentIds: '0,a,e' },
            ],
            parentIds: '0,a',
          },
        ],
        parentIds: '0',
      },
      { title: 'Expand to load', key: 'b', parentIds: '0', isLeaf: true },
      { title: 'Tree Node', key: 'c', parentIds: '0', isLeaf: true },
    ],
    visible: false,
    confirmLoading: false,
  };

  handleShowModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleHideModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = checkedKeys => {
    this.setState({
      confirmLoading: true,
    });
    // 这里应该调用接口将checkedKeys保存到数据库
    setTimeout(() => {
      // console.log(checkedKeys);
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 1000);
  };

  handleLoadData = (data, callback) => {
    const { key, parentIds } = data;
    this.setState({
      loading: true,
    });
    // 调用接口获取当前节点的子元素
    setTimeout(() => {
      const list = [
        {
          title: 'Child Node',
          key: `${+new Date()}`,
          parentIds: `${parentIds},${key}`,
          isLeaf: Math.random() > 0.5,
        },
        {
          title: 'Child Node',
          key: `${+new Date() + 1}`,
          parentIds: `${parentIds},${key}`,
          isLeaf: Math.random() > 0.5,
        },
      ];
      // callback必须调用
      callback(list);
      data.children = list; // eslint-disable-line
      this.setState({
        tree: [...this.state.tree],
        loading: false,
      });
    }, 1000);
  };

  render() {
    const { visible, confirmLoading, loading, tree } = this.state;

    return (
      <Card>
        <Button type="primary" onClick={this.handleShowModal}>
          显示弹出框
        </Button>
        <AsyncTreeModal
          visible={visible}
          confirmLoading={confirmLoading}
          loading={loading}
          title="设置视频权限"
          onCancel={this.handleHideModal}
          onOk={this.handleOk}
          tree={{
            dataSource: tree,
            checkable: false,
            loadData: this.handleLoadData,
            fieldNames: {
              id: 'key',
            },
          }}
        />
      </Card>
    );
  }
}
