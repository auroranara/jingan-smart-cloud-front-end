import React, { PureComponent } from 'react';
import { Drawer } from 'antd';

/**
 * description: 点位巡查抽屉
 * author: sunkai
 * date: 2018年12月05日
 */
export default class PointInspectionDrawer extends PureComponent {
  render() {
    const {
      visible,
      onClose,
    } = this.props

    return (
      <Drawer visible={visible} onClose={onClose}>123</Drawer>
    );
  }
}
