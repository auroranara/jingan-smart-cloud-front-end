import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form } from 'antd';

import RoleList from '../Role/RoleList';
import codes from '@/utils/codes';
import { COMMON_DETAIL_URL as DETAIL_URL, COMMON_ADD_URL as ADD_URL, COMMON_URLS as URLS } from '../Role/utils';

const TITLE = '公共角色';
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

@connect(({ account, commonRole, user, loading }) => ({
  account,
  role: commonRole,
  user,
  loading: loading.models.commonRole,
}))
@Form.create()
export default class CommonRoleList extends PureComponent {
  fetchUnitTypes = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'account/fetchOptions', ...action });
  };

  fetchList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchList', ...action });
  };

  appendList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/appendList', ...action });
  };

  remove = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/remove', ...action });
  };

  fetchPermissionTree = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchPermissionTree', ...action });
  };

  clearPermissionTree = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/savePermissionTree', payload: [[], []] });
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
        type={1}
        urls={URLS}
        codes={codes.commonRole}
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
