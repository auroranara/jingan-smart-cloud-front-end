import React, { Component } from 'react';
import Company from './Company';
import Vehicle from './Vehicle';
import { connect } from 'dva';
import styles from './index.less';

export const CODE_PREFIX = 'vehicleManagement';
export const LIST_URL = '/vehicle-management/list';
export const ADD_URL = '/vehicle-management/add';
export const DETAIL_URL = '/vehicle-management/detail';
export const EDIT_URL = '/vehicle-management/edit';
export const EmptyData = () => <span className={styles.emptyData}>暂无数据</span>;
export const STATUSES = [{ key: '1', value: '正常' }, { key: '0', value: '停用' }];

@connect(({ user }) => ({
  user,
}))
export default class List extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.id !== this.props.match.params.id;
  }

  render() {
    const {
      match: {
        params: { id },
      },
      user: { currentUser: { unitType, unitId, permissionCodes } = {} },
    } = this.props;
    const isUnit = unitType === 4;
    const companyId = isUnit ? unitId : id;
    const hasAddAuthority = permissionCodes.includes(`${CODE_PREFIX}.add`);
    const hasDetailAuthority = permissionCodes.includes(`${CODE_PREFIX}.detail`);
    const hasEditAuthority = permissionCodes.includes(`${CODE_PREFIX}.edit`);
    const hasDeleteAuthority = permissionCodes.includes(`${CODE_PREFIX}.delete`);

    return companyId ? (
      <Vehicle
        isUnit={isUnit}
        unitId={companyId}
        hasAddAuthority={hasAddAuthority}
        hasDetailAuthority={hasDetailAuthority}
        hasEditAuthority={hasEditAuthority}
        hasDeleteAuthority={hasDeleteAuthority}
      />
    ) : (
      <Company hasAddAuthority={hasAddAuthority} />
    );
  }
}
