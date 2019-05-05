import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import RoleDetail from '../Role/RoleDetail';
import codes from '@/utils/codes';
import { COMMON_LIST_URL as LIST_URL, COMMON_EDIT_URL as EDIT_URL } from '@/pages/RoleAuthorization/Role/utils';

@connect(({ account, commonRole, user, loading }) => ({
  account,
  role: commonRole,
  user,
  loading: loading.models.commonRole,
}))
export default class CommonRoleDetail extends PureComponent {
  fetchUnitTypes = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'account/fetchOptions', ...action });
  };

  fetchDetail = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchDetail', ...action });
  };

  fetchPermissionTree = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'commonRole/fetchPermissionTree', ...action });
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
        type={1}
        codes={codes.commonRole}
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
