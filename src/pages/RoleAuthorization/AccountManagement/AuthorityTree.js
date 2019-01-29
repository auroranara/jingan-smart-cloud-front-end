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
    const { dispatch, setIdMaps, setPermissions } = this.props;
    dispatch({
      type: 'role/fetchPermissionTree',
      success: tree => {
        // console.log('tree', tree);
        // console.log(getIdMaps(tree));
        setIdMaps(getIdMaps(tree));
        sortTree(tree);

        // 为了修正当在父组件中调用设置permissions树的值时，当前接口还没有完成，所以在两个接口中都设置permissions树的值，
        // 在调用函数中判断，当某个接口的值未返回时，不作处理，当两个接口的值都返回时，才真正处理数据并设置值
        setPermissions && setPermissions();
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
