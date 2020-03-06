import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { TreeNode } = Tree;
const API = 'licensePlateRecognitionSystem/getChannelAuthorizationTree';
const TYPES = [{ key: '0', value: '全部通道' }, { key: '1', value: '部分通道' }];

@connect(
  ({
    licensePlateRecognitionSystem: { channelAuthorizationTree },
    loading: {
      effects: { [API]: loading },
    },
  }) => ({
    channelAuthorizationTree,
    loading,
  }),
  (dispatch, { unitId }) => ({
    getChannelAuthorizationTree(payload, callback) {
      dispatch({
        type: API,
        payload: {
          companyId: unitId,
          parkStatus: '1',
          ...payload,
        },
        callback,
      });
    },
  })
)
export default class ChannelAuthorization extends Component {
  componentDidMount() {
    const { getChannelAuthorizationTree } = this.props;
    getChannelAuthorizationTree();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.channelAuthorizationTree !== this.props.channelAuthorizationTree ||
      nextProps.loading !== this.props.loading ||
      nextProps.value !== this.props.value
    );
  }

  handleCheck = checkedKeys => {
    const { channelAuthorizationTree, onChange } = this.props;
    onChange &&
      onChange(
        channelAuthorizationTree.reduce((result, { key, children }) => {
          return result.concat(
            checkedKeys.includes(key)
              ? {
                  id: key,
                  type: TYPES[1].key,
                  children: children
                    ? children.map(({ key, gateId }) => ({
                        id: key,
                        gateId,
                      }))
                    : [],
                }
              : children && children.find(({ key }) => checkedKeys.includes(key))
                ? {
                    id: key,
                    type: TYPES[1].key,
                    children: children.reduce((result, { key, gateId }) => {
                      if (checkedKeys.includes(key)) {
                        result.push({
                          id: key,
                          gateId,
                        });
                      }
                      return result;
                    }, []),
                  }
                : []
          );
        }, [])
      );
  };

  renderTreeNodes = data => {
    return data.map(item => (
      <TreeNode
        title={item.title}
        key={item.key}
        dataRef={item}
        children={item.children ? this.renderTreeNodes(item.children) : []}
      />
    ));
  };

  render() {
    const { channelAuthorizationTree = [], loading = false, type, value = [] } = this.props;
    const checkable = type !== 'span';
    const checkedKeys = value.reduce((checkedKeys, { id, type, children }) => {
      const data = channelAuthorizationTree.find(item => item.key === id);
      return data
        ? checkedKeys
            .concat(
              type === TYPES[0].key && data.children
                ? data.children.map(({ key }) => key)
                : children
                  ? children.map(({ id }) => id)
                  : []
            )
            .concat(
              !(data.children && data.children.length) ||
              (children && children.length === data.children.length)
                ? [id]
                : []
            )
        : checkedKeys;
    }, []);
    return (
      <Spin spinning={loading}>
        <Tree
          checkedKeys={checkedKeys}
          onCheck={this.handleCheck}
          checkable={checkable}
          selectable={false}
        >
          {this.renderTreeNodes(
            checkable
              ? channelAuthorizationTree
              : channelAuthorizationTree.reduce((result, item) => {
                  const { key, children } = item;
                  return result.concat(
                    checkedKeys.includes(key)
                      ? item
                      : children && children.find(({ key }) => checkedKeys.includes(key))
                        ? {
                            ...item,
                            children: children.filter(({ key }) => checkedKeys.includes(key)),
                          }
                        : []
                  );
                }, [])
          )}
        </Tree>
      </Spin>
    );
  }
}
