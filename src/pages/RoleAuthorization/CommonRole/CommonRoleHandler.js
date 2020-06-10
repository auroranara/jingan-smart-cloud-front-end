import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';

import codes from '@/utils/codes';
import RoleHandler from '../Role/RoleHandler';
import { COMMON_LIST_URL as LIST_URL, COMMON_URLS as URLS } from '../Role/utils';
import { genGoBack } from '@/utils/utils';

@connect(({ account, commonRole, user, loading }) => ({
  account,
  role: commonRole,
  user,
  loading: loading.models.commonRole,
}))
export default class CommonRoleHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, LIST_URL);
  }

  fetchUnitTypes = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'account/fetchOptions', ...action });
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
    dispatch({ type: 'commonRole/saveDetail', payload: {} });
  };

  fetchPermissionTree = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchPermissionTree', ...action });
  };

  clearPermissionTree = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/savePermissionTree', payload: [[], [], []] });
  };

  // goBack() {
  //   router.push(LIST_URL);
  // };

  render() {
    return (
      <RoleHandler
        type={1} // 0 私有角色 1 公共角色
        urls={URLS}
        codes={codes.commonRole}
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
