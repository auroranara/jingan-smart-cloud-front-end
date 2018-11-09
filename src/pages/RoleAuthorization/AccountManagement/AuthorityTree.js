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
      type: 'role/saveRolePermissions',
      payload: [],
    });
  }

  onCheck = (checkedKeys) => {
    // role.rolePermissions已将返回结果的字符串处理成数组并去重
    const { form: { setFieldsValue }, role: { rolePermissions }, handleChangeAuthTreeCheckedKeys } = this.props;
    // 获得树中选中的值去掉角色对应的权限值后多余的权限值，并缓存到父组件中
    handleChangeAuthTreeCheckedKeys(getNoRepeat(checkedKeys, rolePermissions));

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
    const { role: { permissionTree, rolePermissions }, form: { getFieldDecorator } } = this.props;
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
        {renderTreeNodes(permissionTree, rolePermissions, 'childMenus', 'showZname', 'id')}
        {/* {renderTreeNodes(permissionTree, [], 'childMenus', 'showZname', 'id')} */}
      </Tree>
    );
  }
}
