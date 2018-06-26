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
        title: '维保单位详情',
      },
    ];

    /* 表单标签 */
    const fieldLabels = {
      companyName: '维保单位',
      usingStatus: '企业状态',
      isBranch: '是否为分公司',
      parnetUnitName: '所属总公司',
    };

    const {
      maintenanceCompany: { detail: data },
    } = this.props;

    return (
      <PageHeaderLayout title="维保单位详情" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <DescriptionList style={{ marginBottom: 32 }}>
            <Description term={fieldLabels.companyName}>{data.companyName}</Description>
            <Description term={fieldLabels.usingStatus}>{String(data.usingStatus)}</Description>
            <Description term={fieldLabels.isBranch}>{data.isBranch}</Description>
            <Description term={fieldLabels.parnetUnitName}>{data.parnetUnitName}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
