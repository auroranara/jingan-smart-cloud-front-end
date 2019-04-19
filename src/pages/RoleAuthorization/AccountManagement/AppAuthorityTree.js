import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Tree } from 'antd';

import { renderTreeNodes, sortTree, getNoRepeat, getIdMaps } from './utils';

// @connect(({ role, loading }) => ({ role, loading: loading.effects['role/fetchPermissionTree'] }))
export default class AthorityTree extends PureComponent {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchTree();
    // 清空detail，以免从角色页面跳过来时，渲染其获取的detail
    dispatch({
      type: 'role/saveRoleAppPermissions',
      payload: [],
    });
  }

  componentDidUpdate(prevProps) {
    const { treeType: prevTreeType } = prevProps;
    const { treeType } = this.props;
    if (treeType !== prevTreeType)
      this.fetchTree();
  }

  fetchTree = () => {
    const { dispatch, setIdMaps, setPermissions, treeType } = this.props;
    dispatch({
      type: 'role/fetchAppPermissionTree',
      payload: { type: treeType },
      callbackLast: tree => {
        // console.log('tree', tree);
        // console.log(getIdMaps(tree));
        setIdMaps(getIdMaps(tree));
        sortTree(tree);

        // 为了修正当在父组件中调用设置permissions树的值时，当前接口还没有完成，所以在两个接口中都设置permissions树的值，
        // 在调用函数中判断，当某个接口的值未返回时，不作处理，当两个接口的值都返回时，才真正处理数据并设置值
        setPermissions && setPermissions();
      },
    });
  };

  onCheck = (checkedKeys) => {
    // role.rolePermissions已将返回结果的字符串处理成数组并去重
    const { form: { setFieldsValue }, role: { roleAppPermissions }, handleChangeAuthTreeCheckedKeys } = this.props;
    // 获得树中选中的值去掉角色对应的权限值后多余的权限值，并缓存到父组件中
    handleChangeAuthTreeCheckedKeys(getNoRepeat(checkedKeys, roleAppPermissions));

    // console.log('onCheck', checkedKeys, appPermissions && appPermissions.split(','));
    setFieldsValue({ appPermissions: checkedKeys });
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    const { role: { appPermissionTree, roleAppPermissions }, form: { getFieldDecorator } } = this.props;
    const { expandedKeys, autoExpandParent } = this.state;
    // console.log(appPermissionTree);

    return getFieldDecorator('appPermissions', { valuePropName: 'checkedKeys' })(
      <Tree
        checkable
        onCheck={this.onCheck}
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
      >
        {renderTreeNodes(appPermissionTree, roleAppPermissions, 'childMenus', 'showZname', 'id')}
        {/* {renderTreeNodes(appPermissionTree, [], 'childMenus', 'showZname', 'id')} */}
      </Tree>
    );
  }
}
