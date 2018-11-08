import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Tree } from 'antd';

import { renderTreeNodes, sortTree, mergeArrays, getNoRepeat, getIdMaps } from './utils';

// @connect(({ role, loading }) => ({ role, loading: loading.effects['role/fetchPermissionTree'] }))
export default class AthorityTree extends PureComponent {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    const { dispatch, setIdMaps } = this.props;
    dispatch({
      type: 'role/fetchPermissionTree',
      success: tree => {
        // console.log('tree', tree);
        // console.log(getIdMaps(tree));
        setIdMaps(getIdMaps(tree));
        sortTree(tree);
      },
    });
    // 清空detail，以免从角色页面跳过来时，渲染其获取的detail
    dispatch({
      type: 'role/queryDetail',
      payload: {},
    });
  }

  onCheck = (checkedKeys) => {
    // role.detail.permissions 是个数组拼接成的字符串
    const { form: { setFieldsValue }, role: { detail: { permissions } }, handleChangeAuthTreeCheckedKeys } = this.props;
    handleChangeAuthTreeCheckedKeys(getNoRepeat(checkedKeys, permissions));

    // console.log('onCheck', checkedKeys, permissions && permissions.split(','));
    setFieldsValue({ permissions: checkedKeys });
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
        {/* {renderTreeNodes(permissionTree, [], 'childMenus', 'showZname', 'id')} */}
      </Tree>
    );
  }
}
