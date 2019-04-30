import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import codes from '@/utils/codes';
import RoleHandler from '../Role/RoleHandler';
import { PRIVATE_LIST_URL as LIST_URL, PRIVATE_URLS as URLS, isAdmin } from '../Role/utils';

@connect(({ account, userRole, user, loading }) => ({
  account,
  role: userRole,
  user,
  unitsLoading: loading.effects['userRole/fetchUnits'],
  loading: loading.models.userRole,
}))
export default class CommonRoleHandler extends PureComponent {
  fetchUnitTypes = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'account/fetchOptions', ...action });
  };

  fetchDetail = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/fetchDetail', ...action });
  };

  insertRole = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/insertRole', ...action });
  };

  updateRole = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/updateRole', ...action });
  };

  clearDetail = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/saveDetail', payload: {} });
  };

  fetchPermissionTree = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/fetchPermissionTree', ...action });
  };

  fetchCompanyPermissionTree = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/fetchCompanyPermissionTree', ...action });
  };

  clearPermissionTree = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/savePermissionTree', payload: [[], []] });
  };

  fetchUnits = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/fetchUnits', ...action });
  };

  clearUnits = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/saveUnits', payload: [] });
  };

  goBack() {
    router.push(LIST_URL);
  };

  render() {
    const { user: { currentUser: { unitId, unitType } } } = this.props;
    const isAdm = isAdmin(unitType);

    return (
      <RoleHandler
        type={0}
        urls={URLS}
        companyId={isAdm ? null : unitId} // 不存在即为管理员或运营
        codes={codes.commonRole}
        fetchUnitTypes={this.fetchUnitTypes}
        fetchDetail={this.fetchDetail}
        insertRole={this.insertRole}
        updateRole={this.updateRole}
        clearDetail={this.clearDetail}
        fetchPermissionTree={isAdm ? this.fetchPermissionTree : this.fetchCompanyPermissionTree}
        clearPermissionTree={this.clearPermissionTree}
        fetchUnits={this.fetchUnits}
        clearUnits={this.clearUnits}
        goBack={this.goBack}
        {...this.props}
      />
    );
  }
}
