import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

import { TABS } from './utils';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PointEdit from './PointEdit';
import EquipmentEdit from './EquipmentEdit';
import ScreenEdit from './ScreenEdit';

const TAB_COMS = [PointEdit, EquipmentEdit, ScreenEdit];

@connect(({ checkPoint, loading }) => ({
  checkPoint,
  loading: loading.models.checkPoint,
  listLoading: loading.effects['checkPoint/fetchCheckList'],
}))
export default class CheckEdit extends PureComponent {
  // componentDidMount() {
  //   const {  } = this.props;
  //   if (this.isEdit())

  // }

  isEdit() {
    const { match: { params: { id } } } = this.props;
    return !!id;
  }

  render() {
    const { match: { params: { tabIndex } } } = this.props;
    const Component = TAB_COMS[tabIndex];

    const title = `新增${TABS[tabIndex]}`;
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员在岗在位管理', name: '人员在岗在位管理' },
      { title: '卡口信息', name: '卡口信息', href: '/personnel-management/check-point/company-list' },
      { title: '卡口列表', name: '卡口列表', href: `/personnel-management/check-point/list/companyId/${tabIndex}` },
      { title, name: title },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          <Component {...this.props} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
