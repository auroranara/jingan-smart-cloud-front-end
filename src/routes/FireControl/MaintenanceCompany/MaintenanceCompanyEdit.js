import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;

@connect(({ maintenanceCompany, loading }) => ({
  maintenanceCompany,
  loading: loading.effects['maintenanceCompany/fetchDetail'],
}))
export default class MaintenanceCmpanyDetail extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch({
      type: 'maintenanceCompany/fetchDetail',
      payload: id,
    });
  }

  render() {
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '消防维保',
      },
      {
        title: '维保公司',
        href: '/fire-control/maintenance-company/list',
      },
      {
        title: '修改维保单位',
      },
    ];

    return (
      <PageHeaderLayout title="修改维保单位" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <DescriptionList title="" style={{ marginBottom: 32 }}>
            <Description term="维保单位">1000000000</Description>
            <Description term="企业状态">111</Description>
            <Description term="是否为分公司">1234123421</Description>
            <Description term="所属总公司">dfg</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
