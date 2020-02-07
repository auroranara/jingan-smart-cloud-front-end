import React, { Component } from 'react';
import Company from './Company';
import Vehicle from './Vehicle';
import { connect } from 'dva';
import styles from './index.less';

export const CODE_PREFIX = 'licensePlateRecognitionSystem.vehicleManagement.index';
export const URL_PREFIX = '/license-plate-recognition-system/vehicle-management/index';
export const EmptyData = () => <span className={styles.emptyData}>暂无数据</span>;
export const STATUSES = [{ key: '1', value: '正常' }, { key: '0', value: '停用' }];
export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '车辆管理', name: '车辆管理' },
];

@connect(({ user }) => ({
  user,
}))
export default class VehicleList extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  render() {
    const {
      match: {
        params: { unitId: id1 },
      },
      user: { currentUser: { unitType, unitId: id2, permissionCodes } = {} },
    } = this.props;
    const isUnit = unitType === 4;
    const unitId = isUnit ? id2 : id1;
    const hasAddAuthority = permissionCodes.includes(`${CODE_PREFIX}.add`);
    const hasDetailAuthority = permissionCodes.includes(`${CODE_PREFIX}.detail`);
    const hasEditAuthority = permissionCodes.includes(`${CODE_PREFIX}.edit`);
    const hasDeleteAuthority = permissionCodes.includes(`${CODE_PREFIX}.delete`);

    return unitId ? (
      <Vehicle
        isUnit={isUnit}
        unitId={unitId}
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
