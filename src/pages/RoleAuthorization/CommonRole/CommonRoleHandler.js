import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import RoleHandler from '../Role/RoleHandler';

@connect(({ account, commonRole, user, loading }) => ({
  account,
  role: commonRole,
  user,
  loading: loading.models.commonRole,
}))
export default class CommonRoleHandler extends PureComponent {
  fetchUnitTypes = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchOptions',
      ...action,
    });
  };

  fetchDetail = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchDetail', ...action });
  };

  insertRole = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/insertRole', ...action });
  };

  updateRole = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/updateRole', ...action });
  };

  clearDetail = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/clearDetail' });
  };

  fetchPermissionTree = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchPermissionTree', ...action });
  };

  clearPermissionTree = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/savePermissionTree', payload: [[], []] });
  };

  goBack = () => {
    router.push('/role-authorization/commonRole/list');
  };

  render() {
    return (
      <RoleHandler
        type="common"
        fetchUnitTypes={this.fetchUnitTypes}
        fetchDetail={this.fetchDetail}
        insertRole={this.insertRole}
        updateRole={this.updateRole}
        clearDetail={this.clearDetail}
        fetchPermissionTree={this.fetchPermissionTree}
        clearPermissionTree={this.clearPermissionTree}
        goBack={this.goBack}
        {...this.props}
      />
    );
  }
}
