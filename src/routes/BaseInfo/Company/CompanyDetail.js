import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '基础信息',
  },
  {
    title: '企业单位',
    href: '/base-info/company/list',
  },
  {
    title: '单位详情',
  },
];

@connect(
  ({ companydetail, loading }) => ({
    companydetail,
    loading,
  }),
  dispatch => ({
    fetch(action) {
      dispatch({
        type: 'fetch',
        ...action,
      });
    },
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  render() {
    return (
      <PageHeaderLayout title="单位详情" breadcrumbList={breadcrumbList}>
        <div>123</div>
      </PageHeaderLayout>
    );
  }
}
