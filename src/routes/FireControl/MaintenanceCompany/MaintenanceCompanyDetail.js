import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;

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
    title: '维保公司详情',
  },
];
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ maintenanceCompany, loading }) => ({
  maintenanceCompany,
  loading: loading.models.maintenanceCompany,
}))
export default class maintenanceCompanyDetail extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // console.log(id);
    dispatch({
      type: 'maintenanceCompany/fetchMaintenanceCompany',
      payload: id,
    });
  }

  // 渲染信息
  renderdetail() {
    const {
      maintenanceCompany: {
        detail: { data },
      },
    } = this.props;
    return (
      <PageHeaderLayout title="维保公司详情" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <DescriptionList>
            <Description term="维修单位：">{data.companyName || getEmptyData()}</Description>
            <Description term="启用状态：">{data.usingStatus || getEmptyData()}</Description>
            <Description term="是否为分公司：">{data.isBranch || getEmptyData()}</Description>
            <Description term="总公司名称：">{data.parnetUnitName || getEmptyData()}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
