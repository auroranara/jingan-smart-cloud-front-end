import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import RoleDetail from '../Role/RoleDetail';
import codes from '@/utils/codes';
import { PRIVATE_LIST_URL as LIST_URL, PRIVATE_EDIT_URL as EDIT_URL } from '@/pages/RoleAuthorization/Role/utils';

@connect(({ account, userRole, user, loading }) => ({
  account,
  role: userRole,
  user,
  loading: loading.models.userRole,
}))
export default class CommonRoleDetail extends PureComponent {
  fetchUnitTypes = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'account/fetchOptions', ...action });
  };

  fetchDetail = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/fetchDetail', ...action });
  };

  fetchPermissionTree = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'userRole/fetchPermissionTree', ...action });
  };

  goBack() {
    router.push(LIST_URL);
  }

  goToEdit = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`${EDIT_URL}/${id}`);
  }

  render() {
    return (
      <RoleDetail
        type={0}
        codes={codes.userRole}
        fetchUnitTypes={this.fetchUnitTypes}
        fetchDetail={this.fetchDetail}
        fetchPermissionTree={this.fetchPermissionTree}
        goBack={this.goBack}
        goToEdit={this.goToEdit}
        {...this.props}
      />
    );
  }
}
