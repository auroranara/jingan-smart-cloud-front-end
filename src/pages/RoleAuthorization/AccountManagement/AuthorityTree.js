import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Tree } from 'antd';

import { renderTreeNodes, sortTree } from './utils';

// @connect(({ role, loading }) => ({ role, loading: loading.effects['role/fetchPermissionTree'] }))
export default class AthorityTree extends PureComponent {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchPermissionTree',
      success: tree => sortTree(tree),
    });
    dispatch({
      type: 'role/queryDetail',
      payload: {},
    })
  }

  onCheck = (checkedKeys) => {
    // role.detail.permissions 是个数组拼接成的字符串
    const { form: { setFieldsValue }, role: { detail: { permissions } } } = this.props;

    // console.log('onCheck', checkedKeys, permissions);
    setFieldsValue({ permissions: [...permissions.split(','), ...checkedKeys] });
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    const { role: { permissionTree, detail: { permissions } }, form: { getFieldDecorator } } = this.props;
    const { expandedKeys, autoExpandParent } = this.state;
    // console.log(permissionTree);

    return getFieldDecorator('permissions', { valuePropName: 'checkedKeys' })(
      <Tree
        checkable
        onCheck={this.onCheck}
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      >
        {renderTreeNodes(permissionTree, permissions, 'childMenus', 'showZname', 'id')}
      </Tree>
    );
  }
}
