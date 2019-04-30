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

@connect(({ account, userRole, user, loading }) => ({
  account,
  role: userRole,
  user,
  loading: loading.models.userRole,
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
    dispatch({ type: 'userRole/savePermissionTree', payload: [[], []] });
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
        type={0}
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
        goToDetail={this.goToDetail}
        goToAdd={this.goToAdd}
        {...this.props}
      />
    );
  }
}
