import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from 'antd';

import RoleList from '../Role/RoleList';
import codes from '@/utils/codes';
import { PRIVATE_DETAIL_URL as DETAIL_URL, PRIVATE_ADD_URL as ADD_URL, PRIVATE_URLS as URLS, isAdmin } from '../Role/utils';

const TITLE = '用户角色';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '角色权限',
    name: '角色权限',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];

@connect(({ account, commonRole, userRole, user, loading }) => ({ // 之前把同步角色放到了公共角色模块里，放错了，这里为了省事，就直接延用
  account,
  role: { ...userRole, modalUnitList: commonRole.unitList },
  user,
  loading: loading.models.userRole,
  modalUnitsLoading: loading.effects['commonRole/fetchUnits'],
}))
@Form.create()
export default class CommonRoleList extends PureComponent {
  fetchUnitTypes = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'account/fetchOptions', ...action });
  };

  fetchList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/fetchList', ...action });
  };

  appendList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/appendList', ...action });
  };

  remove = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/remove', ...action });
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
    dispatch({ type: 'userRole/savePermissionTree', payload: [[], [], []] });
  };

  fetchUnits = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchUnits', ...action }); // 延用commonRole里的内容
  };

  syncRoles = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/syncRoles', ...action });
  };

  goToDetail(id) {
    router.push(`${DETAIL_URL}/${id}`);
  }

  goToAdd() {
    router.push(ADD_URL);
  }

  render() {
    const { user: { currentUser: { unitId, unitType } } } = this.props;
    const isAdm = isAdmin(unitType);

    return (
      <RoleList
        type={0} // 0 私有角色 1 公共角色
        companyId={isAdm ? null : unitId} // 不存在即为管理员或运营
        urls={URLS}
        codes={codes.userRole}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        fetchUnitTypes={this.fetchUnitTypes}
        fetchList={this.fetchList}
        appendList={this.appendList}
        remove={this.remove}
        fetchPermissionTree={isAdm ? this.fetchPermissionTree : this.fetchCompanyPermissionTree}
        clearPermissionTree={this.clearPermissionTree}
        fetchUnits={this.fetchUnits}
        syncRoles={this.syncRoles}
        goToDetail={this.goToDetail}
        goToAdd={this.goToAdd}
        {...this.props}
      />
    );
  }
}
