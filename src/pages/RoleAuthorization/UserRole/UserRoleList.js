import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from 'antd';

import RoleList from '../Role/RoleList';
import codes from '@/utils/codes';
import { PRIVATE_DETAIL_URL as DETAIL_URL, PRIVATE_ADD_URL as ADD_URL, PRIVATE_URLS as URLS } from '../Role/utils';

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
    return (
      <RoleList
        type={0}
        urls={URLS}
        codes={codes.userRole}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        fetchUnitTypes={this.fetchUnitTypes}
        fetchList={this.fetchList}
        appendList={this.appendList}
        remove={this.remove}
        fetchPermissionTree={this.fetchPermissionTree}
        clearPermissionTree={this.clearPermissionTree}
        goToDetail={this.goToDetail}
        goToAdd={this.goToAdd}
        {...this.props}
      />
    );
  }
}
