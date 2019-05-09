import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Badge } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codesMap from '@/utils/codes';
import { AuthButton } from '@/utils/customAuth';

const { Description } = DescriptionList;

// 标题
const title = '查看单位分部详情';

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ unitDivision, user, loading }) => ({
  unitDivision,
  user,
  loading: loading.models.unitDivision,
}))
@Form.create()
export default class UnitDivisionDetail extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取详情
    dispatch({
      type: 'unitDivision/fetchDivisionDetail',
      payload: {
        id,
      },
    });
  }

  // 返回到编辑页面
  goToEdit = (id, unitId) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/base-info/company/division/edit/${id}?companyId=${unitId}`));
  };

  /* 渲染详情 */
  renderDetail() {
    const {
      match: {
        params: { id },
      },
      unitDivision: {
        detail: {
          data: { name, address, chargeName, phone, unitId },
        },
      },
    } = this.props;
    console.log('this.props', this.props);
    return (
      <Card bordered={false}>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="单位名称">{name || getEmptyData()}</Description>
          <Description term="地址">{address || getEmptyData()}</Description>
          <Description term="负责人">{chargeName || getEmptyData()}</Description>
          <Description term="联系电话">{phone || getEmptyData()}</Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <AuthButton
            type="primary"
            size="large"
            code={codesMap.company.division.edit}
            onClick={() => {
              this.goToEdit(id, unitId);
            }}
          >
            编辑
          </AuthButton>
        </div>
      </Card>
    );
  }

  render() {
    const {
      location: {
        query: { companyId },
      },
    } = this.props;
    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '单位管理',
        name: '单位管理',
        href: '/base-info/company/list',
      },
      {
        title: '单位分部',
        name: '单位分部',
        href: `/base-info/company/division/list/${companyId}`,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
